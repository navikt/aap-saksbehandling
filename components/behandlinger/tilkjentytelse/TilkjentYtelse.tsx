import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { TilkjentMedDatafetching } from 'components/behandlinger/tilkjentytelse/tilkjent/TilkjentMedDatafetching';
import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';

interface Props {
  behandlingsReferanse: string;
}
export const TilkjentYtelse = async ({ behandlingsReferanse }: Props) => {
  const flyt = await hentFlyt(behandlingsReferanse);
  return (
    <GruppeSteg
      behandlingVersjon={flyt.behandlingVersjon}
      behandlingReferanse={behandlingsReferanse}
      prosessering={flyt.prosessering}
      visning={flyt.visning}
      aktivtSteg={flyt.aktivtSteg}
    >
      <StegSuspense>
        <TilkjentMedDatafetching behandlingsReferanse={behandlingsReferanse} readOnly={false} />
      </StegSuspense>
    </GruppeSteg>
  );
};
