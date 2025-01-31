'use client';

import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { FormField, useConfigForm } from '@navikt/aap-felles-react';
import { Form } from 'components/form/Form';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { landMedTrygdesamarbeid } from 'lib/utils/countries';
import { Alert } from '@navikt/ds-react';

interface Props {
  behandlingVersjon: number;
  readOnly: boolean;
  grunnlag?: unknown;
}

interface FormFields {
  begrunnelse: string;
  lovvalgsLand: string;
  annetLovvalgslandMedAvtale?: string;
}
export const LovvalgVedSøknadstidspunkt = ({ readOnly }: Props) => {
  const { isLoading, status } = useLøsBehovOgGåTilNesteSteg('VURDER_LOVVALG');
  const { form, formFields } = useConfigForm<FormFields>(
    {
      begrunnelse: {
        type: 'textarea',
        label: 'Vurder riktig lovvalg ved søknadstidspunkt',
        rules: { required: 'Du må gi en begrunnelse på lovvalg ved søknadstidspunkt' },
      },
      lovvalgsLand: {
        type: 'radio',
        label: 'Hva er riktig lovvalgsland ved søknadstidspunkt?',
        options: ['Norge', 'Annet land med avtale', 'Land uten avtale'],
        rules: { required: 'Du må velge riktig lovvalg ved søknadstidspunkt' },
      },
      annetLovvalgslandMedAvtale: {
        type: 'select',
        label: 'Velg land som vi vurderer som lovvalgsland',
        options: landMedTrygdesamarbeid,
      },
    },
    { readOnly }
  );

  const lovvalgsLand = form.watch('lovvalgsLand');
  return (
    <VilkårsKort heading={'Lovvalg ved søknadstidspunkt'} steg={'VURDER_LOVVALG'}>
      <Form
        steg={'VURDER_LOVVALG'}
        onSubmit={form.handleSubmit((data) => console.log(data))}
        isLoading={isLoading}
        status={status}
      >
        <Alert variant={'warning'}>Dette steget fungerer ikke enda og trenger ikke testes</Alert>
        <FormField form={form} formField={formFields.begrunnelse} />
        <FormField form={form} formField={formFields.lovvalgsLand} />
        {lovvalgsLand === 'Annet land med avtale' && (
          <FormField form={form} formField={formFields.annetLovvalgslandMedAvtale} />
        )}
      </Form>
    </VilkårsKort>
  );
};
