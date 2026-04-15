import { hentMellomlagring, hentSykdomsGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import {
  finnDiagnoseGrunnlagForSykdom,
  getDefaultOptionsForDiagnosesystem,
} from 'components/behandlinger/sykdom/sykdomsvurdering/diagnoseUtil';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';
import { Behovstype } from 'lib/utils/form';
import { skalViseSteg, StegData } from 'lib/utils/steg';
import { Sykdomsvurdering } from 'components/behandlinger/sykdom/sykdomsvurdering/Sykdomsvurdering';

interface Props {
  behandlingsreferanse: string;
  stegData: StegData;
}

export const SykdomsvurderingMedDataFetching = async ({ behandlingsreferanse, stegData }: Props) => {
  const [grunnlag, initialMellomlagretVurdering] = await Promise.all([
    hentSykdomsGrunnlag(behandlingsreferanse),
    hentMellomlagring(behandlingsreferanse, Behovstype.AVKLAR_SYKDOM_KODE),
  ]);
  const typeBehandling = stegData.typeBehandling;

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  const diagnoseDefaultOptions = await getDefaultOptionsForDiagnosesystem(finnDiagnoseGrunnlagForSykdom(grunnlag.data));

  const harTidligereVurderinger =
    grunnlag.data.sisteVedtatteVurderinger != null && grunnlag.data.sisteVedtatteVurderinger.length > 0;

  if (!skalViseSteg(stegData, harTidligereVurderinger)) {
    return null;
  }

  return (
    <Sykdomsvurdering
      grunnlag={grunnlag.data}
      readOnly={stegData.readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle}
      behandlingVersjon={stegData.behandlingVersjon}
      diagnoseDefaultOptions={diagnoseDefaultOptions}
      typeBehandling={typeBehandling}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  );
};
