import { FastsettBeregning } from 'components/behandlinger/grunnlag/fastsettberegning/FastsettBeregning';

interface Props {
  behandlingsReferanse: string;
}

export const FastsettBeregningMedDataFeching = async ({ behandlingsReferanse }: Props) => {
  return <FastsettBeregning behandlingsReferanse={behandlingsReferanse} />;
};
