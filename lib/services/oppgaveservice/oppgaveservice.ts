import { fetchProxy } from 'lib/services/fetchProxy';
import { isLocal } from 'lib/utils/environment';
import { Oppgave } from 'lib/types/types';

const oppgaveApiBaseUrl = process.env.OPPGAVE_API_BASE_URL;
const oppgaveApiScope = process.env.OPPGAVE_API_SCOPE ?? '';

export async function oppgaveTekstSøk(søketekst: string) {
  if (isLocal()) {
    return [
      {
        reservertAv: 'DF39ZH',
        avklaringsbehovKode: '9003',
        behandlingOpprettet: '2025-01-06T12:36:44.716229',
        behandlingRef: 'dc0f6317-c27b-49a7-ae95-fdd05ce34fa6',
        behandlingstype: 'FØRSTEGANGSBEHANDLING',
        id: 0,
        journalpostId: 123,
        status: 'OPPRETTET',
        versjon: 0,
      },
      {
        avklaringsbehovKode: '5001',
        behandlingOpprettet: '2025-01-06T12:36:44.716229',
        behandlingRef: '34fdsff-5717-4562-b3fc-2c963f66afa6',
        behandlingstype: 'FØRSTEGANGSBEHANDLING',
        id: 1,
        journalpostId: 234,
        status: 'OPPRETTET',
        versjon: 0,
      },
    ];
  }
  const url = `${oppgaveApiBaseUrl}/sok`;
  return await fetchProxy<Array<Oppgave>>(url, oppgaveApiScope, 'POST', { søketekst });
}
