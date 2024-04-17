import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { TilkjentMedDatafetching } from 'components/behandlinger/tilkjentytelse/tilkjent/TilkjentMedDatafetching';

interface Props {
  behandlingsReferanse: string;
}
export const TilkjentYtelse = async ({ behandlingsReferanse }: Props) => {
  return (
    <StegSuspense>
      <TilkjentMedDatafetching behandlingsReferanse={behandlingsReferanse} readOnly={false} />
    </StegSuspense>
  );
};
