import { Sykepengeerstatning } from 'components/behandlinger/sykdom/vurdersykepengeerstatning/Sykepengeerstatning';

interface Props {
  behandlingsReferanse: string;
}

export const SykepengeerstatningMedDataFetching = ({ behandlingsReferanse }: Props) => {
  return <Sykepengeerstatning behandlingsReferanse={behandlingsReferanse} />;
};
