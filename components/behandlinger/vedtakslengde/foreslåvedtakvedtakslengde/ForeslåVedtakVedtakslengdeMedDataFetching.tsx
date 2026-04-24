import { ForeslåVedtakVedtakslengde } from 'components/behandlinger/vedtakslengde/foreslåvedtakvedtakslengde/ForeslåVedtakVedtakslengde';
import { sjekkTilgang } from 'lib/services/tilgangservice/tilgangsService';
import { Behovstype } from 'lib/utils/form';
import { isError, isSuccess } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { hentForeslåVedtakVedtakslengdeGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';

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
  const brukerHarTilgang = await sjekkTilgang(behandlingsreferanse, Behovstype.FORESLÅ_VEDTAK_VEDTAKSLENGDE);
  const grunnlag = await hentForeslåVedtakVedtakslengdeGrunnlag(behandlingsreferanse);
  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  return (
    <ForeslåVedtakVedtakslengde
      behandlingVersjon={behandlingVersjon}
      readOnly={readonly || (isSuccess(brukerHarTilgang) && !brukerHarTilgang.data.tilgang)}
      grunnlag={grunnlag.data}
    />
  );
};
