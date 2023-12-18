import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { setConfig } from './db';

export const t = initTRPC.create();

export const appRouter = t.router({
  hi: t.procedure.query(() => {
    return { hi: true };
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

      return { success: true };
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
