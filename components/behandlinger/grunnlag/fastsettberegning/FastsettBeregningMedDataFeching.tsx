import { FastsettBeregning } from 'components/behandlinger/grunnlag/fastsettberegning/FastsettBeregning';

interface Props {
  behandlingsReferanse: string;
  erBeslutter: boolean;
}

export const FastsettBeregningMedDataFeching = async ({ behandlingsReferanse, erBeslutter }: Props) => {
  return <FastsettBeregning behandlingsReferanse={behandlingsReferanse} erBeslutter={erBeslutter} />;
};
