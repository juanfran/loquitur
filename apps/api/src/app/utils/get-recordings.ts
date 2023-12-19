import fs from 'fs';

export function getRecordings() {
  const files = fs.readdirSync('uploads');

  const ids = files.filter((file) =>
    fs.statSync('uploads/' + file).isDirectory()
  );

  return ids.map((id) => {
    const meta = JSON.parse(
      fs.readFileSync(`uploads/${id}/metadata.json`, 'utf8')
    );

    return {
      id,
      ...meta,
    };
  });
}
