import fs from 'fs';

export function readJSONFile(filePath: string) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}
