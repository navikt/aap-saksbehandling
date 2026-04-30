import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { VedtakslengdeMedDataFetching } from 'components/behandlinger/vedtakslengde/VedtakslengdeMedDataFetching';
import { ForeslåVedtakVedtakslengdeMedDataFetching } from 'components/behandlinger/vedtakslengde/foreslåvedtakvedtakslengde/ForeslåVedtakVedtakslengdeMedDataFetching';

interface Props {
  behandlingsreferanse: string;
}

export const Vedtakslengde = async ({ behandlingsreferanse }: Props) => {
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
        <VedtakslengdeMedDataFetching
          behandlingsreferanse={behandlingsreferanse}
          behandlingVersjon={flyt.data.behandlingVersjon}
          readOnly={flyt.data.visning.saksbehandlerReadOnly}
        />
      </StegSuspense>
      <StegSuspense>
        <ForeslåVedtakVedtakslengdeMedDataFetching
          behandlingsreferanse={behandlingsreferanse}
          behandlingVersjon={flyt.data.behandlingVersjon}
          readonly={flyt.data.visning.saksbehandlerReadOnly}
        />
      </StegSuspense>
    </GruppeSteg>
  );
};
