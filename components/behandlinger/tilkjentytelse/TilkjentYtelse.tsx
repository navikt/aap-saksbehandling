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
    <StegSuspense>
      <GruppeSteg
        behandlingVersjon={flyt.behandlingVersjon}
        behandlingReferanse={behandlingsReferanse}
        prosessering={flyt.prosessering}
        visVenteKort={flyt.visning.visVentekort}
      >
        <TilkjentMedDatafetching behandlingsReferanse={behandlingsReferanse} readOnly={false} />
      </GruppeSteg>
    </StegSuspense>
  );
};
