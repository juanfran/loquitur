import { spawn } from 'node:child_process';

export function runPython(filePath: string, id: string) {
  return new Promise((resolve) => {
    const pyProg = spawn('python', [
      'apps/api/src/app/convert.py',
      filePath,
      id,
      process.env.HF_TOKEN,
    ]);

    pyProg.stderr.on('data', (data) => {
      console.error(data.toString());
    });

    pyProg.stdin.on('data', (data) => {
      console.log(data.toString());
    });

    pyProg.on('exit', (data) => {
      console.log('exit', data);
      resolve(data);
    });
  });
}
