import fs from 'fs';
import { runPython } from './run-python';
import { readJSONFile } from './read-json-file';
import { getText } from './get-text';
import { fuse } from './search';

export async function parseFile(
  fileName: string,
  filePath: string,
  id: string
) {
  await runPython(filePath, id);

  const rootFile = 'uploads/' + id + '/';

  const metadataPath = rootFile + 'metadata.json';

  const initialData = readJSONFile(metadataPath) as {
    duration: number;
    size: number;
    speakers: string[];
  };

  const metadata = {
    ...initialData,
    name: fileName,
    date: new Date().toISOString(),
  };

  // add to search
  fs.writeFileSync(metadataPath, JSON.stringify(metadata));

  const textFile = getText(id);

  textFile.forEach((it, index) => {
    fuse.add({
      id: id,
      name: fileName,
      text: it.text,
      segment: index,
    });
  });
}
