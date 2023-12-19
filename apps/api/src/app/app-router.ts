import { FastifyInstance } from 'fastify';
import { pipeline } from 'node:stream';
import util from 'node:util';
const pump = util.promisify(pipeline);
import fs from 'fs';

function wait() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(null);
    }, 3000);
  });
}

export async function appRouter(fastify: FastifyInstance) {
  fastify.post('/upload', async function (req, reply) {
    const parts = req.files();

    for await (const part of parts) {
      if (
        part.mimetype.startsWith('video') ||
        part.mimetype.startsWith('audio')
      ) {
        await pump(part.file, fs.createWriteStream('uploads/' + part.filename));
      }
    }

    await wait();

    reply.send();
  });
}
