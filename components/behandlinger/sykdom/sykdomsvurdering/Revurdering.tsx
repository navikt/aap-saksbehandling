import { SykdomsvurderingFormFields } from 'components/behandlinger/sykdom/sykdomsvurdering/Sykdomsvurdering';
import { FormField } from 'components/form/FormField';
import { FormFields } from 'components/form/FormHook';
import { JaEllerNei } from 'lib/utils/form';
import { FieldPath, UseFormReturn } from 'react-hook-form';

interface Props {
  form: UseFormReturn<SykdomsvurderingFormFields>;
  formFields: FormFields<FieldPath<SykdomsvurderingFormFields>, SykdomsvurderingFormFields>;
  erÅrsakssammenhengYrkesskade: boolean;
}

export const Revurdering = ({ form, formFields, erÅrsakssammenhengYrkesskade }: Props) => {
  return (
    form.watch('erArbeidsevnenNedsatt') === JaEllerNei.Ja && (
      <>
        {!erÅrsakssammenhengYrkesskade && (
          <FormField form={form} formField={formFields.erNedsettelseIArbeidsevneMerEnnFørtiProsent} horizontalRadio />
        )}

        {erÅrsakssammenhengYrkesskade && (
          <FormField
            form={form}
            formField={formFields.erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense}
            horizontalRadio
          />
        )}

        {form.watch('erNedsettelseIArbeidsevneMerEnnFørtiProsent') === JaEllerNei.Ja && (
          <FormField form={form} formField={formFields.erSkadeSykdomEllerLyteVesentligdel} horizontalRadio />
        )}
      </>
    )
  );
};
