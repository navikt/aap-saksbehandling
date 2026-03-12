import { AsyncComboSearch } from 'components/form/asynccombosearch/AsyncComboSearch';
import { DiagnoseSystem, diagnoseSøker, ingenDiagnoseCode } from 'lib/diagnosesøker/DiagnoseSøker';
import { JaEllerNei } from 'lib/utils/form';
import { UseFormReturn, useWatch } from 'react-hook-form';
import { SykdomsvurderingerForm } from 'components/behandlinger/sykdom/sykdomsvurdering/Sykdomsvurdering';
import { RadioGroupWrapper } from 'components/form/radiogroupwrapper/RadioGroupWrapper';
import { Radio } from '@navikt/ds-react';
import { DiagnoserDefaultOptions } from 'components/behandlinger/sykdom/sykdomsvurdering/diagnoseUtil';
import styles from './SykdomsvurderingDiagnosesøk.module.css';

interface Props {
  index: number;
  form: UseFormReturn<SykdomsvurderingerForm>;
  readOnly: boolean;
  diagnoseDefaultOptions: DiagnoserDefaultOptions;
}

export const SykdomsvurderingDiagnosesøk = ({ index, form, readOnly, diagnoseDefaultOptions }: Props) => {
  const kodeverkValue = useWatch({
    control: form.control,
    name: `vurderinger.${index}.kodeverk`,
  }) as DiagnoseSystem;

  const kodeverk = kodeverkValue as keyof DiagnoserDefaultOptions | undefined;

  const defaultOptionsHoveddiagnose = kodeverk && diagnoseDefaultOptions[kodeverk].hoveddiagnoserOptions;

  const defaultOptionsBidiagnose = kodeverk && diagnoseDefaultOptions[kodeverk].bidiagnoserOptions;

  const harSkadeEllerLyte = form.watch(`vurderinger.${index}.harSkadeSykdomEllerLyte`) === JaEllerNei.Ja;

  return (
    <>
      <RadioGroupWrapper
        name={`vurderinger.${index}.kodeverk`}
        control={form.control}
        label={'Velg system for diagnoser'}
        rules={{ required: 'Du må velge et system for diagnoser.' }}
        readOnly={readOnly}
        size={'small'}
        horisontal={true}
        onChangeCustom={() => {
          form.setValue(`vurderinger.${index}.hoveddiagnose`, null);
          form.setValue(`vurderinger.${index}.bidiagnose`, null);
        }}
      >
        <Radio value={'ICPC2'}>{'Primærhelsetjenesten (ICPC2)'}</Radio>
        <Radio value={'ICD10'}>{'Spesialisthelsetjenesten (ICD10)'}</Radio>
      </RadioGroupWrapper>

      {kodeverkValue != null && harSkadeEllerLyte && (
        <>
          <AsyncComboSearch
            className={styles.diagnosesokContainer}
            label={'Hoveddiagnose'}
            form={form}
            name={`vurderinger.${index}.hoveddiagnose`}
            fetcher={async (value) => diagnoseSøker(kodeverkValue, value)}
            defaultOptions={defaultOptionsHoveddiagnose}
            rules={{ required: 'Du må velge en hoveddiagnose.' }}
            readOnly={readOnly}
          />
          {form.watch(`vurderinger.${index}.hoveddiagnose`)?.value !== ingenDiagnoseCode && (
            <AsyncComboSearch
              className={styles.diagnosesokContainer}
              label={'Bidiagnoser'}
              form={form}
              isMulti={true}
              name={`vurderinger.${index}.bidiagnose`}
              fetcher={async (value) => diagnoseSøker(kodeverkValue, value)}
              defaultOptions={defaultOptionsBidiagnose}
              readOnly={readOnly}
            />
          )}
        </>
      )}
    </>
  );
};
