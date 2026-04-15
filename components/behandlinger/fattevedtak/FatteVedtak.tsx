import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { getStegSomSkalVises } from 'lib/utils/steg';
import { FatteVedtakMedDataFetching } from 'components/behandlinger/fattevedtak/fattevedtak/FatteVedtakMedDataFetching';
import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';

interface Props {
  behandlingsreferanse: string;
}

export const FatteVedtak = async ({ behandlingsreferanse }: Props) => {
  const flytResponse = await hentFlyt(behandlingsreferanse);
  if (isError(flytResponse)) {
    return <ApiException apiResponses={[flytResponse]} />;
  }

  const stegSomSkalVises = getStegSomSkalVises('FATTE_VEDTAK', flytResponse.data);

  return (
    <GruppeSteg
      behandlingVersjon={flytResponse.data.behandlingVersjon}
      behandlingReferanse={behandlingsreferanse}
      prosessering={flytResponse.data.prosessering}
      visning={flytResponse.data.visning}
      aktivtSteg={flytResponse.data.aktivtSteg}
    >
      {stegSomSkalVises.includes('FATTE_VEDTAK') && (
        <StegSuspense>
          <FatteVedtakMedDataFetching behandlingsreferanse={behandlingsreferanse} />
        </StegSuspense>
      )}
    </GruppeSteg>
  );
};
