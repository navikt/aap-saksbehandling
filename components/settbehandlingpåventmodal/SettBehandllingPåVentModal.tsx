'use client';

import React, { Dispatch, useEffect } from 'react';
import { Button, Modal } from '@navikt/ds-react';
import { useConfigForm } from 'hooks/FormHook';
import { formaterDatoForBackend } from 'lib/utils/date';
import { FormField } from 'components/input/formfield/FormField';
import { settBehandlingPåVent } from 'lib/clientApi';
import { revalidateFlyt } from 'lib/actions/actions';

import styles from './SettBehandlingPåVentModal.module.css';
import { HourglassBottomFilledIcon } from '@navikt/aksel-icons';

interface Props {
  referanse: string;
  behandlingVersjon: number;
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
}

interface FormFields {
  begrunnelse: string;
  frist: Date;
}

export const SettBehandllingPåVentModal = ({ referanse, behandlingVersjon, isOpen, setIsOpen }: Props) => {
  const { form, formFields } = useConfigForm<FormFields>({
    begrunnelse: {
      type: 'textarea',
      label: 'Begrunnelse',
      rules: { required: 'Du må gi en begrunnelse' },
    },
    frist: {
      type: 'date',
      fromDate: new Date(),
      label: 'Tidspunkt',
      rules: { required: 'Du må sette en frist' },
    },
  });

  useEffect(() => {
    form.reset();
  }, [isOpen, form]);

  return (
    <Modal
      open={isOpen}
      onClose={() => setIsOpen(false)}
      header={{ heading: 'Sett behandling på vent', icon: <HourglassBottomFilledIcon /> }}
      className={styles.settBehandlingPåVentModal}
    >
      <Modal.Body>
        <form
          id={'settBehandlingPåVent'}
          onSubmit={form.handleSubmit(async (data) => {
            await settBehandlingPåVent(referanse, {
              begrunnelse: data.begrunnelse,
              behandlingVersjon: behandlingVersjon,
              frist: formaterDatoForBackend(data.frist),
            });
            await revalidateFlyt(referanse);
            setIsOpen(false);
          })}
          className={'flex-column'}
        >
          <FormField form={form} formField={formFields.begrunnelse} />
          <FormField form={form} formField={formFields.frist} />
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button form={'settBehandlingPåVent'} className={'fit-content-button'}>
          Sett på vent
        </Button>
        <Button variant={'secondary'} onClick={() => setIsOpen(false)}>
          Avbryt
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
