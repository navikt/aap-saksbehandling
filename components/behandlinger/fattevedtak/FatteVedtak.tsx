import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { getStegSomSkalVises } from 'lib/utils/steg';
import { FatteVedtakMedDataFetching } from 'components/behandlinger/fattevedtak/fattevedtak/FatteVedtakMedDataFetching';
import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';

interface Props {
  behandlingsReferanse: string;
}

export const FatteVedtak = async ({ behandlingsReferanse }: Props) => {
  const flyt = await hentFlyt(behandlingsReferanse);

  const stegSomSkalVises = getStegSomSkalVises('FATTE_VEDTAK', flyt);

  return (
    <GruppeSteg
      behandlingVersjon={flyt.behandlingVersjon}
      behandlingReferanse={behandlingsReferanse}
      prosessering={flyt.prosessering}
      visning={flyt.visning}
      aktivtSteg={flyt.aktivtSteg}
    >
      {stegSomSkalVises.includes('FATTE_VEDTAK') && (
        <StegSuspense>
          <FatteVedtakMedDataFetching />
        </StegSuspense>
      )}
    </GruppeSteg>
  );
};
