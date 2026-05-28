import { getStegSomSkalVises } from 'lib/utils/steg';
import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { AvbrytAktivitetspliktbehandlingMedDatafetching } from 'components/behandlinger/aktivitetsplikt/avbryt/AvbrytAktivitetspliktbehandlingMedDatafetching';
import { BehandlingFlytOgTilstand } from 'lib/types/types';

interface props {
  behandlingsreferanse: string;
  flyt: BehandlingFlytOgTilstand;
}

export const AvbrytAktivitetspliktbehandling = async ({ behandlingsreferanse, flyt }: props) => {
  const stegSomSkalVises = getStegSomSkalVises('AVBRYT_AKTIVITETSPLIKTBEHANDLING', flyt);
  const behandlingVersjon = flyt.behandlingVersjon;

  return (
    <GruppeSteg
      prosessering={flyt.prosessering}
      visning={flyt.visning}
      behandlingReferanse={behandlingsreferanse}
      behandlingVersjon={behandlingVersjon}
      aktivtSteg={flyt.aktivtSteg}
    >
      {stegSomSkalVises.includes('AVBRYT_AKTIVITETSPLIKTBEHANDLING') && (
        <StegSuspense>
          <AvbrytAktivitetspliktbehandlingMedDatafetching
            behandlingsreferanse={behandlingsreferanse}
            behandlingVersjon={behandlingVersjon}
            readOnly={flyt.visning.saksbehandlerReadOnly}
          />
        </StegSuspense>
      )}
    </GruppeSteg>
  );
};
