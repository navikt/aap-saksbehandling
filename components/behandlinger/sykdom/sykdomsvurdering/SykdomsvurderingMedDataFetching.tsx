import { Sykdomsvurdering } from 'components/behandlinger/sykdom/sykdomsvurdering/Sykdomsvurdering';
import {
  hentAlleDokumenterPåSak,
  hentSak,
  hentSykdomsGrunnlag,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { ValuePair } from '@navikt/aap-felles-react';
import { DiagnoseSystem, diagnoseSøker } from 'lib/diagnosesøker/DiagnoseSøker';
import { uniqBy } from 'lodash';
import { finnDiagnosegrunnlag } from 'components/behandlinger/sykdom/sykdomsvurdering/diagnoseUtil';

export type TypeBehandling = 'Førstegangsbehandling' | 'Revurdering' | 'Tilbakekreving' | 'Klage';

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
  const [grunnlag, tilknyttedeDokumenter, sak] = await Promise.all([
    hentSykdomsGrunnlag(behandlingsReferanse),
    hentAlleDokumenterPåSak(saksId),
    hentSak(saksId),
  ]);

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
      tilknyttedeDokumenter={tilknyttedeDokumenter}
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
