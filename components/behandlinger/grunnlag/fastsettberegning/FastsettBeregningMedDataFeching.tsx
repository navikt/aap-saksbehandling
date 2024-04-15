import { FastsettBeregning } from 'components/behandlinger/grunnlag/fastsettberegning/FastsettBeregning';

interface Props {
  behandlingsReferanse: string;
  readOnly: boolean;
}

export const FastsettBeregningMedDataFeching = async ({ behandlingsReferanse, readOnly }: Props) => {
  return <FastsettBeregning behandlingsReferanse={behandlingsReferanse} readOnly={readOnly} />;
};
