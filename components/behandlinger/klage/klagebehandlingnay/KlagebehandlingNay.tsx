import { getStegSomSkalVises } from 'lib/utils/steg';
import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { KlagebehandlingVurderingNayMedDataFetching } from 'components/behandlinger/klage/klagebehandlingnay/KlagebehandlingVurderingNayMedDataFetching';
import { KlagebehandlingOppsummeringMedDataFetching } from 'components/behandlinger/klage/klagebehandlingoppsummering/KlagebehandlingOppsummeringMedDataFetching';
import { BehandlingFlytOgTilstand } from 'lib/types/types';

interface Props {
  behandlingsreferanse: string;
  flyt: BehandlingFlytOgTilstand;
}

export const KlagebehandlingNay = async ({ behandlingsreferanse, flyt }: Props) => {
  const stegSomSkalVises = getStegSomSkalVises('KLAGEBEHANDLING_NAY', flyt);
  const behandlingVersjon = flyt.behandlingVersjon;

  return (
    <GruppeSteg
      prosessering={flyt.prosessering}
      visning={flyt.visning}
      behandlingReferanse={behandlingsreferanse}
      behandlingVersjon={flyt.behandlingVersjon}
      aktivtSteg={flyt.aktivtSteg}
    >
      {stegSomSkalVises.includes('KLAGEBEHANDLING_NAY') && (
        <StegSuspense>
          <KlagebehandlingVurderingNayMedDataFetching
            behandlingsreferanse={behandlingsreferanse}
            behandlingVersjon={behandlingVersjon}
            readOnly={flyt.visning.saksbehandlerReadOnly}
            typeBehandling={flyt.visning.typeBehandling}
          />
        </StegSuspense>
      )}
      {stegSomSkalVises.includes('KLAGEBEHANDLING_OPPSUMMERING') && (
        <StegSuspense>
          <KlagebehandlingOppsummeringMedDataFetching
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
