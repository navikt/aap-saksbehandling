import { hentMellomlagring, hentRefusjonGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';
import { Behovstype } from 'lib/utils/form';
import { skalViseSteg, StegData } from 'lib/utils/steg';
import { Refusjon } from 'components/behandlinger/sykdom/refusjon/Refusjon';

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
    totalReadOnly
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
