import {GruppeSteg} from 'components/gruppesteg/GruppeSteg';
import {hentFlyt} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import {Soningsvurdering} from 'components/behandlinger/etannetsted/soning/Soningsvurdering';
import {StegSuspense} from 'components/stegsuspense/StegSuspense';
import {
  HelseinstitusjonsvurderingMedDataFetching
} from 'components/behandlinger/etannetsted/helseinstitusjon/HelseinstitusjonsvurderingMedDataFetching';

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
      <Soningsvurdering
        readOnly={flyt.visning.saksbehandlerReadOnly}
        behandlingVersjon={flyt.behandlingVersjon}/>
    </GruppeSteg>
  );
};
