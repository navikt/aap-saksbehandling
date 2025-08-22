import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import {
  hentAutomatiskLovvalgOgMedlemskapVurdering,
  hentFlyt,
  hentLovvalgMedlemskapGrunnlag,
  hentMellomlagring,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { getStegSomSkalVises } from 'lib/utils/steg';
import { LovvalgOgMedlemskapVedSøknadsTidspunktOverstyringsWrapper } from 'components/behandlinger/lovvalg/LovvalgOgMedlemskapVedSøknadsTidspunktOverstyringswrapper';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError, isSuccess } from 'lib/utils/api';
import { Behovstype } from 'lib/utils/form';
import { LovvalgOgMedlemskapVedSKnadstidspunkt } from 'components/behandlinger/lovvalg/lovvalgogmedlemskapvedsøknadstidspunkt/LovvalgOgMedlemskapVedSøknadstidspunkt';

interface Props {
  behandlingsReferanse: string;
}
export const Lovvalg = async ({ behandlingsReferanse }: Props) => {
  const [flyt, vurderingAutomatisk, grunnlag, mellomlagring] = await Promise.all([
    hentFlyt(behandlingsReferanse),
    hentAutomatiskLovvalgOgMedlemskapVurdering(behandlingsReferanse),
    hentLovvalgMedlemskapGrunnlag(behandlingsReferanse),
    hentMellomlagring(behandlingsReferanse, Behovstype.AVKLAR_LOVVALG_MEDLEMSKAP),
  ]);

  if (isError(vurderingAutomatisk) || isError(grunnlag) || isError(flyt)) {
    return <ApiException apiResponses={[vurderingAutomatisk, grunnlag, flyt]} />;
  }

  const stegSomSkalVises = getStegSomSkalVises('LOVVALG', flyt.data);

  const behandlingsVersjon = flyt.data.behandlingVersjon;
  const saksBehandlerReadOnly = flyt.data.visning.saksbehandlerReadOnly;
  const readOnly = saksBehandlerReadOnly || !grunnlag.data.harTilgangTilÅSaksbehandle;
  const visOverstyrKnapp =
    vurderingAutomatisk.data.kanBehandlesAutomatisk && stegSomSkalVises.length === 0 && !readOnly;

  const initialMellomlagring = isSuccess(mellomlagring) ? mellomlagring.data.mellomlagretVurdering : undefined;

  return (
    <GruppeSteg
      prosessering={flyt.data.prosessering}
      visning={flyt.data.visning}
      behandlingReferanse={behandlingsReferanse}
      behandlingVersjon={behandlingsVersjon}
      aktivtSteg={flyt.data.aktivtSteg}
    >
      <LovvalgOgMedlemskapVedSøknadsTidspunktOverstyringsWrapper
        automatiskVurdering={vurderingAutomatisk.data}
        stegSomSkalVises={stegSomSkalVises}
        behandlingsReferanse={behandlingsReferanse}
        behandlingVersjon={behandlingsVersjon}
        readOnly={readOnly}
        visOverstyrKnapp={visOverstyrKnapp}
        initialMellomlagring={initialMellomlagring}
      >
        {stegSomSkalVises.includes('VURDER_LOVVALG') && (
          <LovvalgOgMedlemskapVedSKnadstidspunkt
            behandlingVersjon={behandlingsVersjon}
            grunnlag={grunnlag.data}
            readOnly={readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle}
            overstyring={!!grunnlag?.data.vurdering?.overstyrt}
            initialMellomlagretVurdering={initialMellomlagring}
          />
        )}
      </LovvalgOgMedlemskapVedSøknadsTidspunktOverstyringsWrapper>
    </GruppeSteg>
  );
};
