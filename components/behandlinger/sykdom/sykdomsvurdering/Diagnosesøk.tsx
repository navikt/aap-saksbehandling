import { SykdomsvurderingFormFields } from 'components/behandlinger/sykdom/sykdomsvurdering/Sykdomsvurdering';
import { AsyncComboSearch } from 'components/form/asynccombosearch/AsyncComboSearch';
import { diagnoseSøker, ingenDiagnoseCode } from 'lib/diagnosesøker/DiagnoseSøker';
import { JaEllerNei } from 'lib/utils/form';
import { FieldPath, UseFormReturn } from 'react-hook-form';
import { FormFields } from 'components/form/FormHook';
import { FormField, ValuePair } from 'components/form/FormField';

interface Props {
  form: UseFormReturn<SykdomsvurderingFormFields>;
  formFields: FormFields<FieldPath<SykdomsvurderingFormFields>, SykdomsvurderingFormFields>;
  readOnly: boolean;
  hoveddiagnoseDefaultOptions?: ValuePair[];
}

export const Diagnosesøk = ({ form, formFields, readOnly, hoveddiagnoseDefaultOptions }: Props) => {
  const kodeverkValue = form.watch('kodeverk');
  const defaultOptionsHoveddiagnose = hoveddiagnoseDefaultOptions
    ? hoveddiagnoseDefaultOptions
    : diagnoseSøker(kodeverkValue!, '');
  const defaultOptionsBidiagnose = hoveddiagnoseDefaultOptions
    ? hoveddiagnoseDefaultOptions
    : diagnoseSøker(kodeverkValue!, '');
  return (
    <>
      {form.watch('harSkadeSykdomEllerLyte') === JaEllerNei.Ja && (
        <FormField form={form} formField={formFields.kodeverk} horizontalRadio />
      )}
      {kodeverkValue && (
        <>
          <AsyncComboSearch
            label={'Hoveddiagnose'}
            form={form}
            name={'hoveddiagnose'}
            fetcher={async (value) => diagnoseSøker(kodeverkValue, value)}
            defaultOptions={defaultOptionsHoveddiagnose}
            rules={{ required: 'Du må velge en hoveddiagnose' }}
            readOnly={readOnly}
          />
          {form.watch('hoveddiagnose')?.value !== ingenDiagnoseCode && (
            <AsyncComboSearch
              label={'Bidiagnoser'}
              form={form}
              isMulti={true}
              name={'bidiagnose'}
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
