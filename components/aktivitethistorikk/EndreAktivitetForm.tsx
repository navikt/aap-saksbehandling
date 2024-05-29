import { useConfigForm } from 'hooks/FormHook';
import { JaEllerNeiOptions } from 'lib/utils/form';
import { FormField } from 'components/input/formfield/FormField';
import { Button } from '@navikt/ds-react';

type FormFields = {
  rimeligGrunn: boolean;
  begrunnelse: string;
};
export const EndreAktivitetForm = () => {
  const { form, formFields } = useConfigForm<FormFields>({
    rimeligGrunn: {
      type: 'radio',
      label: 'Er det rimelig grunn til fraværet?',
      options: JaEllerNeiOptions,
      rules: { required: true },
    },
    begrunnelse: {
      type: 'textarea',
      label: 'Begrunnelse',
      rules: { required: true },
    },
  });
  return (
    <form>
      <FormField form={form} formField={formFields.rimeligGrunn} />
      <FormField form={form} formField={formFields.begrunnelse} />
      <Button>Send</Button>
    </form>
  );
};
