import { AsyncComboSearch } from 'components/form/asynccombosearch/AsyncComboSearch';
import { DiagnoseSystem, diagnoseSøker, ingenDiagnoseCode } from 'lib/diagnosesøker/DiagnoseSøker';
import { JaEllerNei } from 'lib/utils/form';
import { UseFormReturn } from 'react-hook-form';
import { ValuePair } from 'components/form/FormField';
import { Sykdomsvurderinger } from 'components/behandlinger/sykdom/sykdomsvurdering/SykdomsvurderingPeriodisert';
import { RadioGroupWrapper } from 'components/form/radiogroupwrapper/RadioGroupWrapper';
import { Radio } from '@navikt/ds-react';

interface Props {
  index: number;
  form: UseFormReturn<Sykdomsvurderinger>;
  readOnly: boolean;
  hoveddiagnoseDefaultOptions?: ValuePair[];
}

export const SykdomsvurderingDiagnosesøk = ({ index, form, readOnly, hoveddiagnoseDefaultOptions }: Props) => {
  const kodeverkValue = form.watch(`vurderinger.${index}.kodeverk`) as DiagnoseSystem;
  const defaultOptionsHoveddiagnose = hoveddiagnoseDefaultOptions
    ? hoveddiagnoseDefaultOptions
    : diagnoseSøker(kodeverkValue, '');
  const defaultOptionsBidiagnose = hoveddiagnoseDefaultOptions
    ? hoveddiagnoseDefaultOptions
    : diagnoseSøker(kodeverkValue, '');

  const harSkadeEllerLyte = form.watch(`vurderinger.${index}.harSkadeSykdomEllerLyte`) === JaEllerNei.Ja;

  return (
    <>
      <RadioGroupWrapper
        name={`vurderinger.${index}.kodeverk`}
        control={form.control}
        label={'Velg system for diagnoser'}
        rules={{ required: 'Du må velge et system for diagnoser' }}
        shouldUnregister={true}
        readOnly={readOnly}
        size={'small'}
        horisontal={true}
      >
        <Radio value={'ICPC2'}>{'Primærhelsetjenesten (ICPC2)'}</Radio>
        <Radio value={'ICD10'}>{'Spesialisthelsetjenesten (ICD10)'}</Radio>
      </RadioGroupWrapper>
      {kodeverkValue != null && harSkadeEllerLyte && (
        <>
          <AsyncComboSearch
            label={'Hoveddiagnose'}
            form={form}
            name={`vurderinger.${index}.hoveddiagnose`}
            fetcher={async (value) => diagnoseSøker(kodeverkValue, value)}
            defaultOptions={defaultOptionsHoveddiagnose}
            rules={{ required: 'Du må velge en hoveddiagnose' }}
            readOnly={readOnly}
          />
          {form.watch(`vurderinger.${index}.hoveddiagnose`)?.value !== ingenDiagnoseCode && (
            <AsyncComboSearch
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
