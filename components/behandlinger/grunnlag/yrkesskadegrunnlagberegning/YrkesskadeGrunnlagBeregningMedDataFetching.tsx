import { YrkesskadeGrunnlagBeregning } from 'components/behandlinger/grunnlag/yrkesskadegrunnlagberegning/YrkesskadeGrunnlagBeregning';
import { hentBeregningYrkesskadeVurdering } from 'lib/services/saksbehandlingservice/saksbehandlingService';

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
  return (
    <YrkesskadeGrunnlagBeregning
      yrkeskadeBeregningGrunnlag={yrkesskadeVurderingGrunnlag}
      behandlingVersjon={behandlingVersjon}
      readOnly={readOnly && !yrkesskadeVurderingGrunnlag.harTilgangTilÅSaksbehandle}
    />
  );
};
