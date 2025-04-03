import { hentEnheter } from 'lib/services/oppgaveservice/oppgaveservice';
import { OppgaveMeny } from 'components/oppgave/oppgavemeny/OppgaveMeny';

const Page = async () => {
  const enheter = await hentEnheter();
  return <OppgaveMeny enheter={enheter} />;
};

export default Page;
