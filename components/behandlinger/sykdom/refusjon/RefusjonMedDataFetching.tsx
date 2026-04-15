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
  const [refusjonGrunnlag, initialMellomlagretVurdering] = await Promise.all([
    hentRefusjonGrunnlag(behandlingsreferanse),
    hentMellomlagring(behandlingsreferanse, Behovstype.REFUSJON_KRAV_KODE),
  ]);

  if (isError(refusjonGrunnlag)) {
    return <ApiException apiResponses={[refusjonGrunnlag]} />;
  }

  if (!skalViseSteg(stegData, refusjonGrunnlag.data.gjeldendeVurderinger != null)) {
    return null;
  }

  return (
    <Refusjon
      grunnlag={refusjonGrunnlag.data}
      readOnly={stegData.readOnly || !refusjonGrunnlag.data.harTilgangTilÅSaksbehandle}
      behandlingVersjon={stegData.behandlingVersjon}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  );
};
