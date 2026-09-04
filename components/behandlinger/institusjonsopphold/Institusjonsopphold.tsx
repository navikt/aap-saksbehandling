import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { HelseinstitusjonMedDataFetching } from 'components/behandlinger/institusjonsopphold/helseinstitusjon/HelseinstitusjonMedDataFetching';
import { SoningsvurderingMedDataFetching } from './soning/SoningsvurderingMedDataFetching';
import { Behovstype } from 'lib/utils/form';
import { getStegData, skalViseStegIkkePeriodisertGrunnlag } from 'lib/utils/steg';
import { ManglendeOpphold } from 'components/behandlinger/institusjonsopphold/helseinstitusjon/ManglendeOpphold';
import { BehandlingFlytOgTilstand } from 'lib/types/types';
import {
  hentHelseInstitusjonsGrunnlagNy,
  hentSoningsvurdering,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';

interface Props {
  behandlingsreferanse: string;
  flyt: BehandlingFlytOgTilstand;
}

export const Institusjonsopphold = async ({ behandlingsreferanse, flyt }: Props) => {
  const vurderHelseinstitusjonSteg = getStegData(
    'ET_ANNET_STED',
    'DU_ER_ET_ANNET_STED',
    flyt,
    Behovstype.AVKLAR_HELSEINSTITUSJON
  );

  const vurderSoningSteg = getStegData('ET_ANNET_STED', 'DU_ER_ET_ANNET_STED', flyt, Behovstype.AVKLAR_SONINGSFORRHOLD);

  const [helseinstitusjonGrunnlag, soningGrunnlag] = await Promise.all([
    hentHelseInstitusjonsGrunnlagNy(behandlingsreferanse),
    hentSoningsvurdering(behandlingsreferanse),
  ]);

  if (isError(helseinstitusjonGrunnlag) || isError(soningGrunnlag)) {
    return <ApiException apiResponses={[helseinstitusjonGrunnlag, soningGrunnlag]} />;
  }

  const helseSkalVises = skalViseStegIkkePeriodisertGrunnlag(
    vurderHelseinstitusjonSteg.avklaringsbehov,
    helseinstitusjonGrunnlag.data.vurderinger.length > 0 || helseinstitusjonGrunnlag.data.vedtatteVurderinger.length > 0
  );
  const soningSkalVises = skalViseStegIkkePeriodisertGrunnlag(
    vurderSoningSteg.avklaringsbehov,
    soningGrunnlag.data.vurderinger.length > 0
  );

  return (
    <GruppeSteg
      prosessering={flyt.prosessering}
      visning={flyt.visning}
      behandlingReferanse={behandlingsreferanse}
      behandlingVersjon={flyt.behandlingVersjon}
      aktivtSteg={flyt.aktivtSteg}
    >
      <StegSuspense>
        <HelseinstitusjonMedDataFetching
          behandlingsreferanse={behandlingsreferanse}
          stegData={vurderHelseinstitusjonSteg}
        />
      </StegSuspense>
      <StegSuspense>
        <SoningsvurderingMedDataFetching behandlingsreferanse={behandlingsreferanse} stegData={vurderSoningSteg} />
      </StegSuspense>
      {!helseSkalVises && !soningSkalVises && (
        <StegSuspense>
          <ManglendeOpphold />
        </StegSuspense>
      )}
    </GruppeSteg>
  );
};
