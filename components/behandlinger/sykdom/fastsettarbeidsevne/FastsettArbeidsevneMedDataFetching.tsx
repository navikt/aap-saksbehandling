import { FastsettArbeidsevne } from 'components/behandlinger/sykdom/fastsettarbeidsevne/FastsettArbeidsevne';
import {
  hentFastsettArbeidsevneGrunnlag,
  hentMellomlagring,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';
import { Behovstype } from 'lib/utils/form';
import { StegData } from 'lib/utils/steg';

interface Props {
  behandlingsReferanse: string;
  stegData: StegData;
}

export const FastsettArbeidsevneMedDataFetching = async ({ behandlingsReferanse, stegData }: Props) => {
  const [grunnlag, initialMellomlagretVurdering] = await Promise.all([
    hentFastsettArbeidsevneGrunnlag(behandlingsReferanse),
    hentMellomlagring(behandlingsReferanse, Behovstype.FASTSETT_ARBEIDSEVNE_KODE),
  ]);

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  return (
    <FastsettArbeidsevne
      grunnlag={grunnlag.data}
      readOnly={stegData.readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle}
      behandlingVersjon={stegData.behandlingVersjon}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  );
};
