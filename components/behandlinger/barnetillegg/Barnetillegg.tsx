import { hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { BarnetilleggVurderingMedDataFetching } from 'components/behandlinger/barnetillegg/barnetilleggvurdering/BarnetilleggVurderingMedDataFetching';
import { OldBarnetilleggVurderingMedDataFetching } from 'components/behandlinger/barnetillegg/old-barnetilleggvurdering/OldBarnetilleggVurderingMedDataFetching';
import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { getStegData } from 'lib/utils/steg';
import { isProd } from 'lib/utils/environment';

interface Props {
  behandlingsreferanse: string;
}

export const Barnetillegg = async ({ behandlingsreferanse }: Props) => {
  const flyt = await hentFlyt(behandlingsreferanse);
  if (isError(flyt)) {
    return <ApiException apiResponses={[flyt]} />;
  }

  const barnetilleggSteg = getStegData('BARNETILLEGG', 'BARNETILLEGG', flyt.data);

  return (
    <GruppeSteg
      prosessering={flyt.data.prosessering}
      visning={flyt.data.visning}
      behandlingReferanse={behandlingsreferanse}
      behandlingVersjon={flyt.data.behandlingVersjon}
      aktivtSteg={flyt.data.aktivtSteg}
    >
      <StegSuspense>
        {isProd() ? (
          <OldBarnetilleggVurderingMedDataFetching
            behandlingsreferanse={behandlingsreferanse}
            stegData={barnetilleggSteg}
          />
        ) : (
          <BarnetilleggVurderingMedDataFetching
            behandlingsreferanse={behandlingsreferanse}
            stegData={barnetilleggSteg}
          />
        )}
      </StegSuspense>
    </GruppeSteg>
  );
};
