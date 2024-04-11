import fs from 'fs/promises';
import { Rolle } from 'app/api/rolle/route';

export const hentRolle = async () => await lesCache();

export const endreRolle = async (rolle: Rolle) => await lagreCache(rolle);

const lesCache = async () => {
  let rolleCache;
  try {
    rolleCache = await fs.readFile('.roller.cache', 'utf8');
  } catch (err: any) {
    if (err.code === 'ENOENT') await fs.writeFile('.roller.cache', '');
  }
  return rolleCache;
};

const lagreCache = async (data: Rolle) => {
  await fs.writeFile('.roller.cache', data);
  return true;
};
