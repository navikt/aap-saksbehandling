import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { getStegSomSkalVises } from 'lib/utils/steg';
import { FatteVedtakMedDataFetching } from 'components/behandlinger/fattevedtak/fattevedtak/FatteVedtakMedDataFetching';
import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { BehandlingFlytOgTilstand } from 'lib/types/types';

interface Props {
  behandlingsreferanse: string;
  flyt: BehandlingFlytOgTilstand;
}

export const FatteVedtak = async ({ behandlingsreferanse, flyt }: Props) => {
  const stegSomSkalVises = getStegSomSkalVises('FATTE_VEDTAK', flyt);

  return (
    <GruppeSteg
      behandlingVersjon={flyt.behandlingVersjon}
      behandlingReferanse={behandlingsreferanse}
      prosessering={flyt.prosessering}
      visning={flyt.visning}
      aktivtSteg={flyt.aktivtSteg}
    >
      {stegSomSkalVises.includes('FATTE_VEDTAK') && (
        <StegSuspense>
          <FatteVedtakMedDataFetching behandlingsreferanse={behandlingsreferanse} />
        </StegSuspense>
      )}
    </GruppeSteg>
  );
};
