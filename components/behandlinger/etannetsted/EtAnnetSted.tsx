import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { HelseinstitusjonMedDataFetching } from 'components/behandlinger/etannetsted/helseinstitusjon/HelseinstitusjonMedDataFetching';
import { SoningsvurderingMedDataFetching } from './soning/SoningsvurderingMedDataFetching';
import { Behovstype } from 'lib/utils/form';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';

interface Props {
  behandlingsreferanse: string;
}

export const EtAnnetSted = async ({ behandlingsreferanse }: Props) => {
  const flytResponse = await hentFlyt(behandlingsreferanse);
  if (isError(flytResponse)) {
    return <ApiException apiResponses={[flytResponse]} />;
  }

  const etAnnetStedGruppe = flytResponse.data.flyt.find((gruppe) => gruppe.stegGruppe === 'ET_ANNET_STED');
  const avklaringsBehov = etAnnetStedGruppe?.steg.find((steg) => steg.avklaringsbehov);

  /*
   TODO 09.08.2024 - hacky løsning for å midlertidig kunne vise soning og opphold på helseinstitusjon
   */
  const vurderHelseinstitusjon =
    avklaringsBehov?.avklaringsbehov.find((b) => b.definisjon.kode === Behovstype.AVKLAR_HELSEINSTITUSJON) != null;
  const vurderSoning =
    avklaringsBehov?.avklaringsbehov.find((behov) => behov.definisjon.kode === Behovstype.AVKLAR_SONINGSFORRHOLD) !=
    null;

  return (
    <GruppeSteg
      prosessering={flytResponse.data.prosessering}
      visning={flytResponse.data.visning}
      behandlingReferanse={behandlingsreferanse}
      behandlingVersjon={flytResponse.data.behandlingVersjon}
      aktivtSteg={flytResponse.data.aktivtSteg}
    >
      {vurderHelseinstitusjon && (
        <StegSuspense>
          <HelseinstitusjonMedDataFetching
            behandlingsreferanse={behandlingsreferanse}
            readOnly={flytResponse.data.visning.saksbehandlerReadOnly}
            behandlingVersjon={flytResponse.data.behandlingVersjon}
          />
        </StegSuspense>
      )}
      {vurderSoning && (
        <StegSuspense>
          <SoningsvurderingMedDataFetching
            behandlingsreferanse={behandlingsreferanse}
            behandlingsversjon={flytResponse.data.behandlingVersjon}
            readOnly={flytResponse.data.visning.saksbehandlerReadOnly}
          />
        </StegSuspense>
      )}
    </GruppeSteg>
  );
};
