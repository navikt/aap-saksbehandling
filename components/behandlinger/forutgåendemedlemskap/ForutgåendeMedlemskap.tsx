import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import {
  hentFlyt,
  hentForutgåendeMedlemskapGrunnlag,
  hentForutgåendeMedlemskapsVurdering,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { getStegSomSkalVises } from 'lib/utils/steg';
import { ManuellVurderingForutgåendeMedlemskapMedDatafetching } from 'components/behandlinger/forutgåendemedlemskap/manuellvurderingforutgåendemedlemskap/ManuellVurderingForutgåendeMedlemskapMedDatafetching';
import { ForutgåendemedlemskapOverstyringswrapper } from 'components/behandlinger/forutgåendemedlemskap/ForutgåendemedlemskapOverstyringswrapper';
interface Props {
  behandlingsReferanse: string;
}
export const ForutgåendeMedlemskap = async ({ behandlingsReferanse }: Props) => {
  const [flyt, grunnlag, automatiskVurdering] = await Promise.all([
    hentFlyt(behandlingsReferanse),
    hentForutgåendeMedlemskapGrunnlag(behandlingsReferanse),
    hentForutgåendeMedlemskapsVurdering(behandlingsReferanse),
  ]);

  const stegSomSkalVises = getStegSomSkalVises('MEDLEMSKAP', flyt);

  const behandlingsVersjon = flyt.behandlingVersjon;
  const saksBehandlerReadOnly = flyt.visning.saksbehandlerReadOnly;
  const visOverstyrKnapp = automatiskVurdering.kanBehandlesAutomatisk && stegSomSkalVises.length === 0;

  const readOnly = saksBehandlerReadOnly || !grunnlag.harTilgangTilÅSaksbehandle;

  return (
    <GruppeSteg
      prosessering={flyt.prosessering}
      visning={flyt.visning}
      behandlingReferanse={behandlingsReferanse}
      behandlingVersjon={behandlingsVersjon}
    >
      <ForutgåendemedlemskapOverstyringswrapper
        behandlingsReferanse={behandlingsReferanse}
        behandlingVersjon={behandlingsVersjon}
        readOnly={readOnly}
        automatiskVurdering={automatiskVurdering}
        stegSomSkalVises={stegSomSkalVises}
        visOverstyrKnapp={visOverstyrKnapp}
      >
        {stegSomSkalVises.includes('VURDER_MEDLEMSKAP') && (
          <ManuellVurderingForutgåendeMedlemskapMedDatafetching
            grunnlag={grunnlag}
            behandlingVersjon={behandlingsVersjon}
            readOnly={readOnly}
          />
        )}
      </ForutgåendemedlemskapOverstyringswrapper>
    </GruppeSteg>
  );
};
