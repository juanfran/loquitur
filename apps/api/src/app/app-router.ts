import { FastifyInstance } from 'fastify';
import { pipeline } from 'node:stream';
import util from 'node:util';
import path from 'node:path';
const pump = util.promisify(pipeline);
import fs from 'fs';
import { v4 } from 'uuid';
import { runPython } from './utils/run-python';
import { WhisperResponse } from '@loquitur/commons';
import { readJSONFile } from './utils/read-json-file';

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

        const dataPath = rootFile + id + '-whisper.json';
        const data = readJSONFile(dataPath) as WhisperResponse[];
        const speakers = new Set<string>();

        data.forEach((whisper) => {
          whisper.words.forEach((word) => {
            if (word.speaker) {
              speakers.add(word.speaker);
            }
          });
        });

        const metadataPath = rootFile + 'metadata.json';

        const initialData = readJSONFile(metadataPath) as {
          duration: number;
          size: number;
        };

        const metadata = {
          ...initialData,
          name: fileName,
          speakers: Array.from(speakers),
          date: new Date().toISOString(),
        };

        fs.writeFileSync(metadataPath, JSON.stringify(metadata));
      }
    }

    reply.send();
  });
}
