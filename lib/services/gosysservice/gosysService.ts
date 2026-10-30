import { apiFetch } from 'lib/services/apiFetch';
import { FinnGosysOppgaverQueryParams, FinnGosysOppgaverResponse } from 'lib/types/gosysTypes';
import { gosysOppgaverQueryParams } from 'lib/utils/request';

const gosysApiBaseUrl = process.env.GOSYS_API_BASE_URL;
const gosysApiScope = process.env.GOSYS_API_SCOPE ?? '';

export const hentOppgaver = async (query: FinnGosysOppgaverQueryParams) => {
  const queryString = gosysOppgaverQueryParams(query);
  const url = `${gosysApiBaseUrl}/api/v1/oppgaver${queryString ? `?${queryString}` : ''}`;
  return await apiFetch<FinnGosysOppgaverResponse>(url, gosysApiScope, 'GET');
};
