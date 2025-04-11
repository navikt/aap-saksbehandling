import { TrekkSøknadMedDatafetching } from 'components/behandlinger/søknad/trekksøknad/TrekkSøknadMedDatafetching';
import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';

interface Props {
  behandlingsReferanse: string;
}

export const Søknad = async ({ behandlingsReferanse }: Props) => {
  const flyt = await hentFlyt(behandlingsReferanse);
  return (
    <GruppeSteg
      behandlingVersjon={flyt.behandlingVersjon}
      behandlingReferanse={behandlingsReferanse}
      prosessering={flyt.prosessering}
      visning={flyt.visning}
      aktivtSteg={flyt.aktivtSteg}
    >
      <TrekkSøknadMedDatafetching
        behandlingsreferanse={behandlingsReferanse}
        readOnly={flyt.visning.saksbehandlerReadOnly}
        behandlingVersjon={flyt.behandlingVersjon}
      />
    </GruppeSteg>
  );
};
