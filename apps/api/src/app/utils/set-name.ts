import { Recording, WhisperResponse } from '@loquitur/commons';
import { getRecordings } from './get-recordings';
import { readJSONFile } from './read-json-file';
import fs from 'fs';

export function setName(id: string, oldName: string, name: string) {
  const recordings = getRecordings();

  const recording = recordings.find((it) => it.id === id);

  if (!recording) {
    return null;
  }

  let whisper = readJSONFile(
    `uploads/${id}/${id}-whisper.json`
  ) as WhisperResponse[];
  const metadata = readJSONFile(`uploads/${id}/metadata.json`) as Recording;

  metadata.speakers = metadata.speakers.map((it) => {
    if (it === oldName) {
      return name;
    }

    return it;
  });

  whisper = whisper.map((it) => {
    if (it.speaker === oldName) {
      it.speaker = name;
    }

    return it;
  });

  fs.writeFileSync(`uploads/${id}/metadata.json`, JSON.stringify(metadata));
  fs.writeFileSync(`uploads/${id}/${id}-whisper.json`, JSON.stringify(whisper));

  recording.speakers = metadata.speakers;

  return recording;
}
