import { AvklaroppfolgingVurdering } from './AvklarOppfolgingVurdering';
import { hentOppfølgingsoppgaveGrunnlag } from '../../../lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { ApiException } from '../../saksbehandling/apiexception/ApiException';

interface Props {
  behandlingsReferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
}

export const AvklarOppfolgingVurderingMedDataFetching = async ({
  behandlingsReferanse,
  behandlingVersjon,
  readOnly,
}: Props) => {
  const grunnlag = await hentOppfølgingsoppgaveGrunnlag(behandlingsReferanse);
  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  return (
    <AvklaroppfolgingVurdering readOnly={readOnly} behandlingVersjon={behandlingVersjon} grunnlag={grunnlag.data} />
  );
};
