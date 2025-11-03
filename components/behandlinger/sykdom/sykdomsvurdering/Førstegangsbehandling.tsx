import { Alert } from '@navikt/ds-react';
import { SykdomsvurderingFormFields } from 'components/behandlinger/sykdom/sykdomsvurdering/Sykdomsvurdering';
import { FormFields } from 'components/form/FormHook';
import { JaEllerNei } from 'lib/utils/form';
import { FieldPath, UseFormReturn } from 'react-hook-form';
import { FormField } from 'components/form/FormField';

interface Props {
  form: UseFormReturn<SykdomsvurderingFormFields>;
  formFields: FormFields<FieldPath<SykdomsvurderingFormFields>, SykdomsvurderingFormFields>;
  skalVurdereYrkesskade: boolean;
}

export const Førstegangsbehandling = ({ form, formFields, skalVurdereYrkesskade }: Props) => {
  return (
    <>
      {form.watch('erArbeidsevnenNedsatt') === JaEllerNei.Nei && (
        <Alert variant={'info'} size={'small'} className={'fit-content'}>
          Brukeren vil få vedtak om at de ikke har rett på AAP. De kvalifiserer ikke for sykepengeerstatning.
        </Alert>
      )}

      {form.watch('erArbeidsevnenNedsatt') === JaEllerNei.Ja && (
        <>
          <FormField form={form} formField={formFields.erNedsettelseIArbeidsevneMerEnnHalvparten} horizontalRadio />

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
            <>
              <FormField form={form} formField={formFields.erSkadeSykdomEllerLyteVesentligdel} horizontalRadio />

              {form.watch('erSkadeSykdomEllerLyteVesentligdel') === JaEllerNei.Ja && (
                <>
                  <FormField
                    form={form}
                    formField={formFields.erNedsettelseIArbeidsevneAvEnVissVarighet}
                    horizontalRadio
                  />
                </>
              )}
            </>
          )}
        </>
      )}
    </>
  );
};
