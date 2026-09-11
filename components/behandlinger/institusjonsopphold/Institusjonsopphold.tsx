import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { HelseinstitusjonMedDataFetching } from 'components/behandlinger/institusjonsopphold/helseinstitusjon/HelseinstitusjonMedDataFetching';
import { SoningsvurderingMedDataFetching } from 'components/behandlinger/institusjonsopphold/soning/SoningsvurderingMedDataFetching';
import { Behovstype } from 'lib/utils/form';
import { getStegData, skalViseStegIkkePeriodisertGrunnlag } from 'lib/utils/steg';
import { ManglendeOpphold } from 'components/behandlinger/institusjonsopphold/helseinstitusjon/ManglendeOpphold';
import { Avklaringsbehov, BehandlingFlytOgTilstand, HelseinstitusjonGrunnlag, Soningsgrunnlag } from 'lib/types/types';
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

/**
 * Skal vise helseinstitusjon-steget dersom avklaringsbehovet tilsier det, og det faktisk
 * finnes grunnlagsdata (opphold eller vurderinger) å vise fram. Uten den siste sjekken kan
 * steget bli "tomt" selv om avklaringsbehovet i seg selv tilsier at det skal vises.
 */
const skalViseHelseinstitusjon = (avklaringsbehov: Array<Avklaringsbehov>, grunnlag: HelseinstitusjonGrunnlag) => {
  const harVurdering = grunnlag.vurderinger.length > 0 || grunnlag.vedtatteVurderinger.length > 0;
  const harGrunnlagsdata = grunnlag.opphold.length > 0 || harVurdering;
  return harGrunnlagsdata && skalViseStegIkkePeriodisertGrunnlag(avklaringsbehov, harVurdering);
};

/**
 * Skal vise soning-steget dersom avklaringsbehovet tilsier det, og det faktisk finnes
 * soningsforhold å vise fram.
 */
const skalViseSoningsvurdering = (avklaringsbehov: Array<Avklaringsbehov>, grunnlag: Soningsgrunnlag) => {
  const harVurdering = grunnlag.vurderinger.length > 0;
  return grunnlag.soningsforhold.length > 0 && skalViseStegIkkePeriodisertGrunnlag(avklaringsbehov, harVurdering);
};

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

  const helseSkalVises = skalViseHelseinstitusjon(
    vurderHelseinstitusjonSteg.avklaringsbehov,
    helseinstitusjonGrunnlag.data
  );
  const soningSkalVises = skalViseSoningsvurdering(vurderSoningSteg.avklaringsbehov, soningGrunnlag.data);

  return (
    <GruppeSteg
      prosessering={flyt.prosessering}
      visning={flyt.visning}
      behandlingReferanse={behandlingsreferanse}
      behandlingVersjon={flyt.behandlingVersjon}
      aktivtSteg={flyt.aktivtSteg}
    >
      {helseSkalVises && (
        <StegSuspense>
          <HelseinstitusjonMedDataFetching
            behandlingsreferanse={behandlingsreferanse}
            stegData={vurderHelseinstitusjonSteg}
            grunnlag={helseinstitusjonGrunnlag.data}
          />
        </StegSuspense>
      )}
      {soningSkalVises && (
        <StegSuspense>
          <SoningsvurderingMedDataFetching
            behandlingsreferanse={behandlingsreferanse}
            stegData={vurderSoningSteg}
            grunnlag={soningGrunnlag.data}
          />
        </StegSuspense>
      )}
      {!helseSkalVises && !soningSkalVises && (
        <StegSuspense>
          <ManglendeOpphold />
        </StegSuspense>
      )}
    </GruppeSteg>
  );
};
