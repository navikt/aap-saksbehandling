import { hentEnheter } from 'lib/services/oppgaveservice/oppgaveservice';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { OppgaveListe } from 'components/oppgaveliste/OppgaveListe';

const Page = async () => {
  const enheter = await hentEnheter();
  if (isError(enheter)) {
    return <ApiException apiResponses={[enheter]} />;
  }
  return <OppgaveListe enheter={enheter.data} />;
};

export default Page;
