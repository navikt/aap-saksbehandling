import {
  hentMellomlagring,
  hentUnntakMeldepliktGrunnlag,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { Behovstype } from 'lib/utils/form';
import { StegData } from 'lib/utils/steg';

import { MeldepliktPeriodisertFrontend } from 'components/behandlinger/sykdom/meldeplikt/MeldepliktPeriodisertFrontend';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';

interface Props {
  behandlingsreferanse: string;
  stegData: StegData;
}

export const MeldepliktMedDataFetching = async ({ behandlingsreferanse, stegData }: Props) => {
  const grunnlag = await hentUnntakMeldepliktGrunnlag(behandlingsreferanse);

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  const totalReadOnly = stegData.readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle;
  const initialMellomlagretVurdering = await hentMellomlagring(
    behandlingsreferanse,
    Behovstype.FRITAK_MELDEPLIKT_KODE,
    totalReadOnly,
    stegData.visVentekort
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
