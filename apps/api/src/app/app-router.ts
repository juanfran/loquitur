import { FastifyInstance } from 'fastify';
import { pipeline } from 'node:stream';
import util from 'node:util';
import path from 'node:path';
const pump = util.promisify(pipeline);
import fs from 'fs';
import { v4 } from 'uuid';
import { runPython } from './utils/run-python';
import { readJSONFile } from './utils/read-json-file';
import { getText } from './utils/get-text';
import { fuse } from './utils/search';
import { WsEvent } from '@loquitur/commons';
import { chat } from './utils/ai-chat';
import { chats } from './utils/chats';

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
        const fileName = path.basename(part.filename, ext);
        const rootFile = 'uploads/' + id + '/';

        fs.mkdirSync(rootFile);

        const filePath = rootFile + id + ext;

        await pump(part.file, fs.createWriteStream(filePath));

        await runPython(filePath, id);

        const metadataPath = rootFile + 'metadata.json';

        const initialData = readJSONFile(metadataPath) as {
          duration: number;
          size: number;
          speakers: string[];
        };

        const metadata = {
          ...initialData,
          name: fileName,
          date: new Date().toISOString(),
        };

        // add to search
        fs.writeFileSync(metadataPath, JSON.stringify(metadata));

        const textFile = getText(id);

        textFile.forEach((it, index) => {
          fuse.add({
            id: id,
            name: fileName,
            text: it.text,
            segment: index,
          });
        });
      }
    }

    reply.send();
  });

  fastify.get('/ws', { websocket: true }, (connection) => {
    connection.socket.on('message', (message: string) => {
      const data = JSON.parse(message) as WsEvent;

      if (data.type === 'chat') {
        chat(data).subscribe((it) => {
          connection.socket.send(JSON.stringify(it));
        });
      }
    });

    connection.socket.on('close', () => {
      chats.clear();
    });
  });
}
