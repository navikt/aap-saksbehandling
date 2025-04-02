import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import {
  hentAutomatiskLovvalgOgMedlemskapVurdering,
  hentFlyt,
  hentLovvalgMedlemskapGrunnlag,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { getStegSomSkalVises } from 'lib/utils/steg';
import { LovvalgOgMedlemskapVedSøknadsTidspunktOverstyringsWrapper } from 'components/behandlinger/lovvalg/LovvalgOgMedlemskapVedSøknadsTidspunktOverstyringswrapper';
import { LovvalgOgMedlemskapVedSKnadstidspunktMedDatafetching } from 'components/behandlinger/lovvalg/lovvalgogmedlemskapvedsøknadstidspunkt/LovvalgOgMedlemskapVedSøknadstidspunktMedDatafetching';

interface Props {
  behandlingsReferanse: string;
  sakId: string;
}
export const Lovvalg = async ({ behandlingsReferanse }: Props) => {
  const [flyt, vurderingAutomatisk, grunnlag] = await Promise.all([
    hentFlyt(behandlingsReferanse),
    hentAutomatiskLovvalgOgMedlemskapVurdering(behandlingsReferanse),
    hentLovvalgMedlemskapGrunnlag(behandlingsReferanse),
  ]);

  const stegSomSkalVises = getStegSomSkalVises('LOVVALG', flyt);

  const behandlingsVersjon = flyt.behandlingVersjon;
  const saksBehandlerReadOnly = flyt.visning.saksbehandlerReadOnly;
  const visOverstyrKnapp = vurderingAutomatisk.kanBehandlesAutomatisk && stegSomSkalVises.length === 0;
  const readOnly = saksBehandlerReadOnly || !grunnlag.harTilgangTilÅSaksbehandle;

  return (
    <GruppeSteg
      prosessering={flyt.prosessering}
      visning={flyt.visning}
      behandlingReferanse={behandlingsReferanse}
      behandlingVersjon={behandlingsVersjon}
      aktivtSteg={flyt.aktivtSteg}
    >
      <LovvalgOgMedlemskapVedSøknadsTidspunktOverstyringsWrapper
        automatiskVurdering={vurderingAutomatisk}
        stegSomSkalVises={stegSomSkalVises}
        behandlingsReferanse={behandlingsReferanse}
        behandlingVersjon={behandlingsVersjon}
        readOnly={readOnly}
        visOverstyrKnapp={visOverstyrKnapp}
      >
        {stegSomSkalVises.includes('VURDER_LOVVALG') && (
          <LovvalgOgMedlemskapVedSKnadstidspunktMedDatafetching
            grunnlag={grunnlag}
            behandlingVersjon={behandlingsVersjon}
            readOnly={readOnly}
          />
        )}
      </LovvalgOgMedlemskapVedSøknadsTidspunktOverstyringsWrapper>
    </GruppeSteg>
  );
};
