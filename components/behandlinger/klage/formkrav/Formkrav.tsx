import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { TypeBehandling } from 'lib/types/types';
import { getStegSomSkalVises } from 'lib/utils/steg';
import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { FormkravVurderingMedDataFetching } from './formkravvurdering/FormkravVurderingMedDataFetching';
import { PåklagetBehandlingMedDataFetching } from './påklagetbehandling/PåklagetBehandlingMedDataFetching';
import { BehandlendeEnhetMedDataFetching } from './behandlendeenhet/BehandlendeEnhetMedDataFetching';
import { FullmektigVurderingMedDataFetching } from 'components/behandlinger/klage/formkrav/fullmektig/FullmektigVurderingMedDataFetching';
import { BrevKortMedDataFetching } from 'components/brev/BrevKortMedDataFetching';

interface Props {
  behandlingsreferanse: string;
}

export const Formkrav = async ({ behandlingsreferanse }: Props) => {
  const flyt = await hentFlyt(behandlingsreferanse);
  if (isError(flyt)) {
    return <ApiException apiResponses={[flyt]} />;
  }
  const stegSomSkalVises = getStegSomSkalVises('FORMKRAV', flyt.data);
  const behandlingVersjon = flyt.data.behandlingVersjon;

  return (
    <GruppeSteg
      prosessering={flyt.data.prosessering}
      brevForhåndsvisning={flyt.data.aktivGruppe !== 'FORMKRAV'}
      visning={flyt.data.visning}
      behandlingReferanse={behandlingsreferanse}
      behandlingVersjon={flyt.data.behandlingVersjon}
      aktivtSteg={flyt.data.aktivtSteg}
    >
      {stegSomSkalVises.includes('PÅKLAGET_BEHANDLING') && (
        <StegSuspense>
          <PåklagetBehandlingMedDataFetching
            behandlingsreferanse={behandlingsreferanse}
            behandlingVersjon={behandlingVersjon}
            readOnly={flyt.data.visning.saksbehandlerReadOnly}
            typeBehandling={flyt.data.visning.typeBehandling as TypeBehandling}
          />
        </StegSuspense>
      )}
      {stegSomSkalVises.includes('FULLMEKTIG') && (
        <StegSuspense>
          <FullmektigVurderingMedDataFetching
            behandlingsreferanse={behandlingsreferanse}
            behandlingVersjon={behandlingVersjon}
            readOnly={flyt.data.visning.saksbehandlerReadOnly}
            typeBehandling={flyt.data.visning.typeBehandling as TypeBehandling}
          />
        </StegSuspense>
      )}
      {stegSomSkalVises.includes('FORMKRAV') && (
        <StegSuspense>
          <FormkravVurderingMedDataFetching
            behandlingsreferanse={behandlingsreferanse}
            behandlingVersjon={behandlingVersjon}
            readOnly={flyt.data.visning.saksbehandlerReadOnly}
            typeBehandling={flyt.data.visning.typeBehandling as TypeBehandling}
          />
        </StegSuspense>
      )}
      {flyt.data.visning.visBrevkort && flyt.data.aktivGruppe === 'FORMKRAV' && (
        <BrevKortMedDataFetching
          behandlingReferanse={behandlingsreferanse}
          visAvbryt={false}
          behandlingVersjon={behandlingVersjon}
          aktivtSteg={flyt.data.aktivtSteg}
        />
      )}
      {stegSomSkalVises.includes('BEHANDLENDE_ENHET') && (
        <StegSuspense>
          <BehandlendeEnhetMedDataFetching
            behandlingsreferanse={behandlingsreferanse}
            behandlingVersjon={behandlingVersjon}
            readOnly={flyt.data.visning.saksbehandlerReadOnly}
            typeBehandling={flyt.data.visning.typeBehandling as TypeBehandling}
          />
        </StegSuspense>
      )}
    </GruppeSteg>
  );
};
