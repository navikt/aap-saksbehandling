import { YrkesskadeGrunnlagBeregning } from 'components/behandlinger/grunnlag/yrkesskadegrunnlagberegning/YrkesskadeGrunnlagBeregning';
import { hentBeregningYrkesskadeVurdering } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';

interface Props {
  readOnly: boolean;
  behandlingVersjon: number;
  behandlingsreferanse: string;
}

export const YrkesskadeGrunnlagBeregningMedDataFetching = async ({
  behandlingVersjon,
  readOnly,
  behandlingsreferanse,
}: Props) => {
  const yrkesskadeVurderingGrunnlag = await hentBeregningYrkesskadeVurdering(behandlingsreferanse);
  if (yrkesskadeVurderingGrunnlag.type === 'ERROR') {
    return <ApiException apiResponses={[yrkesskadeVurderingGrunnlag]} />;
  }
  return (
    <YrkesskadeGrunnlagBeregning
      yrkeskadeBeregningGrunnlag={yrkesskadeVurderingGrunnlag.data}
      behandlingVersjon={behandlingVersjon}
      readOnly={readOnly || !yrkesskadeVurderingGrunnlag.data.harTilgangTilÅSaksbehandle}
    />
  );
};
