import { Yrkesskade } from 'components/behandlinger/sykdom/yrkesskade/Yrkesskade';
import { hentYrkesskadeVurderingGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';

interface Props {
  behandlingsReferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
}

export const YrkesskadeMedDataFetching = async ({ behandlingsReferanse, behandlingVersjon, readOnly }: Props) => {
  const yrkesskadeVurderingGrunnlag = await hentYrkesskadeVurderingGrunnlag(behandlingsReferanse);
  if (yrkesskadeVurderingGrunnlag.type === 'ERROR') {
    return <ApiException apiResponses={[yrkesskadeVurderingGrunnlag]} />;
  }
  return (
    <Yrkesskade
      grunnlag={yrkesskadeVurderingGrunnlag.data}
      readOnly={readOnly || !yrkesskadeVurderingGrunnlag.data.harTilgangTilÅSaksbehandle}
      behandlingVersjon={behandlingVersjon}
      behandlingsReferanse={behandlingsReferanse}
    />
  );
};
