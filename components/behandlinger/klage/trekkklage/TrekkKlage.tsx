import { getStegSomSkalVises } from 'lib/utils/steg';
import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { TrekkKlageVurderingMedDataFetching } from 'components/behandlinger/klage/trekkklage/vurdering/TrekkKlageVurderingMedDataFetching';
import { BehandlingFlytOgTilstand } from 'lib/types/types';

interface Props {
  behandlingsreferanse: string;
  flyt: BehandlingFlytOgTilstand;
}

export const TrekkKlage = async ({ behandlingsreferanse, flyt }: Props) => {
  const stegSomSkalVises = getStegSomSkalVises('TREKK_KLAGE', flyt);
  const behandlingVersjon = flyt.behandlingVersjon;

  return (
    <GruppeSteg
      prosessering={flyt.prosessering}
      visning={flyt.visning}
      behandlingReferanse={behandlingsreferanse}
      behandlingVersjon={flyt.behandlingVersjon}
      aktivtSteg={flyt.aktivtSteg}
    >
      {stegSomSkalVises.includes('TREKK_KLAGE') && (
        <StegSuspense>
          <TrekkKlageVurderingMedDataFetching
            behandlingsreferanse={behandlingsreferanse}
            behandlingVersjon={behandlingVersjon}
            readOnly={flyt.visning.saksbehandlerReadOnly}
            typeBehandling={flyt.visning.typeBehandling}
          />
        </StegSuspense>
      )}
    </GruppeSteg>
  );
};
