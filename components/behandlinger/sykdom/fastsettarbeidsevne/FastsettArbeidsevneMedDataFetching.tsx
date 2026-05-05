import {
  hentFastsettArbeidsevneGrunnlag,
  hentMellomlagring,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';
import { Behovstype } from 'lib/utils/form';
import { StegData } from 'lib/utils/steg';
import { FastsettArbeidsevnePeriodisertFrontend } from 'components/behandlinger/sykdom/fastsettarbeidsevne/FastsettArbeidsevnePeriodisertFrontend';

interface Props {
  behandlingsreferanse: string;
  stegData: StegData;
}

export const FastsettArbeidsevneMedDataFetching = async ({ behandlingsreferanse, stegData }: Props) => {
  const grunnlag = await hentFastsettArbeidsevneGrunnlag(behandlingsreferanse);

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  const totalReadOnly = stegData.readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle;
  const initialMellomlagretVurdering = await hentMellomlagring(
    behandlingsreferanse,
    Behovstype.FASTSETT_ARBEIDSEVNE_KODE,
    totalReadOnly
  );

  return (
    <FastsettArbeidsevnePeriodisertFrontend
      grunnlag={grunnlag.data}
      readOnly={totalReadOnly}
      behandlingVersjon={stegData.behandlingVersjon}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  );
};
