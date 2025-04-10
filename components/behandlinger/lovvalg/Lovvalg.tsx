import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import {
  hentAutomatiskLovvalgOgMedlemskapVurdering,
  hentFlyt,
  hentLovvalgMedlemskapGrunnlag,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { getStegSomSkalVises } from 'lib/utils/steg';
import { LovvalgOgMedlemskapVedSøknadsTidspunktOverstyringsWrapper } from 'components/behandlinger/lovvalg/LovvalgOgMedlemskapVedSøknadsTidspunktOverstyringswrapper';
import { LovvalgOgMedlemskapVedSKnadstidspunktMedDatafetching } from 'components/behandlinger/lovvalg/lovvalgogmedlemskapvedsøknadstidspunkt/LovvalgOgMedlemskapVedSøknadstidspunktMedDatafetching';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';

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
  if (isError(vurderingAutomatisk) || isError(grunnlag)) {
    return <ApiException apiResponses={[vurderingAutomatisk, grunnlag]} />;
  }

  const stegSomSkalVises = getStegSomSkalVises('LOVVALG', flyt);

  const behandlingsVersjon = flyt.behandlingVersjon;
  const saksBehandlerReadOnly = flyt.visning.saksbehandlerReadOnly;
  const visOverstyrKnapp = vurderingAutomatisk.data.kanBehandlesAutomatisk && stegSomSkalVises.length === 0;
  const readOnly = saksBehandlerReadOnly || !grunnlag.data.harTilgangTilÅSaksbehandle;

  return (
    <GruppeSteg
      prosessering={flyt.prosessering}
      visning={flyt.visning}
      behandlingReferanse={behandlingsReferanse}
      behandlingVersjon={behandlingsVersjon}
      aktivtSteg={flyt.aktivtSteg}
    >
      <LovvalgOgMedlemskapVedSøknadsTidspunktOverstyringsWrapper
        automatiskVurdering={vurderingAutomatisk.data}
        stegSomSkalVises={stegSomSkalVises}
        behandlingsReferanse={behandlingsReferanse}
        behandlingVersjon={behandlingsVersjon}
        readOnly={readOnly}
        visOverstyrKnapp={visOverstyrKnapp}
      >
        {stegSomSkalVises.includes('VURDER_LOVVALG') && (
          <LovvalgOgMedlemskapVedSKnadstidspunktMedDatafetching
            grunnlag={grunnlag.data}
            behandlingVersjon={behandlingsVersjon}
            readOnly={readOnly}
          />
        )}
      </LovvalgOgMedlemskapVedSøknadsTidspunktOverstyringsWrapper>
    </GruppeSteg>
  );
};
