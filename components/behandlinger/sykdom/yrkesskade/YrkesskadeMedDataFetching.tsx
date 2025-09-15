import { Yrkesskade } from 'components/behandlinger/sykdom/yrkesskade/Yrkesskade';
import {
  hentMellomlagring,
  hentYrkesskadeVurderingGrunnlag,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';
import { Behovstype } from 'lib/utils/form';
import { skalViseSteg, StegData } from 'lib/utils/steg';
import { isDev } from 'lib/utils/environment';
import { YrkesskadeMedManuellYrkesskadeDato } from 'components/behandlinger/sykdom/yrkesskade/YrkesskadeMedManuellYrkesskadeDato';

interface Props {
  behandlingsReferanse: string;
  stegData: StegData;
}

export const YrkesskadeMedDataFetching = async ({ behandlingsReferanse, stegData }: Props) => {
  const [yrkesskadeVurderingGrunnlag, initialMellomlagretVurdering] = await Promise.all([
    hentYrkesskadeVurderingGrunnlag(behandlingsReferanse),
    hentMellomlagring(behandlingsReferanse, Behovstype.YRKESSKADE_KODE),
  ]);

  if (isError(yrkesskadeVurderingGrunnlag)) {
    return <ApiException apiResponses={[yrkesskadeVurderingGrunnlag]} />;
  }

  if (!skalViseSteg(stegData, yrkesskadeVurderingGrunnlag.data.yrkesskadeVurdering != null)) {
    return null;
  }

  return isDev() ? (
    // TODO: rydd opp her etter etter prodsetting
    <YrkesskadeMedManuellYrkesskadeDato
      grunnlag={yrkesskadeVurderingGrunnlag.data}
      readOnly={stegData.readOnly || !yrkesskadeVurderingGrunnlag.data.harTilgangTilÅSaksbehandle}
      behandlingVersjon={stegData.behandlingVersjon}
      behandlingsReferanse={behandlingsReferanse}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  ) : (
    <Yrkesskade
      grunnlag={yrkesskadeVurderingGrunnlag.data}
      readOnly={stegData.readOnly || !yrkesskadeVurderingGrunnlag.data.harTilgangTilÅSaksbehandle}
      behandlingVersjon={stegData.behandlingVersjon}
      behandlingsReferanse={behandlingsReferanse}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  );
};
