import { Sykdomsvurdering } from 'components/behandlinger/sykdom/sykdomsvurdering/Sykdomsvurdering';
import { hentSak, hentSykdomsGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { DiagnoseSystem, diagnoseSøker } from 'lib/diagnosesøker/DiagnoseSøker';
import { uniqBy } from 'lodash';
import { finnDiagnosegrunnlag } from 'components/behandlinger/sykdom/sykdomsvurdering/diagnoseUtil';
import { TypeBehandling } from 'lib/types/types';
import { ValuePair } from 'components/form/FormField';

interface Props {
  saksId: string;
  behandlingsReferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
  typeBehandling: TypeBehandling;
}

export const SykdomsvurderingMedDataFetching = async ({
  behandlingsReferanse,
  behandlingVersjon,
  readOnly,
  saksId,
  typeBehandling,
}: Props) => {
  const [grunnlag, sak] = await Promise.all([hentSykdomsGrunnlag(behandlingsReferanse), hentSak(saksId)]);

  const bidiagnoserDefaultOptions = await getDefaultOptions(
    finnDiagnosegrunnlag(typeBehandling, grunnlag)?.bidiagnoser,
    finnDiagnosegrunnlag(typeBehandling, grunnlag)?.kodeverk as DiagnoseSystem
  );

  const hovedDiagnoseDefaultOptions = await getDefaultOptions(
    finnDiagnosegrunnlag(typeBehandling, grunnlag)?.hoveddiagnose,
    finnDiagnosegrunnlag(typeBehandling, grunnlag)?.kodeverk as DiagnoseSystem
  );

  return (
    <Sykdomsvurdering
      grunnlag={grunnlag}
      readOnly={readOnly}
      behandlingVersjon={behandlingVersjon}
      bidiagnoserDeafultOptions={bidiagnoserDefaultOptions}
      hoveddiagnoseDefaultOptions={hovedDiagnoseDefaultOptions}
      søknadstidspunkt={sak.opprettetTidspunkt} // er dette det samme som søknadstidspunkt, eller kan det være noe annet
      typeBehandling={typeBehandling}
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
