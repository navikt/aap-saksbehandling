import { FastsettBeregning } from 'components/behandlinger/grunnlag/fastsettberegning/FastsettBeregning';
import { hentSykdomsGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';

interface Props {
  behandlingsReferanse: string;
}

export const FastsettBeregningMedDataFeching = async ({ behandlingsReferanse }: Props) => {
  const sykdomsgrunnlag = await hentSykdomsGrunnlag(behandlingsReferanse);
  return <FastsettBeregning behandlingsReferanse={behandlingsReferanse} sykdomsgrunnlag={sykdomsgrunnlag} />;
};
