import { BehandlingFlytOgTilstand } from 'lib/types/types';
import { getStegData } from 'lib/utils/steg';
import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { AvslagAndreYtelserMedDataFetching } from 'components/behandlinger/samordning/avslag11_27/AvslagAndreYtelserMedDataFetching';

interface props {
  behandlingsreferanse: string;
  flyt: BehandlingFlytOgTilstand;
}

export const AvslagForAndreYtelser = async ({ behandlingsreferanse, flyt }: props) => {
  const stegSomSkalVises = getStegData('AVSLAG_11_27', 'VURDER_AVSLAG_11_27', flyt).skalViseSteg;
  const behandlingVersjon = flyt.behandlingVersjon;

  return (
    <GruppeSteg
      prosessering={flyt.prosessering}
      visning={flyt.visning}
      behandlingReferanse={behandlingsreferanse}
      behandlingVersjon={behandlingVersjon}
      aktivtSteg={flyt.aktivtSteg}
    >
      {stegSomSkalVises && (
        <StegSuspense>
          <AvslagAndreYtelserMedDataFetching
            behandlingsreferanse={behandlingsreferanse}
            behandlingVersjon={behandlingVersjon}
            readOnly={flyt.visning.saksbehandlerReadOnly}
          />
        </StegSuspense>
      )}
    </GruppeSteg>
  );
};
