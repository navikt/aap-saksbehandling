import { BodyShort, VStack } from '@navikt/ds-react';
import { hentPersonIdent } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { hentBrukerInformasjon } from 'lib/services/azure/azureUserService';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';

const Page = async (props: { params: Promise<{ identifikator: string }> }) => {
  const params = await props.params;
  const [hentIdent, _] = await Promise.all([hentPersonIdent(params.identifikator), hentBrukerInformasjon()]);
  if (isError(hentIdent)) {
    return <ApiException apiResponses={[hentIdent]} />;
  }

  return (
    <VStack>
      <BodyShort>{params.identifikator}</BodyShort>
      <BodyShort>IDENT: {hentIdent.data.ident}</BodyShort>
    </VStack>
  );
};
export default Page;
