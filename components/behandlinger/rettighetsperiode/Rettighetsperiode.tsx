import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { VurderRettighetsperiodeMedDataFetching } from 'components/behandlinger/rettighetsperiode/vurderrettighetsperiode/VurderRettighetsperiodeMedDataFetching';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { getStegData } from 'lib/utils/steg';

interface Props {
  behandlingsreferanse: string;
}

export const Rettighetsperiode = async ({ behandlingsreferanse }: Props) => {
  const flyt = await hentFlyt(behandlingsreferanse);
  if (isError(flyt)) {
    return <ApiException apiResponses={[flyt]} />;
  }

  const rettighetsperiodeSteg = getStegData('RETTIGHETSPERIODE', 'VURDER_RETTIGHETSPERIODE', flyt.data);

  return (
    <GruppeSteg
      behandlingVersjon={flyt.data.behandlingVersjon}
      behandlingReferanse={behandlingsreferanse}
      prosessering={flyt.data.prosessering}
      visning={flyt.data.visning}
      aktivtSteg={flyt.data.aktivtSteg}
    >
      {rettighetsperiodeSteg.skalViseSteg && (
        <StegSuspense>
          <VurderRettighetsperiodeMedDataFetching
            behandlingsreferanse={behandlingsreferanse}
            stegData={rettighetsperiodeSteg}
          />
        </StegSuspense>
      )}
    </GruppeSteg>
  );
};
