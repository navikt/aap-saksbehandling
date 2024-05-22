'use client';

import React from 'react';
import { HourglassBottomFilledIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { useConfigForm } from 'hooks/FormHook';
import { formaterDatoForBackend } from 'lib/utils/date';
import { FormField } from 'components/input/formfield/FormField';
import { settBehandlingPåVent } from 'lib/clientApi';
import { SideProsessKort } from 'components/sideprosesskort/SideProsessKort';
import { revalidateFlyt } from 'lib/actions/actions';

interface Props {
  referanse: string;
  behandlingVersjon: number;
}

interface FormFields {
  begrunnelse: string;
  frist: Date;
}

export const SettBehandllingPåVent = ({ referanse, behandlingVersjon }: Props) => {
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

  return (
    <SideProsessKort heading={'Sett behandling på vent'} icon={<HourglassBottomFilledIcon />}>
      <form
        onSubmit={form.handleSubmit(async (data) => {
          await settBehandlingPåVent(referanse, {
            begrunnelse: data.begrunnelse,
            behandlingVersjon: behandlingVersjon,
            frist: formaterDatoForBackend(data.frist),
          });
          await revalidateFlyt(referanse);
        })}
        className={'flex-column'}
      >
        <FormField form={form} formField={formFields.begrunnelse} />
        <FormField form={form} formField={formFields.frist} />
        <Button className={'fit-content-button'}>Sett på vent</Button>
      </form>
    </SideProsessKort>
  );
};
