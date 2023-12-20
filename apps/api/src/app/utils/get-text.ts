import { WhisperResponse } from '@loquitur/commons';
import fs from 'fs';
import { readJSONFile } from './read-json-file';

export function getText(id: string): WhisperResponse[] | null {
  const textPath = `uploads/${id}/${id}-whisper.json`;

  if (fs.existsSync(textPath)) {
    return readJSONFile(`uploads/${id}/${id}-whisper.json`);
  }

  return null;
}
