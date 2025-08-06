import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';
import { hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { AvklarOppfolgingVurderingMedDataFetching } from './AvklarOppfolgingVurderingMedDataFetching';

type Props = {
  behandlingsreferanse: string;
};

export const AvklarOppfolgingsSteg = async ({ behandlingsreferanse }: Props) => {
  const flyt = await hentFlyt(behandlingsreferanse);

  if (isError(flyt)) {
    return <ApiException apiResponses={[flyt]} />;
  }

  return (
    <GruppeSteg
      prosessering={flyt.data.prosessering}
      visning={flyt.data.visning}
      behandlingReferanse={behandlingsreferanse}
      behandlingVersjon={flyt.data.behandlingVersjon}
      aktivtSteg={flyt.data.aktivtSteg}
    >
      <AvklarOppfolgingVurderingMedDataFetching
        behandlingsReferanse={behandlingsreferanse}
        behandlingVersjon={flyt.data.behandlingVersjon}
        readOnly={flyt.data.visning.saksbehandlerReadOnly}
      />
    </GruppeSteg>
  );
};
