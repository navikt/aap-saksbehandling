import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { AutomatiskVurderingMedDataFetching } from 'components/behandlinger/lovvalg/automatiskvurderingavlovvalgogmedlemskap/AutomatiskVurderingMedDataFetching';
import { LovvalgOgMedlemskapVedSKnadstidspunktMedDatafetching } from 'components/behandlinger/lovvalg/lovvalgogmedlemskapvedsøknadstidspunkt/LovvalgOgMedlemskapVedSøknadstidspunktMedDatafetching';
import { getStegSomSkalVises } from 'lib/utils/steg';
interface Props {
  behandlingsReferanse: string;
  sakId: string;
}
export const Lovvalg = async ({ behandlingsReferanse }: Props) => {
  const flyt = await hentFlyt(behandlingsReferanse);
  const behandlingsVersjon = flyt.behandlingVersjon;
  const stegSomSkalVises = getStegSomSkalVises('LOVVALG', flyt);
  const saksBehandlerReadOnly = flyt.visning.saksbehandlerReadOnly;
  return (
    <GruppeSteg
      prosessering={flyt.prosessering}
      visning={flyt.visning}
      behandlingReferanse={behandlingsReferanse}
      behandlingVersjon={behandlingsVersjon}
    >
      <AutomatiskVurderingMedDataFetching behandlingsReferanse={behandlingsReferanse} />
      {stegSomSkalVises.includes('VURDER_LOVVALG') && (
        <LovvalgOgMedlemskapVedSKnadstidspunktMedDatafetching
          behandlingsReferanse={behandlingsReferanse}
          behandlingVersjon={behandlingsVersjon}
          readOnly={saksBehandlerReadOnly}
        />
      )}
    </GruppeSteg>
  );
};
