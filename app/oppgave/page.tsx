import { hentEnheter } from 'lib/services/oppgaveservice/oppgaveservice';
import { OppgaveMeny } from 'components/oppgave/oppgavemeny/OppgaveMeny';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';

const Page = async () => {
  const enheter = await hentEnheter();
  if (isError(enheter)) {
    return <ApiException apiResponses={[enheter]} />;
  }
  return <OppgaveMeny enheter={enheter.data} />;
};

export default Page;
