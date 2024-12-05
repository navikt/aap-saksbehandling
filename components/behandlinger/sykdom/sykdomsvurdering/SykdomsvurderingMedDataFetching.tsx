import { Sykdomsvurdering } from 'components/behandlinger/sykdom/sykdomsvurdering/Sykdomsvurdering';
import { hentAlleDokumenterPåSak, hentSykdomsGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { DokumentInfo, SykdomsGrunnlag } from 'lib/types/types';
import { ValuePair } from '@navikt/aap-felles-react';
import { DiagnoseSystem, diagnoseSøker } from 'lib/diagnosesøker/DiagnoseSøker';
import { uniqBy } from 'lodash';

interface Props {
  saksId: string;
  behandlingsReferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
}

export interface SykdomProps {
  behandlingVersjon: number;
  grunnlag: SykdomsGrunnlag;
  readOnly: boolean;
  tilknyttedeDokumenter: DokumentInfo[];
  bidiagnoserDeafultOptions?: ValuePair[];
  hoveddiagnoseDefaultOptions?: ValuePair[];
}

export const SykdomsvurderingMedDataFetching = async ({
  behandlingsReferanse,
  behandlingVersjon,
  readOnly,
  saksId,
}: Props) => {
  const [grunnlag, tilknyttedeDokumenter] = await Promise.all([
    hentSykdomsGrunnlag(behandlingsReferanse),
    hentAlleDokumenterPåSak(saksId),
  ]);

  const bidiagnoserDefaultOptions = await getDefaultOptions(
    grunnlag.sykdomsvurdering?.bidiagnoser,
    grunnlag.sykdomsvurdering?.kodeverk as DiagnoseSystem
  );

  const hovedDiagnoseDefaultOptions = await getDefaultOptions(
    grunnlag.sykdomsvurdering?.hoveddiagnose,
    grunnlag.sykdomsvurdering?.kodeverk as DiagnoseSystem
  );

  return (
    <Sykdomsvurdering
      grunnlag={grunnlag}
      readOnly={readOnly}
      behandlingVersjon={behandlingVersjon}
      tilknyttedeDokumenter={tilknyttedeDokumenter}
      bidiagnoserDeafultOptions={bidiagnoserDefaultOptions}
      hoveddiagnoseDefaultOptions={hovedDiagnoseDefaultOptions}
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
