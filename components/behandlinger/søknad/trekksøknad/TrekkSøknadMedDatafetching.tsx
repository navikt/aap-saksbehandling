import { hentMellomlagring, hentTrukketSøknad } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { Behovstype } from 'lib/utils/form';

import { TrekkSøknad } from 'components/behandlinger/søknad/trekksøknad/TrekkSøknad';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';

interface Props {
  behandlingsreferanse: string;
  readOnly: boolean;
  visVentekort: boolean;
  behandlingVersjon: number;
}

export const TrekkSøknadMedDatafetching = async ({
  behandlingsreferanse,
  readOnly,
  visVentekort,
  behandlingVersjon,
}: Props) => {
  const [trukketSøknadGrunnlag] = await Promise.all([hentTrukketSøknad(behandlingsreferanse)]);

  if (isError(trukketSøknadGrunnlag)) {
    return <ApiException apiResponses={[trukketSøknadGrunnlag]} />;
  }

  const initialMellomlagretVurdering = await hentMellomlagring(
    behandlingsreferanse,
    Behovstype.VURDER_TREKK_AV_SØKNAD_KODE,
    readOnly,
    visVentekort
  );

  return (
    <TrekkSøknad
      grunnlag={trukketSøknadGrunnlag.data}
      readOnly={readOnly}
      behandlingVersjon={behandlingVersjon}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  );
};
