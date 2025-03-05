import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import {
  hentAutomatiskLovvalgOgMedlemskapVurdering,
  hentFlyt,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { getStegSomSkalVises } from 'lib/utils/steg';
import { LovvalgOgMedlemskapVedSøknadsTidspunktOverstyringsWrapper } from 'components/behandlinger/lovvalg/LovvalgOgMedlemskapVedSøknadsTidspunktOverstyringswrapper';
import { LovvalgOgMedlemskapVedSKnadstidspunktMedDatafetching } from 'components/behandlinger/lovvalg/lovvalgogmedlemskapvedsøknadstidspunkt/LovvalgOgMedlemskapVedSøknadstidspunktMedDatafetching';
interface Props {
  behandlingsReferanse: string;
  sakId: string;
}
export const Lovvalg = async ({ behandlingsReferanse }: Props) => {
  const flyt = await hentFlyt(behandlingsReferanse);
  const behandlingsVersjon = flyt.behandlingVersjon;
  const stegSomSkalVises = getStegSomSkalVises('LOVVALG', flyt);
  const saksBehandlerReadOnly = flyt.visning.saksbehandlerReadOnly;
  const vurderingAutomatisk = await hentAutomatiskLovvalgOgMedlemskapVurdering(behandlingsReferanse);
  const visOverstyrKnapp = vurderingAutomatisk.kanBehandlesAutomatisk && stegSomSkalVises.length === 0;

  return (
    <GruppeSteg
      prosessering={flyt.prosessering}
      visning={flyt.visning}
      behandlingReferanse={behandlingsReferanse}
      behandlingVersjon={behandlingsVersjon}
    >
      <LovvalgOgMedlemskapVedSøknadsTidspunktOverstyringsWrapper
        automatiskVurdering={vurderingAutomatisk}
        stegSomSkalVises={stegSomSkalVises}
        behandlingsReferanse={behandlingsReferanse}
        behandlingVersjon={behandlingsVersjon}
        readOnly={saksBehandlerReadOnly}
        visOverstyrKnapp={visOverstyrKnapp}
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
