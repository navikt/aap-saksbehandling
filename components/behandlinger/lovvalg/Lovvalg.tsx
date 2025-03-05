import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { getStegSomSkalVises } from 'lib/utils/steg';
import { LovvalgOgMedlemskapVedSøknadsTidspunktOverstyringsWrapper } from 'components/behandlinger/lovvalg/LovvalgOgMedlemskapVedSøknadsTidspunktOverstyringswrapper';
import { LovvalgOgMedlemskapVedSKnadstidspunktMedDatafetching } from 'components/behandlinger/lovvalg/lovvalgogmedlemskapvedsøknadstidspunkt/LovvalgOgMedlemskapVedSøknadstidspunktMedDatafetching';
import { AutomatiskLovvalgOgMedlemskapVurdering } from 'lib/types/types';

interface Props {
  behandlingsReferanse: string;
  sakId: string;
}
export const Lovvalg = async ({ behandlingsReferanse }: Props) => {
  const flyt = await hentFlyt(behandlingsReferanse);
  const behandlingsVersjon = flyt.behandlingVersjon;
  const stegSomSkalVises = getStegSomSkalVises('LOVVALG', flyt);
  const saksBehandlerReadOnly = flyt.visning.saksbehandlerReadOnly;
  // const vurderingAutomatisk = await hentAutomatiskLovvalgOgMedlemskapVurdering(behandlingsReferanse);
  // const visOverstyrKnapp = vurderingAutomatisk.kanBehandlesAutomatisk && stegSomSkalVises.length === 0;
  const vurdering: AutomatiskLovvalgOgMedlemskapVurdering = {
    kanBehandlesAutomatisk: true,
    tilhørighetVurdering: [
      {
        indikasjon: 'I_NORGE',
        kilde: ['SØKNAD'],
        opplysning: 'opplysning',
        resultat: true,
      },
    ],
  };

  return (
    <GruppeSteg
      prosessering={flyt.prosessering}
      visning={flyt.visning}
      behandlingReferanse={behandlingsReferanse}
      behandlingVersjon={behandlingsVersjon}
    >
      <LovvalgOgMedlemskapVedSøknadsTidspunktOverstyringsWrapper
        automatiskVurdering={vurdering}
        stegSomSkalVises={stegSomSkalVises}
        behandlingsReferanse={behandlingsReferanse}
        behandlingVersjon={behandlingsVersjon}
        readOnly={saksBehandlerReadOnly}
        visOverstyrKnapp={false}
      >
        {stegSomSkalVises.includes('VURDER_LOVVALG') && (
          <LovvalgOgMedlemskapVedSKnadstidspunktMedDatafetching
            behandlingsReferanse={behandlingsReferanse}
            behandlingVersjon={behandlingsVersjon}
            readOnly={saksBehandlerReadOnly}
          />
        )}
      </LovvalgOgMedlemskapVedSøknadsTidspunktOverstyringsWrapper>
    </GruppeSteg>
  );
};
