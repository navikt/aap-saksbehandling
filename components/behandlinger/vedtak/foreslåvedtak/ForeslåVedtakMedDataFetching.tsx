import { ForeslåVedtak } from 'components/behandlinger/vedtak/foreslåvedtak/ForeslåVedtak';
import { sjekkTilgang } from 'lib/services/tilgangservice/tilgangsService';
import { Behovstype } from 'lib/utils/form';
import { isSuccess } from 'lib/utils/api';

interface Props {
  behandlingsreferanse: string;
  behandlingVersjon: number;
  readonly: boolean;
}

export const ForeslåVedtakMedDataFetching = async ({ behandlingVersjon, behandlingsreferanse, readonly }: Props) => {
  const brukerHarTilgang = await sjekkTilgang(behandlingsreferanse, Behovstype.FORESLÅ_VEDTAK_KODE);

  return (
    <ForeslåVedtak
      behandlingVersjon={behandlingVersjon}
      readOnly={readonly || (isSuccess(brukerHarTilgang) && !brukerHarTilgang.data.tilgang)}
    />
  );
};
