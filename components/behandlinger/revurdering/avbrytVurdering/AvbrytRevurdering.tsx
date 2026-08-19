import { getStegSomSkalVises } from 'lib/utils/steg';
import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { AvbrytRevurderingMedDatafetching } from 'components/behandlinger/revurdering/avbrytVurdering/vurdering/AvbrytRevurderingMedDatafetching';
import { BehandlingFlytOgTilstand } from 'lib/types/types';

interface props {
  behandlingsreferanse: string;
  flyt: BehandlingFlytOgTilstand;
}

export const AvbrytRevurdering = async ({ behandlingsreferanse, flyt }: props) => {
  const stegSomSkalVises = getStegSomSkalVises('AVBRYT_REVURDERING', flyt);
  const behandlingVersjon = flyt.behandlingVersjon;

  return (
    <GruppeSteg
      prosessering={flyt.prosessering}
      visning={flyt.visning}
      behandlingReferanse={behandlingsreferanse}
      behandlingVersjon={behandlingVersjon}
      aktivtSteg={flyt.aktivtSteg}
    >
      {stegSomSkalVises.includes('AVBRYT_REVURDERING') && (
        <StegSuspense>
          <AvbrytRevurderingMedDatafetching
            behandlingsreferanse={behandlingsreferanse}
            behandlingVersjon={behandlingVersjon}
            readOnly={flyt.visning.saksbehandlerReadOnly}
          />
        </StegSuspense>
      )}
    </GruppeSteg>
  );
};
