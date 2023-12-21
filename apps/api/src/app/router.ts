import { TRPCError, initTRPC } from '@trpc/server';
import { z } from 'zod';
import { setConfig, getConfig } from './db';
import { getRecordings } from './utils/get-recordings';
import { getText } from './utils/get-text';
import { setName } from './utils/set-name';
import { fuse } from './utils/search';
import { BBBRecording, SearchResult } from '@loquitur/commons';
import bbb from 'bigbluebutton-js';
import { getApiBB } from './utils/bbb-api';
import fs from 'fs';

export const t = initTRPC.create();

export const trpcRouter = t.router({
  recordings: t.procedure.query(() => {
    return getRecordings();
  }),
  recording: t.procedure.input(z.string()).query(({ input }) => {
    const recordings = getRecordings();

    return recordings.find((it) => it.id === input);
  }),
  text: t.procedure.input(z.string()).query(({ input }) => {
    return getText(input);
  }),
  getConfig: t.procedure.query(() => {
    return getConfig();
  }),
  search: t.procedure.input(z.string()).query(({ input }) => {
    const result = fuse.search<SearchResult>(input);

    return result;
  }),
  bbb: t.procedure.query(async () => {
    const apiBB = await getApiBB();

    if (!apiBB) {
      return [];
    }

    const result = await bbb.http(apiBB.recording.getRecordings({}));

    const recordings: BBBRecording[] = result.recordings;

    recordings.sort((a, b) => (a.startTime > b.startTime ? -1 : 1));

    return recordings;
  }),
  setName: t.procedure
    .input(
      z.object({
        id: z.string(),
        oldName: z.string(),
        name: z.string(),
      })
    )
    .mutation(async (opts) => {
      const result = setName(
        opts.input.id,
        opts.input.oldName,
        opts.input.name
      );

      if (!result) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      return result;
    }),
  setConfig: t.procedure
    .input(
      z.object({
        bbbUrl: z.string().optional(),
        bbbApiKey: z.string().max(150).optional(),
        chatApi: z.string().max(150).optional(),
      })
    )
    .mutation(async (opts) => {
      await setConfig(opts.input);

      return await getConfig();
    }),
  deleteRecording: t.procedure.input(z.string()).mutation(async (opts) => {
    const path = './uploads/' + opts.input;

    fuse.remove((doc: { id: string }) => {
      return doc.id === opts.input;
    });

    fs.rmdirSync(path, { recursive: true });
  }),
});

// export type definition of API
export type AppRouter = typeof trpcRouter;
