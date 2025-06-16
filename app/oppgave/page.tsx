import { hentEnheter } from 'lib/services/oppgaveservice/oppgaveservice';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { OppgaveListe } from 'components/oppgaveliste/OppgaveListe';
import { InnloggetBrukerContextProvider } from 'context/InnloggetBrukerContext';
import { hentBrukerInformasjon } from 'lib/services/azure/azureUserService';

const Page = async () => {
  const [enheter, brukerInformasjon] = await Promise.all([hentEnheter(), hentBrukerInformasjon()]);

  if (isError(enheter)) {
    return <ApiException apiResponses={[enheter]} />;
  }

  return (
    <InnloggetBrukerContextProvider bruker={brukerInformasjon}>
      <OppgaveListe enheter={enheter.data} />
    </InnloggetBrukerContextProvider>
  );
};

export default Page;
