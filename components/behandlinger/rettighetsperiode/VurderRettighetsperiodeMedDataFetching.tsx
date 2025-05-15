import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { VurderRettighetsperiode } from './VurderRettighetsperiode';
import { hentRettighetsperiodeGrunnlag } from '../../../lib/services/saksbehandlingservice/saksbehandlingService';

interface Props {
  behandlingsreferanse: string;
  readOnly: boolean;
  behandlingVersjon: number;
}

export const VurderRettighetsperiodeMedDataFetching = async ({
  readOnly,
  behandlingVersjon,
  behandlingsreferanse,
}: Props) => {
  const rettighetsperiodeGrunnlag = await hentRettighetsperiodeGrunnlag(behandlingsreferanse);
  if (isError(rettighetsperiodeGrunnlag)) {
    return <ApiException apiResponses={[rettighetsperiodeGrunnlag]} />;
  }

  return (
    <VurderRettighetsperiode
      grunnlag={rettighetsperiodeGrunnlag.data}
      readOnly={readOnly || !rettighetsperiodeGrunnlag.data.harTilgangTilÅSaksbehandle}
      behandlingVersjon={behandlingVersjon}
    />
  );
};
