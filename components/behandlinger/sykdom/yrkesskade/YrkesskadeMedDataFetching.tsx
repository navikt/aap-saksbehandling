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

  const grunnlag = yrkesskadeVurderingGrunnlag.data;
  const harTidligereVurdering = grunnlag.yrkesskadeVurdering != null;
  const harInnhentedeYrkesskader = (grunnlag.opplysninger?.innhentedeYrkesskader?.length ?? 0) > 0;

  if (!skalViseSteg(stegData, harTidligereVurdering) && !harInnhentedeYrkesskader) {
    return null;
  }

  return (
    <Yrkesskade
      grunnlag={grunnlag}
      readOnly={stegData.readOnly || !grunnlag.harTilgangTilÅSaksbehandle}
      behandlingVersjon={stegData.behandlingVersjon}
      behandlingsreferanse={behandlingsreferanse}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  );
};