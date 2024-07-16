import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { HelseinstitusjonsvurderingMedDataFetching } from 'components/behandlinger/etannetsted/helseinstitusjon/HelseinstitusjonsvurderingMedDataFetching';
import { SoningsvurderingMedDataFetching } from './soning/SoningsvurderingMedDataFetching';
import { getStegSomSkalVises } from 'lib/utils/steg';

type Props = {
  behandlingsreferanse: string;
};

export const EtAnnetSted = async ({ behandlingsreferanse }: Props) => {
  const flyt = await hentFlyt(behandlingsreferanse);
  const stegSomSkalVises = getStegSomSkalVises('ET_ANNET_STED', flyt);

  return (
    <GruppeSteg
      prosessering={flyt.prosessering}
      visVenteKort={flyt.visning.visVentekort}
      behandlingReferanse={behandlingsreferanse}
      behandlingVersjon={flyt.behandlingVersjon}
    >
      {stegSomSkalVises.map((steg) => {
        if (steg === 'VURDER_HELSEINSTITUSJON') {
          return (
            <StegSuspense key={steg}>
              <HelseinstitusjonsvurderingMedDataFetching
                behandlingsreferanse={behandlingsreferanse}
                readOnly={flyt.visning.saksbehandlerReadOnly}
                behandlingVersjon={flyt.behandlingVersjon}
              />
            </StegSuspense>
          );
        }
        if (steg === 'VURDER_SONING') {
          return (
            <StegSuspense key={steg}>
              <SoningsvurderingMedDataFetching
                behandlingsreferanse={behandlingsreferanse}
                behandlingsversjon={flyt.behandlingVersjon}
                readOnly={flyt.visning.saksbehandlerReadOnly}
              />
            </StegSuspense>
          );
        }
      })}
    </GruppeSteg>
  );
};
