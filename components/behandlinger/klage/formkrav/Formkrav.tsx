import { getStegSomSkalVises } from 'lib/utils/steg';
import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { FormkravVurderingMedDataFetching } from './formkravvurdering/FormkravVurderingMedDataFetching';
import { PåklagetBehandlingMedDataFetching } from './påklagetbehandling/PåklagetBehandlingMedDataFetching';
import { BehandlendeEnhetMedDataFetching } from './behandlendeenhet/BehandlendeEnhetMedDataFetching';
import { FullmektigVurderingMedDataFetching } from 'components/behandlinger/klage/formkrav/fullmektig/FullmektigVurderingMedDataFetching';
import { BrevKortMedDataFetching } from 'components/brev/BrevKortMedDataFetching';
import { BehandlingFlytOgTilstand } from 'lib/types/types';

interface Props {
  behandlingsreferanse: string;
  flyt: BehandlingFlytOgTilstand;
}

export const Formkrav = async ({ behandlingsreferanse, flyt }: Props) => {
  const stegSomSkalVises = getStegSomSkalVises('FORMKRAV', flyt);
  const behandlingVersjon = flyt.behandlingVersjon;

  return (
    <GruppeSteg
      prosessering={flyt.prosessering}
      brevForhåndsvisning={flyt.aktivGruppe !== 'FORMKRAV'}
      visning={flyt.visning}
      behandlingReferanse={behandlingsreferanse}
      behandlingVersjon={flyt.behandlingVersjon}
      aktivtSteg={flyt.aktivtSteg}
    >
      {stegSomSkalVises.includes('PÅKLAGET_BEHANDLING') && (
        <StegSuspense>
          <PåklagetBehandlingMedDataFetching
            behandlingsreferanse={behandlingsreferanse}
            behandlingVersjon={behandlingVersjon}
            readOnly={flyt.visning.saksbehandlerReadOnly}
            typeBehandling={flyt.visning.typeBehandling}
          />
        </StegSuspense>
      )}
      {stegSomSkalVises.includes('FULLMEKTIG') && (
        <StegSuspense>
          <FullmektigVurderingMedDataFetching
            behandlingsreferanse={behandlingsreferanse}
            behandlingVersjon={behandlingVersjon}
            readOnly={flyt.visning.saksbehandlerReadOnly}
            typeBehandling={flyt.visning.typeBehandling}
          />
        </StegSuspense>
      )}
      {stegSomSkalVises.includes('FORMKRAV') && (
        <StegSuspense>
          <FormkravVurderingMedDataFetching
            behandlingsreferanse={behandlingsreferanse}
            behandlingVersjon={behandlingVersjon}
            readOnly={flyt.visning.saksbehandlerReadOnly}
            typeBehandling={flyt.visning.typeBehandling}
          />
        </StegSuspense>
      )}
      {flyt.visning.visBrevkort && flyt.aktivGruppe === 'FORMKRAV' && (
        <BrevKortMedDataFetching
          behandlingReferanse={behandlingsreferanse}
          visAvbryt={false}
          behandlingVersjon={behandlingVersjon}
          aktivtSteg={flyt.aktivtSteg}
        />
      )}
      {stegSomSkalVises.includes('BEHANDLENDE_ENHET') && (
        <StegSuspense>
          <BehandlendeEnhetMedDataFetching
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
