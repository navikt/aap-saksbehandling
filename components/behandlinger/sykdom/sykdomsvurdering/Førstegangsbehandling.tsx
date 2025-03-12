import { Alert } from '@navikt/ds-react';
import { SykdomsvurderingFormFields } from 'components/behandlinger/sykdom/sykdomsvurdering/Sykdomsvurdering';
import { FormFields } from 'components/form/FormHook';
import { JaEllerNei } from 'lib/utils/form';
import { ReactNode } from 'react';
import { FieldPath, UseFormReturn } from 'react-hook-form';
import { FormField } from 'components/form/FormField';

interface Props {
  form: UseFormReturn<SykdomsvurderingFormFields>;
  formFields: FormFields<FieldPath<SykdomsvurderingFormFields>, SykdomsvurderingFormFields>;
  skalVurdereYrkesskade: boolean;
  diagnosesøker: ReactNode;
}

export const Førstegangsbehandling = ({ form, formFields, skalVurdereYrkesskade, diagnosesøker }: Props) => {
  return (
    <>
      <FormField form={form} formField={formFields.harSkadeSykdomEllerLyte} horizontalRadio />
      {diagnosesøker}
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
          <FormField form={form} formField={formFields.erNedsettelseIArbeidsevneMerEnnHalvparten} horizontalRadio />
        </>
      )}

      {skalVurdereYrkesskade && form.watch('erNedsettelseIArbeidsevneMerEnnHalvparten') === JaEllerNei.Nei && (
        <>
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
      {form.watch('erSkadeSykdomEllerLyteVesentligdel') === JaEllerNei.Ja && (
        <>
          <FormField form={form} formField={formFields.erNedsettelseIArbeidsevneAvEnVissVarighet} horizontalRadio />
        </>
      )}
    </>
  );
};
