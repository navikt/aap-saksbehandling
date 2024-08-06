import { BarnetilleggVurdering } from 'components/behandlinger/barnetillegg/barnetilleggvurdering/BarnetilleggVurdering';
import { hentBarnetilleggGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';

type Props = {
  behandlingsreferanse: string;
  behandlingsversjon: number;
  readOnly: boolean;
};

export const BarnetilleggVurderingMedDataFetching = async ({
  behandlingsreferanse,
  behandlingsversjon,
  readOnly,
}: Props) => {
  const grunnlag = await hentBarnetilleggGrunnlag(behandlingsreferanse);

  return <BarnetilleggVurdering grunnlag={grunnlag} behandlingsversjon={behandlingsversjon} readOnly={readOnly} />;
};
