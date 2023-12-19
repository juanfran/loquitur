import * as path from 'path';
import { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import multipart from '@fastify/multipart';

import AutoLoad from '@fastify/autoload';

import { createContext } from './context';
import { trpcRouter } from './router';
import { appRouter } from './app-router';
// import ws from '@fastify/websocket';

export interface AppOptions {}

export async function app(fastify: FastifyInstance, opts: AppOptions) {
  // fastify.register(ws);

  fastify.register(multipart, {
    limits: {
      fileSize: 2e9,
    },
  });

  fastify.register(cors, {
    origin: true,
  });

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: { ...opts },
  });

  fastify.register(appRouter);

  fastify.register(fastifyTRPCPlugin, {
    prefix: '/trpc',
    trpcOptions: { router: trpcRouter, createContext },
  });
}
