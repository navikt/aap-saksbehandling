import { BarnetilleggVurdering } from 'components/behandlinger/barnetillegg/barnetilleggvurdering/BarnetilleggVurdering';
import { hentBarnetilleggGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';

type Props = {
  behandlingsreferanse: string;
};

export const BarnMedDataFetching = async ({ behandlingsreferanse }: Props) => {
  const grunnlag = await hentBarnetilleggGrunnlag(behandlingsreferanse);

  return <BarnetilleggVurdering grunnlag={grunnlag} />;
};
