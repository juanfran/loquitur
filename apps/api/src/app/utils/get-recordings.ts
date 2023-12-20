import { Recording } from '@loquitur/commons';
import fs from 'fs';

export function getRecordings(): Recording[] {
  const files = fs.readdirSync('uploads');

  const ids = files.filter((file) =>
    fs.statSync('uploads/' + file).isDirectory()
  );

  return ids
    .map((id) => {
      const meta = JSON.parse(
        fs.readFileSync(`uploads/${id}/metadata.json`, 'utf8')
      );

      const imagePath = `uploads/${id}/${id}.webp`;
      let preview = '';

      if (fs.existsSync(imagePath)) {
        preview = `/public/${id}/${id}.webp`;
      }

      const video = `/public/${id}/${id}.webm`;

      return {
        id,
        ...meta,
        preview,
        video,
      };
    })
    .toSorted((a, b) => {
      return a.date > b.date ? -1 : 1;
    });
}
