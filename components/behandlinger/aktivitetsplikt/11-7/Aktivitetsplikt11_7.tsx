import { getStegSomSkalVises } from 'lib/utils/steg';
import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { Vurder11_7MedDataFetching } from './Vurder11_7/Vurder11_7MedDataFetching';
import { BrevKortMedDataFetching } from 'components/brev/BrevKortMedDataFetching';
import { BehandlingFlytOgTilstand } from 'lib/types/types';

interface Props {
  behandlingsreferanse: string;
  flyt: BehandlingFlytOgTilstand;
}

export const Aktivitetsplikt11_7 = async ({ behandlingsreferanse, flyt }: Props) => {
  const stegSomSkalVises = getStegSomSkalVises('AKTIVITETSPLIKT_11_7', flyt);
  const behandlingVersjon = flyt.behandlingVersjon;

  return (
    <GruppeSteg
      prosessering={flyt.prosessering}
      visning={flyt.visning}
      behandlingReferanse={behandlingsreferanse}
      behandlingVersjon={behandlingVersjon}
      aktivtSteg={flyt.aktivtSteg}
      brevForhåndsvisning={flyt.aktivGruppe !== 'AKTIVITETSPLIKT_11_7'}
    >
      {stegSomSkalVises.includes('VURDER_AKTIVITETSPLIKT_11_7') && (
        <StegSuspense>
          <Vurder11_7MedDataFetching
            behandlingsreferanse={behandlingsreferanse}
            behandlingVersjon={behandlingVersjon}
            readOnly={flyt.visning.saksbehandlerReadOnly}
          />
        </StegSuspense>
      )}
      {flyt.visning.visBrevkort && flyt.aktivGruppe === 'AKTIVITETSPLIKT_11_7' && (
        <BrevKortMedDataFetching
          behandlingReferanse={behandlingsreferanse}
          visAvbryt={false}
          behandlingVersjon={behandlingVersjon}
          aktivtSteg={flyt.aktivtSteg}
          behandlingstype={flyt.visning.typeBehandling}
        />
      )}
    </GruppeSteg>
  );
};
