'use client';

import React from 'react';
import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { HourglassBottomFilledIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { useConfigForm } from 'hooks/FormHook';
import { formaterDatoForBackend } from 'lib/utils/date';
import { FormField } from 'components/input/formfield/FormField';
import { settBehandlingPåVent } from 'lib/clientApi';

interface Props {
  referanse: string;
  erPåVent: boolean;
}

interface FormFields {
  begrunnelse: string;
  frist: Date;
}

export const SettBehandllingPåVent = ({ referanse, erPåVent }: Props) => {
  const { form, formFields } = useConfigForm<FormFields>({
    begrunnelse: {
      type: 'text',
      label: 'Begrunnelse',
    },
    frist: {
      type: 'date',
      fromDate: new Date(),
      label: 'Tidspunkt',
    },
  });

  console.log('erPåVent', erPåVent);

  return (
    <VilkårsKort steg={'VURDER_BISTANDSBEHOV'} heading={'Sett behandling på vent'} icon={<HourglassBottomFilledIcon />}>
      <form
        onSubmit={form.handleSubmit(async (data) => {
          await settBehandlingPåVent(referanse, {
            begrunnelse: data.begrunnelse,
            frist: formaterDatoForBackend(data.frist),
          });
        })}
        style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
      >
        <FormField form={form} formField={formFields.begrunnelse} />
        <FormField form={form} formField={formFields.frist} />
        <Button className={'fit-content-button'}>Sett på vent</Button>
      </form>
    </VilkårsKort>
  );
};
