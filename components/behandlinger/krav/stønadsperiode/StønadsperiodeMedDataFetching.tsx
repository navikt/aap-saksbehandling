import {
  hentMellomlagring,
  hentStønadsperiodeGrunnlag,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { Behovstype } from 'lib/utils/form';
import { isError } from 'lib/utils/api';
import { StegData } from 'lib/utils/steg';

import { Stønadsperiode } from 'components/behandlinger/krav/stønadsperiode/Stønadsperiode';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';

interface Props {
  behandlingsreferanse: string;
  stegData: StegData;
}

export const StønadsperiodeMedDataFetching = async ({ behandlingsreferanse, stegData }: Props) => {
  const grunnlag = await hentStønadsperiodeGrunnlag(behandlingsreferanse);

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  const totalReadOnly = stegData.readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle;
  const initialMellomlagretVurdering = await hentMellomlagring(
    behandlingsreferanse,
    Behovstype.AVKLAR_STØNADSPERIODE_KODE,
    totalReadOnly,
    stegData.erIkkePåVent
  );

  return (
    <Stønadsperiode
      grunnlag={grunnlag.data}
      readOnly={totalReadOnly}
      behandlingVersjon={stegData.behandlingVersjon}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  );
};
