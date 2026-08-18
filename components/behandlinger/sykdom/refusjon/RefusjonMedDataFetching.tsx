import { hentMellomlagring, hentRefusjonGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { Behovstype } from 'lib/utils/form';
import { StegData, skalViseSteg } from 'lib/utils/steg';

import { Refusjon } from 'components/behandlinger/sykdom/refusjon/Refusjon';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';

interface Props {
  behandlingsreferanse: string;
  stegData: StegData;
}

export const RefusjonMedDataFetching = async ({ behandlingsreferanse, stegData }: Props) => {
  const refusjonGrunnlag = await hentRefusjonGrunnlag(behandlingsreferanse);

  if (isError(refusjonGrunnlag)) {
    return <ApiException apiResponses={[refusjonGrunnlag]} />;
  }

  if (!skalViseSteg(stegData, refusjonGrunnlag.data.gjeldendeVurderinger != null)) {
    return null;
  }

  const totalReadOnly = stegData.readOnly || !refusjonGrunnlag.data.harTilgangTilÅSaksbehandle;
  const initialMellomlagretVurdering = await hentMellomlagring(
    behandlingsreferanse,
    Behovstype.REFUSJON_KRAV_KODE,
    totalReadOnly,
    stegData.visVentekort
  );

  return (
    <Refusjon
      grunnlag={refusjonGrunnlag.data}
      readOnly={totalReadOnly}
      behandlingVersjon={stegData.behandlingVersjon}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  );
};
