import fs from 'fs';
import http from 'https';
import { v4 } from 'uuid';

export function downloadBBB(id: string): Promise<{ path: string; id: string }> {
  const newId = v4();
  const fileUrl = `https://video.kaleidos.net/presentation/${id}/video/webcams.webm`;
  const folder = `uploads/${newId}`;
  const path = `${folder}/${newId}.webm`;

  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }

  return new Promise((resolve) => {
    const file = fs.createWriteStream(path);

    http.get(fileUrl, (response) => {
      response.pipe(file);

      file.on('finish', () => {
        file.close();
        resolve({
          path,
          id: newId,
        });
      });
    });
  });
}
