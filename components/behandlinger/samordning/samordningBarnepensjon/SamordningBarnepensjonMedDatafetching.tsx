import { SamordningBarnepensjon } from 'components/behandlinger/samordning/samordningBarnepensjon/SamordningBarnepensjon';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { hentAlderGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';

interface Props {
  behandlingsreferanse: string;
}

export const SamordningBarnepensjonMedDatafetching = async ({ behandlingsreferanse }: Props) => {
  const aldersGrunnlag = await hentAlderGrunnlag(behandlingsreferanse);

  if (isError(aldersGrunnlag)) {
    return <ApiException apiResponses={[aldersGrunnlag]} />;
  }

  const fødselsdato = aldersGrunnlag.data.fødselsdato;

  if (!fødselsdato) return null;

  return <SamordningBarnepensjon fødselsdato={fødselsdato} />;
};
