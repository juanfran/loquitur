import fs from 'fs';

const host = process.env.HOST;
const port = process.env.PORT;

const config = {
  apiURL: `http://${host}:${port}/`,
};

fs.writeFileSync(
  'apps/loquitur/src/environments/environment.ts',
  `export const environment = ${JSON.stringify({
    production: true,
    ...config,
  })};`
);

fs.writeFileSync(
  'apps/loquitur/src/environments/environment.development.ts',
  `export const environment = ${JSON.stringify({
    production: false,
    ...config,
  })};`
);
