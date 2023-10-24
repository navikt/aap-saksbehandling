import { Sykepengeerstatning } from 'components/behandlinger/sykepengeerstatning/vurdersykepengeerstatning/Sykepengeerstatning';

interface Props {
  behandlingsReferanse: string;
}

export const SykepengeerstatningMedDataFetching = ({ behandlingsReferanse }: Props) => {
  // TODO Hent noe fra backend her

  return <Sykepengeerstatning behandlingsReferanse={behandlingsReferanse} />;
};
