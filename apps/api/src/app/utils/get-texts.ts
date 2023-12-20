import { getRecordings } from './get-recordings';
import { getText } from './get-text';

export function getTexts() {
  const recordings = getRecordings();

  return recordings
    .map((recording) => {
      const textFile = getText(recording.id);

      return textFile.map((it, index) => {
        return {
          id: recording.id,
          name: recording.name,
          text: it.text,
          segment: index,
        };
      });
    })
    .flat();
}
