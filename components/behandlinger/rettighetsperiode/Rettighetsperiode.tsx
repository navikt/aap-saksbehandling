import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { VurderRettighetsperiodeMedDataFetching } from 'components/behandlinger/rettighetsperiode/vurderrettighetsperiode/VurderRettighetsperiodeMedDataFetching';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { getStegData } from 'lib/utils/steg';

interface Props {
  behandlingsReferanse: string;
}

export const Rettighetsperiode = async ({ behandlingsReferanse }: Props) => {
  const flyt = await hentFlyt(behandlingsReferanse);
  if (isError(flyt)) {
    return <ApiException apiResponses={[flyt]} />;
  }

  const rettighetsperiodeSteg = getStegData('RETTIGHETSPERIODE', 'VURDER_RETTIGHETSPERIODE', flyt.data);

  return (
    <GruppeSteg
      behandlingVersjon={flyt.data.behandlingVersjon}
      behandlingReferanse={behandlingsReferanse}
      prosessering={flyt.data.prosessering}
      visning={flyt.data.visning}
      aktivtSteg={flyt.data.aktivtSteg}
    >
      {rettighetsperiodeSteg.skalViseSteg && (
        <StegSuspense>
          <VurderRettighetsperiodeMedDataFetching
            behandlingsreferanse={behandlingsReferanse}
            readOnly={flyt.data.visning.saksbehandlerReadOnly}
            behandlingVersjon={flyt.data.behandlingVersjon}
          />
        </StegSuspense>
      )}
    </GruppeSteg>
  );
};
