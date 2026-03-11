import { hentMellomlagring, hentSykdomsGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { DiagnoseSystem, diagnoseSøker } from 'lib/diagnosesøker/DiagnoseSøker';
import { uniqBy } from 'lodash';
import {
  Diagnoser,
  finnDiagnoseGrunnlagForBiDiagnose,
  finnDiagnoseGrunnlagForHovedDiagnose,
} from 'components/behandlinger/sykdom/sykdomsvurdering/diagnoseUtil';
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

  const hovedDiagnoseDefaultOptions = await getDefaultOptions2(finnDiagnoseGrunnlagForHovedDiagnose(grunnlag.data));
  const bidiagnoserDefaultOptions = await getDefaultOptions2(finnDiagnoseGrunnlagForBiDiagnose(grunnlag.data));

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

export interface DiagnoserDefaultOptions {
  ICPC2: {
    hoveddiagnoserOptions: ValuePair[];
    bidiagnoserOptions: ValuePair[];
  };
  ICD10: {
    hoveddiagnoserOptions: ValuePair[];
    bidiagnoserOptions: ValuePair[];
  };
}

export async function getDefaultOptions2(defaultValue?: Diagnoser[]): Promise<DiagnoserDefaultOptions | undefined> {
  if (!defaultValue) return undefined;

  const icpc2HoveddiagnoserOptions: ValuePair[] = [];
  const icpc2BidiagnoserOptions: ValuePair[] = [];

  const icd10HoveddiagnoserOptions: ValuePair[] = [];
  const icd10BidiagnoserOptions: ValuePair[] = [];

  defaultValue.forEach((value) => {
    if (value.type === 'HOVEDDIAGNOSE') {
      const options = diagnoseSøker(value.kodeverk as DiagnoseSystem, value.diagnose);
      if (value.kodeverk === 'ICPC2') {
        icpc2HoveddiagnoserOptions.push(...options);
      } else {
        icd10HoveddiagnoserOptions.push(...options);
      }
    }

    if (value.type === 'BIDIAGNOSE') {
      value.diagnose.forEach((biDiagnose) => {
        const options = diagnoseSøker(value.kodeverk as DiagnoseSystem, biDiagnose);
        if (value.kodeverk === 'ICPC2') {
          icpc2BidiagnoserOptions.push(...options);
        } else {
          icd10BidiagnoserOptions.push(...options);
        }
      });
    }
  });

  const ekstraOptionsICPC2 = diagnoseSøker('ICPC2', '');
  const ekstraOptionsICD10 = diagnoseSøker('ICD10', '');

  icpc2HoveddiagnoserOptions.push(...ekstraOptionsICPC2);
  icpc2BidiagnoserOptions.push(...ekstraOptionsICPC2);

  icd10HoveddiagnoserOptions.push(...ekstraOptionsICD10);
  icd10BidiagnoserOptions.push(...ekstraOptionsICD10);

  return {
    ICD10: {
      hoveddiagnoserOptions: uniqBy(icd10HoveddiagnoserOptions, 'value'),
      bidiagnoserOptions: uniqBy(icd10BidiagnoserOptions, 'value'),
    },
    ICPC2: {
      hoveddiagnoserOptions: uniqBy(icpc2HoveddiagnoserOptions, 'value'),
      bidiagnoserOptions: uniqBy(icpc2BidiagnoserOptions, 'value'),
    },
  };
}
