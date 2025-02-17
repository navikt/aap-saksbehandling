import { FormField, FormFields, ValuePair } from '@navikt/aap-felles-react';
import { SykdomsvurderingFormFields } from 'components/behandlinger/sykdom/sykdomsvurdering/Sykdomsvurdering';
import { AsyncComboSearch } from 'components/input/asynccombosearch/AsyncComboSearch';
import { diagnoseSøker, ingenDiagnoseCode } from 'lib/diagnosesøker/DiagnoseSøker';
import { JaEllerNei } from 'lib/utils/form';
import { FieldPath, UseFormReturn } from 'react-hook-form';

interface Props {
  form: UseFormReturn<SykdomsvurderingFormFields>;
  formFields: FormFields<FieldPath<SykdomsvurderingFormFields>, SykdomsvurderingFormFields>;
  readOnly: boolean;
  skalVurdereYrkesskade: boolean;
  hoveddiagnoseDefaultOptions?: ValuePair[];
}

export const Revurdering = ({
  form,
  formFields,
  readOnly,
  skalVurdereYrkesskade,
  hoveddiagnoseDefaultOptions,
}: Props) => {
  const kodeverkValue = form.watch('kodeverk');
  const defaultOptionsHoveddiagnose = hoveddiagnoseDefaultOptions
    ? hoveddiagnoseDefaultOptions
    : diagnoseSøker(kodeverkValue!, '');
  const defaultOptionsBidiagnose = hoveddiagnoseDefaultOptions
    ? hoveddiagnoseDefaultOptions
    : diagnoseSøker(kodeverkValue!, '');

  return (
    <>
      <FormField form={form} formField={formFields.harSkadeSykdomEllerLyte} horizontalRadio />
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
              label={'Bidiagnoser (valgfritt)'}
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
      {form.watch('harSkadeSykdomEllerLyte') === JaEllerNei.Ja && (
        <FormField form={form} formField={formFields.erArbeidsevnenNedsatt} horizontalRadio />
      )}
      {!skalVurdereYrkesskade && form.watch('erArbeidsevnenNedsatt') === JaEllerNei.Ja && (
        <FormField form={form} formField={formFields.erNedsettelseIArbeidsevneMerEnnFørtiProsent} horizontalRadio />
      )}
      {skalVurdereYrkesskade && form.watch('erArbeidsevnenNedsatt') === JaEllerNei.Ja && (
        <FormField form={form} formField={formFields.erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense} horizontalRadio />
      )}
      {form.watch('erNedsettelseIArbeidsevneMerEnnFørtiProsent') === JaEllerNei.Ja && (
        <FormField form={form} formField={formFields.erSkadeSykdomEllerLyteVesentligdel} horizontalRadio />
      )}
    </>
  );
};
