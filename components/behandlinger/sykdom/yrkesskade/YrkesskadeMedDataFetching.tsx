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
  const yrkesskadeVurderingGrunnlag = await hentYrkesskadeVurderingGrunnlag(behandlingsreferanse);

  if (isError(yrkesskadeVurderingGrunnlag)) {
    return <ApiException apiResponses={[yrkesskadeVurderingGrunnlag]} />;
  }

  const grunnlag = yrkesskadeVurderingGrunnlag.data;
  const harTidligereVurdering = grunnlag.yrkesskadeVurdering != null;
  const harInnhentedeYrkesskader = (grunnlag.opplysninger?.innhentedeYrkesskader?.length ?? 0) > 0;

  if (!skalViseSteg(stegData, harTidligereVurdering) && !harInnhentedeYrkesskader) {
    return null;
  }

  const totalReadOnly = stegData.readOnly || !yrkesskadeVurderingGrunnlag.data.harTilgangTilÅSaksbehandle;
  const initialMellomlagretVurdering = await hentMellomlagring(
    behandlingsreferanse,
    Behovstype.YRKESSKADE_KODE,
    totalReadOnly
  );

  return (
    <Yrkesskade
      grunnlag={yrkesskadeVurderingGrunnlag.data}
      readOnly={totalReadOnly}
      behandlingVersjon={stegData.behandlingVersjon}
      behandlingsreferanse={behandlingsreferanse}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  );
};
