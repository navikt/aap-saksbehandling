import { FastsettManuellInntekt } from 'components/behandlinger/grunnlag/fastsettmanuellinntekt/FastsettManuellInntekt';

interface Props {
  behandlingversjon: number;
  behandlingsreferanse: string;
}

export const FastsettManuellInntektMedDataFetching = ({ behandlingversjon }: Props) => {

  return <FastsettManuellInntekt behandlingsversjon={behandlingversjon} />;
};
