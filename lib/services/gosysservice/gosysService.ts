import { apiFetch } from 'lib/services/apiFetch';
import { FinnGosysOppgaverQueryParams, FinnGosysOppgaverResponse } from 'lib/types/gosysTypes';
import { gosysOppgaverQueryParams } from 'lib/utils/request';
import { isLocal } from 'lib/utils/environment';
import { FetchResponse } from 'lib/utils/api';

const gosysApiBaseUrl = process.env.GOSYS_API_BASE_URL;
const gosysApiScope = process.env.GOSYS_API_SCOPE ?? '';

export const hentOppgaver = async (query: FinnGosysOppgaverQueryParams) => {
  if (isLocal()) {
    const finnGosysOppgaverResponse: FinnGosysOppgaverResponse = {
      oppgaver: [
        {
          id: 0,
          tildeltEnhetsnr: '1234',
          tema: 'AAP',
          oppgavetype: 'Kelvin',
          versjon: 0,
          prioritet: 'KRITISK',
          status: 'AAPNET',
          aktivDato: '2026-01-01',
          tilordnetRessurs: 'Kjell T. Ringen',
          beskrivelse:
            'Dette er første linje i beskrivelsen.\nDette er andre linje i beskrivelsen.\nDette er tredje linje i beskrivelsen.\nDette er fjerde linje, slik at teksten overstiger fire linjer.',
          fristFerdigstillelse: '2026-05-05',
          opprettetTidspunkt: '2026-01-01',
        },
      ],
      antallTreffTotalt: 0,
    };

    const response: FetchResponse<FinnGosysOppgaverResponse> = {
      status: 200,
      type: 'SUCCESS',
      data: finnGosysOppgaverResponse,
    };

    return response;
  }

  const queryString = gosysOppgaverQueryParams(query);
  const url = `${gosysApiBaseUrl}/api/v1/oppgaver${queryString ? `?${queryString}` : ''}`;
  return await apiFetch<FinnGosysOppgaverResponse>(url, gosysApiScope, 'GET');
};
