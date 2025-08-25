import { ForeslåVedtak } from 'components/behandlinger/vedtak/foreslåvedtak/ForeslåVedtak';
import { sjekkTilgang } from 'lib/services/tilgangservice/tilgangsService';
import { Behovstype } from 'lib/utils/form';
import { isError, isSuccess } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { hentForeslåVedtakGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';

interface Props {
  behandlingsreferanse: string;
  behandlingVersjon: number;
  readonly: boolean;
}

export const ForeslåVedtakMedDataFetching = async ({ behandlingVersjon, behandlingsreferanse, readonly }: Props) => {
  const brukerHarTilgang = await sjekkTilgang(behandlingsreferanse, Behovstype.FORESLÅ_VEDTAK_KODE);
  const grunnlag = await hentForeslåVedtakGrunnlag(behandlingsreferanse);
  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  return (
    <ForeslåVedtak
      behandlingVersjon={behandlingVersjon}
      readOnly={readonly || (isSuccess(brukerHarTilgang) && !brukerHarTilgang.data.tilgang)}
      grunnlag={grunnlag.data}
    />
  );
};
