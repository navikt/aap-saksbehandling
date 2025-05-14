import { SamordningTjenestePensjon } from 'components/behandlinger/samordning/samordningtjenestepensjon/SamordningTjenestePensjon';
import { hentSamordningTjenestePensjonGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { SamordningTjenestePensjonGrunnlag } from 'lib/types/types';

interface Props {
  behandlingVersjon: number;
  behandlingreferanse: string;
  readOnly: boolean;
}
export const SamordningTjenestePensjonMedDataFetching = async ({
  behandlingVersjon,
  readOnly,
  behandlingreferanse,
}: Props) => {
  // const grunnlag = await hentSamordningTjenestePensjonGrunnlag(behandlingreferanse);
  // if (isError(grunnlag)) {
  //   return <ApiException apiResponses={[grunnlag]} />;
  // }

  const grunnlag: SamordningTjenestePensjonGrunnlag = {
    harTilgangTilÅSaksbehandle: false,
    tjenestepensjonYtelser: [
      {
        ytelse: 'ALDER',
        ordning: { navn: 'Thomas', tpNr: '1234', orgNr: '1235' },
        ytelseIverksattFom: '2020-01-01',
        ytelseIverksattTom: '2020-02-02',
      },
    ],
  };

  return (
    <SamordningTjenestePensjon
      grunnlag={grunnlag}
      behandlingVersjon={behandlingVersjon}
      readOnly={readOnly}
      // readOnly={readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle}
    />
  );
};
