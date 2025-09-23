import { Refusjon } from 'components/behandlinger/sykdom/refusjon/Refusjon';
import { hentMellomlagring, hentRefusjonGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';
import { Behovstype } from 'lib/utils/form';
import { isDev } from 'lib/utils/environment';
import { RefusjonNyVising } from 'components/behandlinger/sykdom/refusjon/RefusjonNyVisning';
import { skalViseSteg, StegData } from 'lib/utils/steg';

interface Props {
  behandlingsReferanse: string;
  stegData: StegData;
}

export const RefusjonMedDataFetching = async ({ behandlingsReferanse, stegData }: Props) => {
  const [refusjonGrunnlag, initialMellomlagretVurdering] = await Promise.all([
    hentRefusjonGrunnlag(behandlingsReferanse),
    hentMellomlagring(behandlingsReferanse, Behovstype.REFUSJON_KRAV_KODE),
  ]);

  if (isError(refusjonGrunnlag)) {
    return <ApiException apiResponses={[refusjonGrunnlag]} />;
  }
  
  if (!skalViseSteg(stegData, refusjonGrunnlag.data.gjeldendeVurdering != null)) {
    return null;
  }

  return isDev() ? (
    <RefusjonNyVising
      grunnlag={refusjonGrunnlag.data}
      readOnly={readOnly || !refusjonGrunnlag.data.harTilgangTilÅSaksbehandle}
      behandlingVersjon={behandlingVersjon}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  ) : (
    <Refusjon
      grunnlag={refusjonGrunnlag.data}
      readOnly={stegData.readOnly || !refusjonGrunnlag.data.harTilgangTilÅSaksbehandle}
      behandlingVersjon={stegData.behandlingVersjon}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  );
};
