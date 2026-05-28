import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { Vurder11_9MedDataFetching } from './Vurder11_9/Vurder11_9MedDataFetching';
import { BehandlingFlytOgTilstand } from 'lib/types/types';

interface Props {
  behandlingsreferanse: string;
  flyt: BehandlingFlytOgTilstand;
}

export const Aktivitetsplikt11_9 = async ({ behandlingsreferanse, flyt }: Props) => {
  //const stegSomSkalVises = getStegSomSkalVises('AKTIVITETSPLIKT_11_9', flyt);
  const stegSomSkalVises = ['VURDER_AKTIVITETSPLIKT_11_9'];
  const behandlingVersjon = flyt.behandlingVersjon;

  return (
    <GruppeSteg
      prosessering={flyt.prosessering}
      visning={flyt.visning}
      behandlingReferanse={behandlingsreferanse}
      behandlingVersjon={behandlingVersjon}
      aktivtSteg={flyt.aktivtSteg}
    >
      {stegSomSkalVises.includes('VURDER_AKTIVITETSPLIKT_11_9') && (
        <StegSuspense>
          <Vurder11_9MedDataFetching
            behandlingsreferanse={behandlingsreferanse}
            behandlingVersjon={behandlingVersjon}
            readOnly={flyt.visning.saksbehandlerReadOnly}
          />
        </StegSuspense>
      )}
    </GruppeSteg>
  );
};
