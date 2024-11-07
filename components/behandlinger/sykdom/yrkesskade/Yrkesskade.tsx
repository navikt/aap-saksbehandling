'use client';

import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { HandBandageIcon } from '@navikt/aksel-icons';
import { Veiledning } from 'components/veiledning/Veiledning';
import { FormField, useConfigForm } from '@navikt/aap-felles-react';
import { JaEllerNeiOptions } from 'lib/utils/form';
import { CheckboxWrapper } from 'components/input/CheckboxWrapper';
import { Form } from 'components/form/Form';

interface Props {
  behandlingVersjon: number;
  readOnly: boolean;
  behandlingsReferanse: string;
}

interface FormFields {
  begrunnelse: string;
  erÅrsakssammenhengMellomYrkesskadeOgNedsattArbeidsevne: string;
  andelAvTotalNedsattArbeidsevneSkyldesYrkesskadene?: string;
  dokumenter?: string[];
}

export const Yrkesskade = ({ readOnly }: Props) => {
  const { form, formFields } = useConfigForm<FormFields>({
    begrunnelse: {
      type: 'textarea',
      label: 'Vurder om yrkesskade er medvirkende årsak til nedsatt arbeidsevne',
    },
    erÅrsakssammenhengMellomYrkesskadeOgNedsattArbeidsevne: {
      type: 'radio',
      label: 'Finnes det en årsakssammenheng mellom yrkesskade og nedsatt arbeidsevne?',
      options: JaEllerNeiOptions,
    },
    dokumenter: {
      type: 'checkbox_nested',
    },
    andelAvTotalNedsattArbeidsevneSkyldesYrkesskadene: {
      type: 'number',
      label: 'Hvor stor andel totalt av nedsatt arbeidsevne skyldes yrkesskadene?',
    },
  });

  return (
    <VilkårsKort
      heading={'Yrkesskade §§ 11-22 1.ledd'}
      steg={'AVKLAR_SYKDOM'}
      vilkårTilhørerNavKontor={false}
      icon={<HandBandageIcon />}
    >
      <Form
        steg={'AVKLAR_SYKDOM'}
        onSubmit={form.handleSubmit((data) => console.log(data))}
        isLoading={false}
        status={'DONE'}
      >
        <Veiledning />
        <FormField form={form} formField={formFields.begrunnelse} />
        <FormField form={form} formField={formFields.erÅrsakssammenhengMellomYrkesskadeOgNedsattArbeidsevne} />
        <CheckboxWrapper
          name={'dokumenter'}
          control={form.control}
          label={'Tilknytt eventuelle yrkesskader som er helt eller delvis årsak til den nedsatte arbeidsevnen.'}
          readOnly={readOnly}
        >
          <div>Hei</div>
        </CheckboxWrapper>
        <FormField form={form} formField={formFields.andelAvTotalNedsattArbeidsevneSkyldesYrkesskadene} />
      </Form>
    </VilkårsKort>
  );
};
