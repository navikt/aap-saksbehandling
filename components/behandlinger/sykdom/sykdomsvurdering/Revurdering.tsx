import { FormField, FormFields } from '@navikt/aap-felles-react';
import { SykdomsvurderingFormFields } from 'components/behandlinger/sykdom/sykdomsvurdering/Sykdomsvurdering';
import { JaEllerNei } from 'lib/utils/form';
import { ReactNode } from 'react';
import { FieldPath, UseFormReturn } from 'react-hook-form';

interface Props {
  form: UseFormReturn<SykdomsvurderingFormFields>;
  formFields: FormFields<FieldPath<SykdomsvurderingFormFields>, SykdomsvurderingFormFields>;
  skalVurdereYrkesskade: boolean;
  diagnosesøker: ReactNode;
}

export const Revurdering = ({ form, formFields, skalVurdereYrkesskade, diagnosesøker }: Props) => {
  return (
    <>
      <FormField form={form} formField={formFields.harSkadeSykdomEllerLyte} horizontalRadio />
      {diagnosesøker}
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
