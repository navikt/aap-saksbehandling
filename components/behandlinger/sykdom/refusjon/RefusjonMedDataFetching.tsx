import { Refusjon } from 'components/behandlinger/sykdom/refusjon/Refusjon';
import { hentRefusjonGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';
import { isProd } from 'lib/utils/environment';
import { RefusjonUtenFlereNavKontor } from 'components/behandlinger/sykdom/refusjon/RefusjonUtenFlereNavKontor';

interface Props {
  behandlingsReferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
}

export const RefusjonMedDataFetching = async ({ behandlingsReferanse, behandlingVersjon, readOnly }: Props) => {
  const refusjonGrunnlag = await hentRefusjonGrunnlag(behandlingsReferanse);
  if (isError(refusjonGrunnlag)) {
    return <ApiException apiResponses={[refusjonGrunnlag]} />;
  }

  if (isProd()) {
    //TODO: Fjerne denne og bare bruke Refusjon-objektet når vi er i produksjon
    return (
      <RefusjonUtenFlereNavKontor
        grunnlag={refusjonGrunnlag.data}
        readOnly={readOnly || !refusjonGrunnlag.data.harTilgangTilÅSaksbehandle}
        behandlingVersjon={behandlingVersjon}
      />
    );
  } else {
    return (
      <Refusjon
        grunnlag={refusjonGrunnlag.data}
        readOnly={readOnly || !refusjonGrunnlag.data.harTilgangTilÅSaksbehandle}
        behandlingVersjon={behandlingVersjon}
      />
    );
  }
};
