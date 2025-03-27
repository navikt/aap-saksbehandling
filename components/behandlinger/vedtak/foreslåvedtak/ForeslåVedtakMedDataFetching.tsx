import { ForeslåVedtak } from 'components/behandlinger/vedtak/foreslåvedtak/ForeslåVedtak';
import { sjekkTilgang } from 'lib/services/tilgangservice/tilgangsService';
import { Behovstype } from 'lib/utils/form';

interface Props {
  behandlingsreferanse: string;
  behandlingVersjon: number;
}

export const ForeslåVedtakMedDataFetching = async ({ behandlingVersjon, behandlingsreferanse }: Props) => {
  const brukerHarTilgang = await sjekkTilgang(behandlingsreferanse, Behovstype.FORESLÅ_VEDTAK_KODE);
  return <ForeslåVedtak behandlingVersjon={behandlingVersjon} readOnly={!brukerHarTilgang.tilgang} />;
};
