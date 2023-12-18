import { initTRPC } from '@trpc/server';

export const t = initTRPC.create();

export const appRouter = t.router({
  hi: t.procedure.query(() => {
    return { hi: true };
  }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
