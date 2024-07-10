import {GruppeSteg} from 'components/gruppesteg/GruppeSteg';
import {hentFlyt} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import {StegSuspense} from 'components/stegsuspense/StegSuspense';
import {
  HelseinstitusjonsvurderingMedDataFetching
} from 'components/behandlinger/etannetsted/helseinstitusjon/HelseinstitusjonsvurderingMedDataFetching';
import {SoningsvurderingMedDataFetching} from "./soning/SoningsvurderingMedDataFetching";

type Props = {
  behandlingsreferanse: string;
};

export const EtAnnetSted = async ({behandlingsreferanse}: Props) => {
  const flyt = await hentFlyt(behandlingsreferanse);

  return (
    <GruppeSteg
      prosessering={flyt.prosessering}
      visVenteKort={flyt.visning.visVentekort}
      behandlingReferanse={behandlingsreferanse}
      behandlingVersjon={flyt.behandlingVersjon}
    >
      <StegSuspense>
        <HelseinstitusjonsvurderingMedDataFetching
          readOnly={flyt.visning.saksbehandlerReadOnly}
          behandlingVersjon={flyt.behandlingVersjon}
        />
      </StegSuspense>
      <StegSuspense>
        <SoningsvurderingMedDataFetching
          behandlingsreferanse={behandlingsreferanse}
          behandlingsversjon={flyt.behandlingVersjon}
          readOnly={flyt.visning.saksbehandlerReadOnly}/>
      </StegSuspense>
    </GruppeSteg>
  );
};
