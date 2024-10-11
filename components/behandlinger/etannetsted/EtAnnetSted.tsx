import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { HelseinstitusjonsvurderingMedDataFetching } from 'components/behandlinger/etannetsted/helseinstitusjon/HelseinstitusjonsvurderingMedDataFetching';
import { SoningsvurderingMedDataFetching } from './soning/SoningsvurderingMedDataFetching';
import { getStegSomSkalVises } from 'lib/utils/steg';
import { Behovstype } from 'lib/utils/form';

interface Props {
  behandlingsreferanse: string;
}

export const EtAnnetSted = async ({ behandlingsreferanse }: Props) => {
  const flyt = await hentFlyt(behandlingsreferanse);
  const stegSomSkalVises = getStegSomSkalVises('ET_ANNET_STED', flyt);
  const etAnnetStedGruppe = flyt.flyt.find((gruppe) => gruppe.stegGruppe === 'ET_ANNET_STED');
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
      prosessering={flyt.prosessering}
      visVenteKort={flyt.visning.visVentekort}
      behandlingReferanse={behandlingsreferanse}
      behandlingVersjon={flyt.behandlingVersjon}
    >
      {stegSomSkalVises.map((steg) => {
        if (vurderHelseinstitusjon) {
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
        if (vurderSoning) {
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
