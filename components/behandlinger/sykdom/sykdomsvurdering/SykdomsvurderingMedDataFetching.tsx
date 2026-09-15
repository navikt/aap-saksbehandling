import {
  hentBehandling,
  hentMellomlagring,
  hentStudentGrunnlag,
  hentSykdomsGrunnlag,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import {
  finnDiagnoseGrunnlagForSykdom,
  getDefaultOptionsForDiagnosesystem,
} from 'components/behandlinger/sykdom/sykdomsvurdering/diagnoseUtil';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';
import { Behovstype } from 'lib/utils/form';
import { skalViseStegForPeriodisertGrunnlag, StegData } from 'lib/utils/steg';
import { Sykdomsvurdering } from 'components/behandlinger/sykdom/sykdomsvurdering/Sykdomsvurdering';

interface Props {
  behandlingsreferanse: string;
  stegData: StegData;
  skalViseAlleSykdomsSteg: boolean;
}

export const SykdomsvurderingMedDataFetching = async ({
  behandlingsreferanse,
  stegData,
  skalViseAlleSykdomsSteg,
}: Props) => {
  const [grunnlag, behandling, studentgrunnlag] = await Promise.all([
    hentSykdomsGrunnlag(behandlingsreferanse),
    hentBehandling(behandlingsreferanse),
    hentStudentGrunnlag(behandlingsreferanse),
  ]);

  if (isError(grunnlag) || isError(studentgrunnlag) || isError(behandling)) {
    return <ApiException apiResponses={[grunnlag, studentgrunnlag, behandling]} />;
  }

  if (!skalViseStegForPeriodisertGrunnlag(stegData.avklaringsbehov, grunnlag.data)) {
    return null;
  }

  const typeBehandling = stegData.typeBehandling;
  const totalReadOnly = stegData.readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle;
  const initialMellomlagretVurdering = await hentMellomlagring(
    behandlingsreferanse,
    Behovstype.AVKLAR_SYKDOM_KODE,
    totalReadOnly,
    stegData.erIkkePåVent
  );

  const diagnoseDefaultOptions = await getDefaultOptionsForDiagnosesystem(finnDiagnoseGrunnlagForSykdom(grunnlag.data));

  const vurderingsbehov = behandling.data.vurderingsbehovOgÅrsaker.flatMap(
    (behovOgÅrsak) => behovOgÅrsak.vurderingsbehov
  );

  const erOvergangArbeid = vurderingsbehov.some((x) => x.type === 'OVERGANG_ARBEID');
  const erRevurderingStudent = vurderingsbehov.some((x) => x.type === 'REVURDER_STUDENT') && !stegData.readOnly;

  return (
    <Sykdomsvurdering
      grunnlag={grunnlag.data}
      readOnly={stegData.readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle}
      behandlingVersjon={stegData.behandlingVersjon}
      diagnoseDefaultOptions={diagnoseDefaultOptions}
      typeBehandling={typeBehandling}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
      erOvergangArbeid={erOvergangArbeid}
      erRevurderingStudent={erRevurderingStudent}
      studentgrunnlag={studentgrunnlag.data}
      skalViseAlleSykdomSteg={skalViseAlleSykdomsSteg}
    />
  );
};
