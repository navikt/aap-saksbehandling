import { TrekkSøknadMedDatafetching } from 'components/behandlinger/søknad/trekksøknad/TrekkSøknadMedDatafetching';
import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';

interface Props {
  behandlingsReferanse: string;
}

export const Søknad = async ({ behandlingsReferanse }: Props) => {
  const flyt = await hentFlyt(behandlingsReferanse);
  if (isError(flyt)) {
    return <ApiException apiResponses={[flyt]} />;
  }

  return (
    <GruppeSteg
      behandlingVersjon={flyt.data.behandlingVersjon}
      behandlingReferanse={behandlingsReferanse}
      prosessering={flyt.data.prosessering}
      visning={flyt.data.visning}
      aktivtSteg={flyt.data.aktivtSteg}
    >
      <TrekkSøknadMedDatafetching
        behandlingsreferanse={behandlingsReferanse}
        readOnly={flyt.data.visning.saksbehandlerReadOnly}
        behandlingVersjon={flyt.data.behandlingVersjon}
      />
    </GruppeSteg>
  );
};
