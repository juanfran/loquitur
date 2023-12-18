import type { Config } from '@loquitur/commons';
import { readFileSync, writeFileSync, existsSync } from 'fs';

interface Db {
  config: Config;
}

const initialDb: Db = {
  config: {},
};

function initDb() {
  if (!existsSync('db.json')) {
    writeFileSync('db.json', JSON.stringify(initialDb));
  }
}

function getDb() {
  const data = JSON.parse(readFileSync('db.json', 'utf8')) as Db;

  return {
    data,
    write: () => {
      writeFileSync('db.json', JSON.stringify(data));
    },
  };
}

export async function setConfig(config: Config) {
  const db = await getDb();

  const newConfig = {
    ...db.data.config,
    ...config,
  };

  db.data.config = newConfig;

  await db.write();
}

export async function getConfig() {
  const db = await getDb();

  return db.data.config;
}

initDb();
