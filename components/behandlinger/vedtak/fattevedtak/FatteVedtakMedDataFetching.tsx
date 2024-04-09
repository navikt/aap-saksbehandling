import { FatteVedtak } from 'components/behandlinger/vedtak/fattevedtak/FatteVedtak';

interface Props {
  behandlingsReferanse: string;
}

export const FatteVedtakMedDataFetching = ({ behandlingsReferanse }: Props) => {
  return <FatteVedtak behandlingsReferanse={behandlingsReferanse} />;
};
