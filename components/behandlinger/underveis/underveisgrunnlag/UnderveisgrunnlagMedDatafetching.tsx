import { Underveisgrunnlag } from 'components/behandlinger/underveis/underveisgrunnlag/Underveisgrunnlag';
import { hentUnderveisGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';

interface Props {
  behandlingsreferanse: string;
  readOnly: boolean;
  behandlingVersjon: number;
}

export const UnderveisgrunnlagMedDataFetching = async ({
  behandlingsreferanse,
  readOnly,
  behandlingVersjon,
}: Props) => {
  const grunnlag = await hentUnderveisGrunnlag(behandlingsreferanse);
  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  return <Underveisgrunnlag readOnly={readOnly} behandlingVersjon={behandlingVersjon} grunnlag={grunnlag.data} />;
};
