import { Underveisgrunnlag } from 'components/behandlinger/underveis/underveisgrunnlag/Underveisgrunnlag';
import { hentUnderveisGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';

interface Props {
  behandlingsreferanse: string;
}

export const UnderveisgrunnlagMedDataFetching = async ({ behandlingsreferanse }: Props) => {
  const grunnlag = await hentUnderveisGrunnlag(behandlingsreferanse);
  if (grunnlag.type === 'ERROR') {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  return <Underveisgrunnlag grunnlag={grunnlag.data} />;
};
