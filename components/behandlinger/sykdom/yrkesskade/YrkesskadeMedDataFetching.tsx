import {
  hentMellomlagring,
  hentYrkesskadeVurderingGrunnlag,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';
import { Behovstype } from 'lib/utils/form';
import { skalViseSteg, StegData } from 'lib/utils/steg';
import { Yrkesskade } from 'components/behandlinger/sykdom/yrkesskade/Yrkesskade';

interface Props {
  behandlingsreferanse: string;
  stegData: StegData;
}

export const YrkesskadeMedDataFetching = async ({ behandlingsreferanse, stegData }: Props) => {
  const [yrkesskadeVurderingGrunnlag, initialMellomlagretVurdering] = await Promise.all([
    hentYrkesskadeVurderingGrunnlag(behandlingsreferanse),
    hentMellomlagring(behandlingsreferanse, Behovstype.YRKESSKADE_KODE),
  ]);

  if (isError(yrkesskadeVurderingGrunnlag)) {
    return <ApiException apiResponses={[yrkesskadeVurderingGrunnlag]} />;
  }

  if (!skalViseSteg(stegData, yrkesskadeVurderingGrunnlag.data.yrkesskadeVurdering != null)) {
    return null;
  }

  return (
    <Yrkesskade
      grunnlag={yrkesskadeVurderingGrunnlag.data}
      readOnly={stegData.readOnly || !yrkesskadeVurderingGrunnlag.data.harTilgangTilÅSaksbehandle}
      behandlingVersjon={stegData.behandlingVersjon}
      behandlingsreferanse={behandlingsreferanse}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  );
};
