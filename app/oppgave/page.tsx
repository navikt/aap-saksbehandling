import { hentEnheter, hentMineOppgaver } from 'lib/services/oppgaveservice/oppgaveservice';
import { OppgaveMeny } from 'components/oppgave/oppgavemeny/OppgaveMeny';

const Page = async () => {
  const enheter = await hentEnheter();
  const mineOppgaver = await hentMineOppgaver();
  return <OppgaveMeny enheter={enheter} mineOppgaver={mineOppgaver.oppgaver || []} />;
};

export default Page;
