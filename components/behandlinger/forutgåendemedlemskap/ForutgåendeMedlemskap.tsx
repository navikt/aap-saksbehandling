import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import {
  hentFlyt,
  hentForutgåendeMedlemskapsVurdering,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { getStegSomSkalVises } from 'lib/utils/steg';
import { ManuellVurderingForutgåendeMedlemskapMedDatafetching } from 'components/behandlinger/forutgåendemedlemskap/manuellvurderingforutgåendemedlemskap/ManuellVurderingForutgåendeMedlemskapMedDatafetching';
import { ForutgåendemedlemskapOverstyringswrapper } from 'components/behandlinger/forutgåendemedlemskap/ForutgåendemedlemskapOverstyringswrapper';
interface Props {
  behandlingsReferanse: string;
}
export const ForutgåendeMedlemskap = async ({ behandlingsReferanse }: Props) => {
  const flyt = await hentFlyt(behandlingsReferanse);
  const behandlingsVersjon = flyt.behandlingVersjon;
  const stegSomSkalVises = getStegSomSkalVises('MEDLEMSKAP', flyt);
  const saksBehandlerReadOnly = flyt.visning.saksbehandlerReadOnly;
  const automatiskVurdering = await hentForutgåendeMedlemskapsVurdering(behandlingsReferanse);
  const visOverstyrKnapp = automatiskVurdering.kanBehandlesAutomatisk && stegSomSkalVises.length === 0;
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
        readOnly={saksBehandlerReadOnly}
        automatiskVurdering={automatiskVurdering}
        stegSomSkalVises={stegSomSkalVises}
        visOverstyrKnapp={visOverstyrKnapp}
      >
        {stegSomSkalVises.includes('VURDER_MEDLEMSKAP') && (
          <ManuellVurderingForutgåendeMedlemskapMedDatafetching
            behandlingsReferanse={behandlingsReferanse}
            behandlingVersjon={behandlingsVersjon}
            readOnly={saksBehandlerReadOnly}
          />
        )}
      </ForutgåendemedlemskapOverstyringswrapper>
    </GruppeSteg>
  );
};
