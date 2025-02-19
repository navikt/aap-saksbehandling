import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { AutomatiskVurderingForutgåendeMedlemskapMedDataFetching } from 'components/behandlinger/forutgåendemedlemskap/automatiskvurderingforutgåendemedlemskap/AutomatiskVurderingForutgåendeMedlemskapMedDataFetching';
import {getStegSomSkalVises} from "lib/utils/steg";
import {
  ManuellVurderingForutgåendeMedlemskapMedDatafetching
} from "components/behandlinger/forutgåendemedlemskap/manuellvurderingforutgåendemedlemskap/ManuellVurderingForutgåendeMedlemskapMedDatafetching";
interface Props {
  behandlingsReferanse: string;
}
export const ForutgåendeMedlemskap = async ({ behandlingsReferanse }: Props) => {
  const flyt = await hentFlyt(behandlingsReferanse);
  const behandlingsVersjon = flyt.behandlingVersjon;
  const stegSomSkalVises = getStegSomSkalVises('MEDLEMSKAP', flyt);
  const saksBehandlerReadOnly = flyt.visning.saksbehandlerReadOnly;
  return (
    <GruppeSteg
      prosessering={flyt.prosessering}
      visning={flyt.visning}
      behandlingReferanse={behandlingsReferanse}
      behandlingVersjon={behandlingsVersjon}
    >
      <AutomatiskVurderingForutgåendeMedlemskapMedDataFetching behandlingsReferanse={behandlingsReferanse} />
      {stegSomSkalVises.includes('VURDER_MEDLEMSKAP') && (
        <ManuellVurderingForutgåendeMedlemskapMedDatafetching
          behandlingsReferanse={behandlingsReferanse}
          behandlingVersjon={behandlingsVersjon}
          readOnly={saksBehandlerReadOnly}
        />
      )}
    </GruppeSteg>
  );
};
