import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { HelseinstitusjonMedDataFetching } from 'components/behandlinger/institusjonsopphold/helseinstitusjon/HelseinstitusjonMedDataFetching';
import { SoningsvurderingMedDataFetching } from './soning/SoningsvurderingMedDataFetching';
import { Behovstype } from 'lib/utils/form';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { getStegData } from 'lib/utils/steg';
import { ManglendeInstitusjonsOpphold } from 'components/behandlinger/institusjonsopphold/helseinstitusjon/ManglendeInstitusjonsOpphold';

interface Props {
  behandlingsreferanse: string;
}

export const Institusjonsopphold = async ({ behandlingsreferanse }: Props) => {
  const flyt = await hentFlyt(behandlingsreferanse);
  if (isError(flyt)) {
    return <ApiException apiResponses={[flyt]} />;
  }

  const vurderHelseinstitusjonSteg = getStegData(
    'ET_ANNET_STED',
    'DU_ER_ET_ANNET_STED',
    flyt.data,
    Behovstype.AVKLAR_HELSEINSTITUSJON
  );
  const vurderSoningSteg = getStegData(
    'ET_ANNET_STED',
    'DU_ER_ET_ANNET_STED',
    flyt.data,
    Behovstype.AVKLAR_SONINGSFORRHOLD
  );
  return (
    <GruppeSteg
      prosessering={flyt.data.prosessering}
      visning={flyt.data.visning}
      behandlingReferanse={behandlingsreferanse}
      behandlingVersjon={flyt.data.behandlingVersjon}
      aktivtSteg={flyt.data.aktivtSteg}
    >
      {vurderHelseinstitusjonSteg.skalViseSteg && (
        <StegSuspense>
          <HelseinstitusjonMedDataFetching
            behandlingsreferanse={behandlingsreferanse}
            stegData={vurderHelseinstitusjonSteg}
          />
        </StegSuspense>
      )}
      {vurderSoningSteg.skalViseSteg && (
        <StegSuspense>
          <SoningsvurderingMedDataFetching behandlingsreferanse={behandlingsreferanse} stegData={vurderSoningSteg} />
        </StegSuspense>
      )}
      {!vurderHelseinstitusjonSteg.skalViseSteg && !vurderSoningSteg.skalViseSteg && (
        <StegSuspense>
          <ManglendeInstitusjonsOpphold />
        </StegSuspense>
      )}
    </GruppeSteg>
  );
};
