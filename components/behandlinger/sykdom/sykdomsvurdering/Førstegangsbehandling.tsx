import { FormField, FormFields, ValuePair } from '@navikt/aap-felles-react';
import { Alert, Heading } from '@navikt/ds-react';
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

export const Førstegangsbehandling = ({
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
      {form.watch('erArbeidsevnenNedsatt') === JaEllerNei.Nei && (
        <Alert variant={'info'} size={'small'} className={'fit-content'}>
          Bruker vil få vedtak om at de ikke har rett på AAP. De kvalifiserer ikke for sykepengeerstatning.
        </Alert>
      )}
      {form.watch('erArbeidsevnenNedsatt') === JaEllerNei.Ja && (
        <>
          <FormField form={form} formField={formFields.erNedsettelseIArbeidsevneAvEnVissVarighet} horizontalRadio />
        </>
      )}

      {form.watch('erNedsettelseIArbeidsevneAvEnVissVarighet') === JaEllerNei.Ja && (
        <>
          <FormField form={form} formField={formFields.erNedsettelseIArbeidsevneMerEnnHalvparten} horizontalRadio />
        </>
      )}

      {skalVurdereYrkesskade && form.watch('erNedsettelseIArbeidsevneMerEnnHalvparten') === JaEllerNei.Nei && (
        <>
          <Heading size={'small'}>Nedsatt arbeidsevne §§ 11-5 / 11-22</Heading>
          <FormField form={form} formField={formFields.yrkesskadeBegrunnelse} className={'begrunnelse'} />
          <FormField
            form={form}
            formField={formFields.erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense}
            horizontalRadio
          />
        </>
      )}
      {(form.watch('erNedsettelseIArbeidsevneMerEnnHalvparten') === JaEllerNei.Ja ||
        (form.watch('erNedsettelseIArbeidsevneMerEnnHalvparten') === JaEllerNei.Nei &&
          form.watch('erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense') === JaEllerNei.Ja &&
          skalVurdereYrkesskade)) && (
        <FormField form={form} formField={formFields.erSkadeSykdomEllerLyteVesentligdel} horizontalRadio />
      )}
    </>
  );
};
