import { Yrkesskade } from 'components/behandlinger/sykdom/yrkesskade/Yrkesskade';
import { hentYrkesskadeVurderingGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';

interface Props {
  behandlingsReferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
}

export const YrkesskadeMedDataFetching = async ({ behandlingsReferanse, behandlingVersjon, readOnly }: Props) => {
  const yrkesskadeVurderingGrunnlag = await hentYrkesskadeVurderingGrunnlag(behandlingsReferanse);
  return (
    <Yrkesskade
      grunnlag={yrkesskadeVurderingGrunnlag}
      readOnly={readOnly}
      behandlingVersjon={behandlingVersjon}
      behandlingsReferanse={behandlingsReferanse}
    />
  );
};
