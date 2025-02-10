'use client';

import React, { useEffect, useState } from 'react';
import { Button, Modal } from '@navikt/ds-react';
import { useConfigForm, FormField, ValuePair } from '@navikt/aap-felles-react';
import { formaterDatoForBackend } from 'lib/utils/date';
import { clientSettBehandlingPåVent } from 'lib/clientApi';
import { revalidateFlyt } from 'lib/actions/actions';

import styles from './SettBehandlingPåVentModal.module.css';
import { HourglassBottomFilledIcon } from '@navikt/aksel-icons';
import { SettPåVentÅrsaker } from 'lib/types/types';

interface Props {
  referanse: string;
  behandlingVersjon: number;
  isOpen: boolean;
  onClose: () => void;
}

interface FormFields {
  begrunnelse: string;
  frist: Date;
  grunn: SettPåVentÅrsaker;
}

export const SettBehandllingPåVentModal = ({ referanse, behandlingVersjon, isOpen, onClose }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const grunnOptions: ValuePair<SettPåVentÅrsaker>[] = [
    { label: 'Venter på medisinske opplysninger', value: 'VENTER_PÅ_MEDISINSKE_OPPLYSNINGER' },
    { label: 'Venter på opplysninger', value: 'VENTER_PÅ_OPPLYSNINGER' },
    { label: 'Venter på vurdering fra rådgivende overlege', value: 'VENTER_PÅ_VURDERING_AV_ROL' },
    {
      label: 'Venter på opplysninger fra utenlandske myndigheter',
      value: 'VENTER_PÅ_OPPLYSNINGER_FRA_UTENLANDSKE_MYNDIGHETER',
    },
    { label: 'Venter på svar fra bruker', value: 'VENTER_PÅ_SVAR_FRA_BRUKER' },
  ];

  const { form, formFields } = useConfigForm<FormFields>({
    begrunnelse: {
      type: 'textarea',
      label: 'Begrunnelse',
      rules: { required: 'Du må gi en begrunnelse' },
    },
    frist: {
      type: 'date_input',
      label: 'Tidspunkt for frist',
      rules: { required: 'Du må sette en frist' },
    },
    grunn: {
      type: 'select',
      label: 'Velg en årsak',
      options: [{ label: '', value: '' }, ...grunnOptions],
      rules: { required: 'Du må velge en årsak' },
    },
  });

  useEffect(() => {
    form.reset();
  }, [isOpen, form]);

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      header={{ heading: 'Sett behandling på vent', icon: <HourglassBottomFilledIcon /> }}
      className={styles.settBehandlingPåVentModal}
    >
      <Modal.Body>
        {isOpen && (
          <form
            id={'settBehandlingPåVent'}
            onSubmit={form.handleSubmit(async (data) => {
              setIsLoading(true);
              await clientSettBehandlingPåVent(referanse, {
                begrunnelse: data.begrunnelse,
                behandlingVersjon: behandlingVersjon,
                frist: formaterDatoForBackend(data.frist),
                grunn: data.grunn,
              });
              await revalidateFlyt(referanse);
              setIsLoading(false);
              onClose();
            })}
            className={'flex-column'}
            autoComplete={'off'}
          >
            <FormField form={form} formField={formFields.begrunnelse} />
            <FormField form={form} formField={formFields.frist} />
            <FormField form={form} formField={formFields.grunn} />
          </form>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button form={'settBehandlingPåVent'} className={'fit-content'} loading={isLoading}>
          Sett på vent
        </Button>
        <Button variant={'secondary'} onClick={onClose}>
          Avbryt
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
