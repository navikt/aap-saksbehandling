import { TrekkSøknad } from 'components/behandlinger/søknad/trekksøknad/TrekkSøknad';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { hentMellomlagring, hentTrukketSøknad } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { Behovstype } from 'lib/utils/form';

interface Props {
  behandlingsreferanse: string;
  readOnly: boolean;
  behandlingVersjon: number;
}

export const TrekkSøknadMedDatafetching = async ({ behandlingsreferanse, readOnly, behandlingVersjon }: Props) => {
  const [trukketSøknadGrunnlag, initialMellomlagretVurdering] = await Promise.all([
    hentTrukketSøknad(behandlingsreferanse),
    hentMellomlagring(behandlingsreferanse, Behovstype.VURDER_TREKK_AV_SØKNAD_KODE),
  ]);

  if (isError(trukketSøknadGrunnlag)) {
    return <ApiException apiResponses={[trukketSøknadGrunnlag]} />;
  }

  return (
    <TrekkSøknad
      grunnlag={trukketSøknadGrunnlag.data}
      readOnly={readOnly}
      behandlingVersjon={behandlingVersjon}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  );
};
