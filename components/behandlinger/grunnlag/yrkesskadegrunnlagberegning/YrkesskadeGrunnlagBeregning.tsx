'use client';

import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { BandageIcon } from '@navikt/aksel-icons';
import { FormField, TextFieldWrapper, useConfigForm } from '@navikt/aap-felles-react';
import { useFieldArray } from 'react-hook-form';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { Form } from 'components/form/Form';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';

interface Props {
  behandlingVersjon: number;
  readOnly: boolean;
}

interface FormFields {
  begrunnelse: string;
  antattÅrligArbeidsinntekt: Inntekt[];
}

interface Inntekt {
  inntekt: string;
  ref: string;
  skadetidspunkt: string;
}

export const YrkesskadeGrunnlagBeregning = ({ behandlingVersjon, readOnly }: Props) => {
  console.log(behandlingVersjon);
  const { isLoading, status } = useLøsBehovOgGåTilNesteSteg('FASTSETT_GRUNNLAG');
  const defaultValue: Inntekt[] = [
    { ref: 'YRK', inntekt: '', skadetidspunkt: formaterDatoForFrontend('2020-10-10') },
    { ref: 'SYK', inntekt: '', skadetidspunkt: formaterDatoForFrontend('2007-2-10') },
  ];

  const { form, formFields } = useConfigForm<FormFields>(
    {
      begrunnelse: {
        type: 'textarea',
        label: 'Begrunnelse for anslått årlig arbeidsinntekt',
      },
      antattÅrligArbeidsinntekt: {
        type: 'fieldArray',
        defaultValue: defaultValue,
      },
    },
    { readOnly: readOnly }
  );

  const { fields } = useFieldArray({ control: form.control, name: 'antattÅrligArbeidsinntekt' });

  return (
    <VilkårsKort
      heading={'Yrkesskade grunnlagsberegning § 11-19 / 11-22'}
      steg={'FASTSETT_GRUNNLAG'}
      icon={<BandageIcon />}
    >
      <Form onSubmit={form.handleSubmit(() => {})} steg={'FASTSETT_GRUNNLAG'} status={status} isLoading={isLoading}>
        {fields.map((field, index) => {
          return (
            <TextFieldWrapper
              key={field.id}
              label={`Anslått årlig arbeidsinntekt på skadetidspunkt ${field.skadetidspunkt}`}
              name={`antattÅrligArbeidsinntekt.${index}.inntekt`}
              control={form.control}
              type={'number'}
              readOnly={readOnly}
            />
          );
        })}
        <FormField form={form} formField={formFields.begrunnelse} className={'begrunnelse'} />
      </Form>
    </VilkårsKort>
  );
};
