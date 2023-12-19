import { FastifyInstance } from 'fastify';
import { pipeline } from 'node:stream';
import util from 'node:util';
import path from 'node:path';
const pump = util.promisify(pipeline);
import fs from 'fs';
import { v4 } from 'uuid';
import { runPython } from './utils/run-python';

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
        const id = v4();

        const ext = path.extname(part.filename);
        const rootFile = 'uploads/' + id + '/';

        fs.mkdirSync(rootFile);
        const filePath = rootFile + id + ext;

        await pump(part.file, fs.createWriteStream(filePath));

        await runPython(filePath, id);
      }
    }

    reply.send();
  });
}
