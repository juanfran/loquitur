import fs from 'fs';

export function readJSONFile(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}
