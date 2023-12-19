import fs from 'fs';

export function getRecordings() {
  const files = fs.readdirSync('uploads');

  return files.filter((file) => fs.statSync('uploads/' + file).isDirectory());
}
