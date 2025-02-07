import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { AutomatiskVurderingMedDataFetching } from 'components/behandlinger/lovvalg/automatiskvurderingavlovvalgogmedlemskap/AutomatiskVurderingMedDataFetching';
import { LovvalgVedSøknadstidspunktMedDatafetching } from 'components/behandlinger/lovvalg/lovvalgvedsøknadstidspunkt/LovvalgVedSøknadstidspunktMedDatafetching';
import { MedlemskapVedSøknadstidspunktMedDatafetching } from 'components/behandlinger/lovvalg/medlemskapvedsøknadstidspunkt/MedlemskapVedSøknadstidspunktMedDatafetching';
interface Props {
  behandlingsReferanse: string;
  sakId: string;
}
export const Lovvalg = async ({ behandlingsReferanse }: Props) => {
  const flyt = await hentFlyt(behandlingsReferanse);
  const behandlingsVersjon = flyt.behandlingVersjon;
  const saksBehandlerReadOnly = flyt.visning.saksbehandlerReadOnly;
  return (
    <GruppeSteg
      prosessering={flyt.prosessering}
      visning={flyt.visning}
      behandlingReferanse={behandlingsReferanse}
      behandlingVersjon={behandlingsVersjon}
    >
      <AutomatiskVurderingMedDataFetching behandlingsReferanse={behandlingsReferanse} />
      <LovvalgVedSøknadstidspunktMedDatafetching
        behandlingsReferanse={behandlingsReferanse}
        behandlingVersjon={behandlingsVersjon}
        readOnly={saksBehandlerReadOnly}
      />
      <MedlemskapVedSøknadstidspunktMedDatafetching
        behandlingsReferanse={behandlingsReferanse}
        behandlingVersjon={behandlingsVersjon}
        readOnly={saksBehandlerReadOnly}
      />
    </GruppeSteg>
  );
};
