import { Oppgave } from 'lib/types/oppgavebehandling';
import { fetchProxy } from 'lib/services/fetchProxy';
import { Oppgavekø } from 'components/oppgavebehandling/oppgavekø/Oppgavekø';
import { mockOppgaver } from 'mocks/mockOppgaver';

const oppgavestyringApiBaseUrl = process.env.OPPGAVESTYRING_API_BASE_URL;
const oppgavestyringApiScope = process.env.OPPGAVESTYRING_API_SCOPE ?? '';

const hentOppgaver = async (): Promise<Oppgave[]> => {
  if (process.env.NEXT_PUBLIC_ENVIRONMENT === 'localhost') {
    return mockOppgaver;
  }
  return await fetchProxy<Oppgave[]>(`${oppgavestyringApiBaseUrl}/oppgaver`, oppgavestyringApiScope, 'GET');
};

export const OppgavekMedDatafetching = async () => {
  const oppgaver = await hentOppgaver();
  console.log('oppgaveresponse: ', JSON.stringify(oppgaver));

  return <Oppgavekø oppgaver={oppgaver} />;
};
