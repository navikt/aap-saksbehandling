import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { OppholdskravStegMedDataFatching } from 'components/behandlinger/oppholdskrav/OppholdskravStegMedDataFatching';

interface Props {
  behandlingsreferanse: string;
}

export const OppholdskravStegGruppe = async ({ behandlingsreferanse }: Props) => {
  const flyt = await hentFlyt(behandlingsreferanse);
  if (isError(flyt)) {
    return <ApiException apiResponses={[flyt]} />;
  }

  return (
    <GruppeSteg
      behandlingVersjon={flyt.data.behandlingVersjon}
      behandlingReferanse={behandlingsreferanse}
      prosessering={flyt.data.prosessering}
      visning={flyt.data.visning}
      aktivtSteg={flyt.data.aktivtSteg}
    >
      <StegSuspense>
        <OppholdskravStegMedDataFatching
          behandlingsreferanse={behandlingsreferanse}
          behandlingVersjon={flyt.data.behandlingVersjon}
          readOnly={flyt.data.visning.saksbehandlerReadOnly}
        />
      </StegSuspense>
    </GruppeSteg>
  );
};
