import { isError } from '../../../../lib/utils/api';
import { ApiException } from '../../../saksbehandling/apiexception/ApiException';
import { hentFlyt } from '../../../../lib/services/saksbehandlingservice/saksbehandlingService';
import { TypeBehandling } from '../../../../lib/types/types';
import { getStegSomSkalVises } from '../../../../lib/utils/steg';
import { GruppeSteg } from '../../../gruppesteg/GruppeSteg';
import { StegSuspense } from '../../../stegsuspense/StegSuspense';
import { FormkravVurderingMedDataFetching } from './formkravvurdering/FormkravVurderingMedDataFetching';
import { PåklagetBehandlingMedDataFetching } from './påklagetbehandling/PåklagetBehandlingMedDataFetching';
import { BehandlendeEnhetMedDataFetching } from './behandlendeenhet/BehandlendeEnhetMedDataFetching';

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
            erAktivtSteg={flyt.data.aktivtSteg == 'PÅKLAGET_BEHANDLING'}
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
            erAktivtSteg={flyt.data.aktivtSteg == 'FORMKRAV'}
            typeBehandling={flyt.data.visning.typeBehandling as TypeBehandling}
          />
        </StegSuspense>
      )}
      {stegSomSkalVises.includes('BEHANDLENDE_ENHET') && (
        <StegSuspense>
          <BehandlendeEnhetMedDataFetching
            behandlingsreferanse={behandlingsreferanse}
            behandlingVersjon={behandlingVersjon}
            readOnly={flyt.data.visning.saksbehandlerReadOnly}
            erAktivtSteg={flyt.data.aktivtSteg == 'BEHANDLENDE_ENHET'}
            typeBehandling={flyt.data.visning.typeBehandling as TypeBehandling}
          />
        </StegSuspense>
      )}
    </GruppeSteg>
  );
};
