'use server';

const endringsloggBaseUrl = process.env.ENDRINGSLOGG_BASE_URL ?? '';

export const hentEndringslogg = async (data: any, path: string) => {
  return fetch(`${endringsloggBaseUrl}${path}`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
};
