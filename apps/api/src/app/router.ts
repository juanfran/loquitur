import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { setConfig, getConfig } from './db';

export const t = initTRPC.create();

export const trpcRouter = t.router({
  getConfig: t.procedure.query(() => {
    return getConfig();
  }),
  setConfig: t.procedure
    .input(
      z.object({
        bbbUrl: z.string().optional(),
        bbbApiKey: z.string().max(150).optional(),
        openAIApiKey: z.string().max(150).optional(),
      })
    )
    .mutation(async (opts) => {
      await setConfig(opts.input);

      return await getConfig();
    }),
});

// export type definition of API
export type AppRouter = typeof trpcRouter;
