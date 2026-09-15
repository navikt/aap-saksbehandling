import {
  hentMellomlagring,
  hentUnntakMeldepliktGrunnlag,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';
import { Behovstype } from 'lib/utils/form';
import { MeldepliktPeriodisertFrontend } from 'components/behandlinger/sykdom/meldeplikt/MeldepliktPeriodisertFrontend';
import { skalViseStegForPeriodisertGrunnlag, StegData } from 'lib/utils/steg';

interface Props {
  behandlingsreferanse: string;
  stegData: StegData;
}

export const MeldepliktMedDataFetching = async ({ behandlingsreferanse, stegData }: Props) => {
  const grunnlag = await hentUnntakMeldepliktGrunnlag(behandlingsreferanse);

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  if (!skalViseStegForPeriodisertGrunnlag(stegData.avklaringsbehov, grunnlag.data)) {
    return null;
  }

  const totalReadOnly = stegData.readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle;
  const initialMellomlagretVurdering = await hentMellomlagring(
    behandlingsreferanse,
    Behovstype.FRITAK_MELDEPLIKT_KODE,
    totalReadOnly,
    stegData.erIkkePåVent
  );

  return (
    <MeldepliktPeriodisertFrontend
      grunnlag={grunnlag.data}
      readOnly={totalReadOnly}
      behandlingVersjon={stegData.behandlingVersjon}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  );
};
