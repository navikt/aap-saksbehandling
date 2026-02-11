import { hentMellomlagring, hentSykdomsGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { DiagnoseSystem, diagnoseSøker } from 'lib/diagnosesøker/DiagnoseSøker';
import { uniqBy } from 'lodash';
import { finnDiagnosegrunnlag } from 'components/behandlinger/sykdom/sykdomsvurdering/diagnoseUtil';
import { ValuePair } from 'components/form/FormField';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';
import { Behovstype } from 'lib/utils/form';
import { skalViseSteg, StegData } from 'lib/utils/steg';
import { Sykdomsvurdering } from 'components/behandlinger/sykdom/sykdomsvurdering/Sykdomsvurdering';

interface Props {
  behandlingsReferanse: string;
  stegData: StegData;
}

export const SykdomsvurderingMedDataFetching = async ({ behandlingsReferanse, stegData }: Props) => {
  const [grunnlag, initialMellomlagretVurdering] = await Promise.all([
    hentSykdomsGrunnlag(behandlingsReferanse),
    hentMellomlagring(behandlingsReferanse, Behovstype.AVKLAR_SYKDOM_KODE),
  ]);
  const typeBehandling = stegData.typeBehandling;

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  const bidiagnoserDefaultOptions = await getDefaultOptions(
    finnDiagnosegrunnlag(typeBehandling, grunnlag.data)?.bidiagnoser,
    finnDiagnosegrunnlag(typeBehandling, grunnlag.data)?.kodeverk as DiagnoseSystem
  );

  const hovedDiagnoseDefaultOptions = await getDefaultOptions(
    finnDiagnosegrunnlag(typeBehandling, grunnlag.data)?.hoveddiagnose,
    finnDiagnosegrunnlag(typeBehandling, grunnlag.data)?.kodeverk as DiagnoseSystem
  );

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
      bidiagnoserDeafultOptions={bidiagnoserDefaultOptions}
      hoveddiagnoseDefaultOptions={hovedDiagnoseDefaultOptions}
      typeBehandling={typeBehandling}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  );
};

async function getDefaultOptions(
  defaultValue?: string[] | string | null,
  kodeverk?: DiagnoseSystem
): Promise<ValuePair[] | undefined> {
  const defaultOptions: ValuePair[] = [];
  if (kodeverk && defaultValue) {
    if (Array.isArray(defaultValue)) {
      defaultValue.forEach((value) => {
        const options = diagnoseSøker(kodeverk, value);
        if (options) {
          defaultOptions.push(...diagnoseSøker(kodeverk, value));
        }
      });
    } else {
      defaultOptions.push(...diagnoseSøker(kodeverk, defaultValue));
    }
    const ekstraOptions = diagnoseSøker(kodeverk, '');

    return uniqBy([...defaultOptions, ...ekstraOptions], 'value');
  }

  return undefined;
}
