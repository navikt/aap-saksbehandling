import { Oppgaver } from 'lib/types/oppgavebehandling';
import { fetchProxy } from 'lib/services/fetchProxy';
import { Oppgavekø } from 'components/oppgavebehandling/oppgavekø/Oppgavekø';
import { mockOppgaver } from 'mocks/mockOppgaver';

const oppgavestyringApiBaseUrl = process.env.OPPGAVESTYRING_API_BASE_URL;
const oppgavestyringApiScope = process.env.OPPGAVESTYRING_API_SCOPE ?? '';

const hentOppgaver = async (): Promise<Oppgaver> => {
  if (process.env.NEXT_PUBLIC_ENVIRONMENT === 'localhost') {
    return mockOppgaver;
  }
  return await fetchProxy<Oppgaver>(`${oppgavestyringApiBaseUrl}/oppgaver`, oppgavestyringApiScope, 'GET');
};

export const OppgavekMedDatafetching = async () => {
  const oppgaver = await hentOppgaver();

  return <Oppgavekø oppgaver={oppgaver.oppgaver} />;
};
