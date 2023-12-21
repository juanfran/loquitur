import bbb from 'bigbluebutton-js';
import { getConfig } from '../db';

export async function getApiBB() {
  const config = await getConfig();

  const { bbbUrl, bbbApiKey } = config;

  if (!bbbUrl || !bbbApiKey) {
    return null;
  }

  return bbb.api(bbbUrl, bbbApiKey);
}
