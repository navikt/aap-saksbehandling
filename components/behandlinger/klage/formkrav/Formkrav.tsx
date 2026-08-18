import { BehandlingFlytOgTilstand } from 'lib/types/types';
import { getStegSomSkalVises } from 'lib/utils/steg';

import { FullmektigVurderingMedDataFetching } from 'components/behandlinger/klage/formkrav/fullmektig/FullmektigVurderingMedDataFetching';
import { BrevKortMedDataFetching } from 'components/brev/BrevKortMedDataFetching';
import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { StegSuspense } from 'components/stegsuspense/StegSuspense';

import { BehandlendeEnhetMedDataFetching } from './behandlendeenhet/BehandlendeEnhetMedDataFetching';
import { FormkravVurderingMedDataFetching } from './formkravvurdering/FormkravVurderingMedDataFetching';
import { PåklagetBehandlingMedDataFetching } from './påklagetbehandling/PåklagetBehandlingMedDataFetching';

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
            visVentekort={flyt.visning.visVentekort}
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
            visVentekort={flyt.visning.visVentekort}
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
            visVentekort={flyt.visning.visVentekort}
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
            visVentekort={flyt.visning.visVentekort}
          />
        </StegSuspense>
      )}
    </GruppeSteg>
  );
};
