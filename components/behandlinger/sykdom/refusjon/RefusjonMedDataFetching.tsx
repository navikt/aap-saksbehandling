import { hentMellomlagring, hentRefusjonGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';
import { Behovstype } from 'lib/utils/form';
import { skalViseSteg, StegData } from 'lib/utils/steg';
import { Refusjon } from 'components/behandlinger/sykdom/refusjon/Refusjon';
import { GammelRefusjon } from 'components/behandlinger/sykdom/refusjon/GammelRefusjon';
import { unleashService } from 'lib/services/unleash/unleashService';

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

  if (!skalViseSteg(stegData, refusjonGrunnlag.data.gjeldendeVurderinger != null)) {
    return null;
  }

  if (!unleashService.isEnabled('SosialRefusjon')) {
    return (
      <GammelRefusjon
        grunnlag={refusjonGrunnlag.data}
        readOnly={stegData.readOnly || !refusjonGrunnlag.data.harTilgangTilÅSaksbehandle}
        behandlingVersjon={stegData.behandlingVersjon}
        initialMellomlagretVurdering={initialMellomlagretVurdering}
      />
    );
  } else {
    return (
      <Refusjon
        grunnlag={refusjonGrunnlag.data}
        readOnly={stegData.readOnly || !refusjonGrunnlag.data.harTilgangTilÅSaksbehandle}
        behandlingVersjon={stegData.behandlingVersjon}
        initialMellomlagretVurdering={initialMellomlagretVurdering}
      />
    );
  }
};
