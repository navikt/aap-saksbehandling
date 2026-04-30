import { ForeslåVedtakVedtakslengde } from 'components/behandlinger/vedtakslengde/foreslåvedtakvedtakslengde/ForeslåVedtakVedtakslengde';
import { sjekkTilgang } from 'lib/services/tilgangservice/tilgangsService';
import { Behovstype } from 'lib/utils/form';
import { isError, isSuccess } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { hentForeslåVedtakVedtakslengdeGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { unleashService } from 'lib/services/unleash/unleashService';

interface Props {
  behandlingsreferanse: string;
  behandlingVersjon: number;
  readonly: boolean;
}

export const ForeslåVedtakVedtakslengdeMedDataFetching = async ({
  behandlingVersjon,
  behandlingsreferanse,
  readonly,
}: Props) => {
  if (!unleashService.isEnabled('ForeslaaVedtakVedtakslengde')) {
    return null;
  }

  const brukerHarTilgang = await sjekkTilgang(behandlingsreferanse, Behovstype.FORESLÅ_VEDTAK_VEDTAKSLENGDE);
  const grunnlag = await hentForeslåVedtakVedtakslengdeGrunnlag(behandlingsreferanse);

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  if (grunnlag.data.perioder == null) {
    return null;
  }

  return (
    <ForeslåVedtakVedtakslengde
      behandlingVersjon={behandlingVersjon}
      readOnly={readonly || (isSuccess(brukerHarTilgang) && !brukerHarTilgang.data.tilgang)}
      grunnlag={grunnlag.data}
    />
  );
};
