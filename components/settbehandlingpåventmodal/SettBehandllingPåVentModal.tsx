'use client';

import React, { useEffect, useState } from 'react';
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
  onClose: () => void;
}

interface FormFields {
  begrunnelse: string;
  frist: Date;
}

export const SettBehandllingPåVentModal = ({ referanse, behandlingVersjon, isOpen, onClose }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

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
              await settBehandlingPåVent(referanse, {
                begrunnelse: data.begrunnelse,
                behandlingVersjon: behandlingVersjon,
                frist: formaterDatoForBackend(data.frist),
              });
              await revalidateFlyt(referanse);
              setIsLoading(false);
              onClose();
            })}
            className={'flex-column'}
          >
            <FormField form={form} formField={formFields.begrunnelse} />
            <FormField form={form} formField={formFields.frist} />
          </form>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button form={'settBehandlingPåVent'} className={'fit-content-button'} loading={isLoading}>
          Sett på vent
        </Button>
        <Button variant={'secondary'} onClick={onClose}>
          Avbryt
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
