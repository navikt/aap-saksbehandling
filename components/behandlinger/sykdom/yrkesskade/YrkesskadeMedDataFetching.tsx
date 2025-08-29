import { Yrkesskade } from 'components/behandlinger/sykdom/yrkesskade/Yrkesskade';
import {
  hentMellomlagring,
  hentYrkesskadeVurderingGrunnlag,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';
import { Behovstype } from 'lib/utils/form';

interface Props {
  behandlingsReferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
}

export const YrkesskadeMedDataFetching = async ({ behandlingsReferanse, behandlingVersjon, readOnly }: Props) => {
  const [yrkesskadeVurderingGrunnlag, initialMellomlagretVurdering] = await Promise.all([
    hentYrkesskadeVurderingGrunnlag(behandlingsReferanse),
    hentMellomlagring(behandlingsReferanse, Behovstype.YRKESSKADE_KODE),
  ]);

  if (isError(yrkesskadeVurderingGrunnlag)) {
    return <ApiException apiResponses={[yrkesskadeVurderingGrunnlag]} />;
  }

  return (
    <Yrkesskade
      grunnlag={yrkesskadeVurderingGrunnlag.data}
      readOnly={readOnly || !yrkesskadeVurderingGrunnlag.data.harTilgangTilÅSaksbehandle}
      behandlingVersjon={behandlingVersjon}
      behandlingsReferanse={behandlingsReferanse}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  );
};
