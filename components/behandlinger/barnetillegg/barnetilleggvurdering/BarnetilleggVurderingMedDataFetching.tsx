import { BarnetilleggVurdering } from 'components/behandlinger/barnetillegg/barnetilleggvurdering/BarnetilleggVurdering';
import { hentBarnetilleggGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';

type Props = {
  behandlingsreferanse: string;
  behandlingsversjon: number;
};

export const BarnetilleggVurderingMedDataFetching = async ({ behandlingsreferanse, behandlingsversjon }: Props) => {
  const grunnlag = await hentBarnetilleggGrunnlag(behandlingsreferanse);

  return <BarnetilleggVurdering grunnlag={grunnlag} behandlingsversjon={behandlingsversjon} />;
};
