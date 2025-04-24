import { Sykdomsvurdering } from 'components/behandlinger/sykdom/sykdomsvurdering/Sykdomsvurdering';
import { hentSykdomsGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { DiagnoseSystem, diagnoseSøker } from 'lib/diagnosesøker/DiagnoseSøker';
import { uniqBy } from 'lodash';
import { finnDiagnosegrunnlag } from 'components/behandlinger/sykdom/sykdomsvurdering/diagnoseUtil';
import { TypeBehandling } from 'lib/types/types';
import { ValuePair } from 'components/form/FormField';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';

interface Props {
  behandlingsReferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
  erAktivtSteg: boolean;
  typeBehandling: TypeBehandling;
}

export const SykdomsvurderingMedDataFetching = async ({
  behandlingsReferanse,
  behandlingVersjon,
  readOnly,
  erAktivtSteg,
  typeBehandling,
}: Props) => {
  const grunnlag = await hentSykdomsGrunnlag(behandlingsReferanse);
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

  return (
    <Sykdomsvurdering
      grunnlag={grunnlag.data}
      readOnly={readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle}
      behandlingVersjon={behandlingVersjon}
      bidiagnoserDeafultOptions={bidiagnoserDefaultOptions}
      hoveddiagnoseDefaultOptions={hovedDiagnoseDefaultOptions}
      typeBehandling={typeBehandling}
      erAktivtSteg={erAktivtSteg}
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
