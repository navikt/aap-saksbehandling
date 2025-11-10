import { apiFetch } from 'lib/services/apiFetch';

const endringsloggBaseUrl = process.env.ENDRINGSLOGG_BASE_URL;
const endringsloggScope = '';

export const hentEndringslogg = async (data: any) => {
  const url = `${endringsloggBaseUrl}/endringslogg`;
  return await apiFetch<void>(url, endringsloggScope, 'POST', data);
};
