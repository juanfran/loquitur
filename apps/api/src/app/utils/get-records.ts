import fs from 'fs';

export function getRecords() {
  const files = fs.readdirSync('uploads');

  return files.filter((file) => fs.statSync('uploads/' + file).isDirectory());
}
