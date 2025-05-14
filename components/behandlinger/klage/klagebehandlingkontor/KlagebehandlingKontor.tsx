import { isError } from '../../../../lib/utils/api';
import { ApiException } from '../../../saksbehandling/apiexception/ApiException';
import { hentFlyt } from '../../../../lib/services/saksbehandlingservice/saksbehandlingService';
import { TypeBehandling } from '../../../../lib/types/types';
import { getStegSomSkalVises } from '../../../../lib/utils/steg';
import { GruppeSteg } from '../../../gruppesteg/GruppeSteg';
import { StegSuspense } from '../../../stegsuspense/StegSuspense';
import { KlagebehandlingVurderingKontorMedDataFetching } from './klagebehandlingkontor/KlagebehandlingVurderingKontorMedDataFetching';

interface Props {
  behandlingsreferanse: string;
}

export const KlagebehandlingKontor = async ({ behandlingsreferanse }: Props) => {
  const flyt = await hentFlyt(behandlingsreferanse);
  if (isError(flyt)) {
    return <ApiException apiResponses={[flyt]} />;
  }
  const stegSomSkalVises = getStegSomSkalVises('KLAGEBEHANDLING_KONTOR', flyt.data);
  const behandlingVersjon = flyt.data.behandlingVersjon;

  return (
    <GruppeSteg
      prosessering={flyt.data.prosessering}
      visning={flyt.data.visning}
      behandlingReferanse={behandlingsreferanse}
      behandlingVersjon={flyt.data.behandlingVersjon}
      aktivtSteg={flyt.data.aktivtSteg}
    >
      {stegSomSkalVises.includes('KLAGEBEHANDLING_KONTOR') && (
        <StegSuspense>
          <KlagebehandlingVurderingKontorMedDataFetching
            behandlingsreferanse={behandlingsreferanse}
            behandlingVersjon={behandlingVersjon}
            readOnly={flyt.data.visning.saksbehandlerReadOnly}
            erAktivtSteg={flyt.data.aktivtSteg == 'KLAGEBEHANDLING_KONTOR'}
            typeBehandling={flyt.data.visning.typeBehandling as TypeBehandling}
          />
        </StegSuspense>
      )}
    </GruppeSteg>
  );
};
