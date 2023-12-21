import { FastifyInstance } from 'fastify';
import { pipeline } from 'node:stream';
import util from 'node:util';
import path from 'node:path';
const pump = util.promisify(pipeline);
import fs from 'fs';
import { v4 } from 'uuid';
import { BBBRecording, WsEvent } from '@loquitur/commons';
import { chat } from './utils/ai-chat';
import { chats } from './utils/chats';
import { parseFile } from './utils/parse-file';
import { downloadBBB } from './utils/download-bbb';
import { getApiBB } from './utils/bbb-api';
import bbb from 'bigbluebutton-js';

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

        await parseFile(fileName, filePath, id);
      }
    }

    reply.send();
  });

  fastify.route({
    method: 'POST',
    url: '/fetch-bbb/:id',
    handler: async (request, reply) => {
      const { path, id } = await downloadBBB(request.params['id']);

      const apiBB = await getApiBB();

      if (!apiBB) {
        return [];
      }

      const result = await bbb.http(
        apiBB.recording.getRecordings({ recordID: request.query['id'] })
      );

      const recordings: BBBRecording[] = result.recordings;

      await parseFile(recordings[0].name, path, id);

      reply.send();
    },
  });

  fastify.get('/ws', { websocket: true }, (connection) => {
    const id = v4();

    connection.socket.on('message', (message: string) => {
      const data = JSON.parse(message) as WsEvent;

      // console.log(data);

      if (data.type === 'chat') {
        chat(id, data).subscribe((it) => {
          connection.socket.send(
            JSON.stringify({
              type: 'chat-response',
              content: it,
            })
          );
        });
      } else if (data.type === 'init-chat') {
        chats.delete(id);
      }
    });

    connection.socket.on('close', () => {
      chats.delete(id);
    });
  });
}
