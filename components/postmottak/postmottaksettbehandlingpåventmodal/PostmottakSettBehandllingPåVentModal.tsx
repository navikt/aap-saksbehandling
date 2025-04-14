'use client';

import React, { useEffect, useTransition } from 'react';
import { Alert, Button, Modal } from '@navikt/ds-react';
import styles from 'components/postmottak/postmottaksettbehandlingpåventmodal/PostmottakSettBehandlingPåVentModal.module.css';
import { HourglassBottomFilledIcon } from '@navikt/aksel-icons';
import { SettPåVentÅrsaker } from 'lib/types/postmottakTypes';
import { formaterDatoForBackend } from 'lib/utils/date';
import { revalidatePostMottakFlyt } from 'lib/actions/actions';
import { FormField, ValuePair } from 'components/form/FormField';
import { useConfigForm } from 'components/form/FormHook';
import { parse } from 'date-fns';
import { usePostmottakSettPåVent } from 'hooks/FetchHook';

interface Props {
  behandlingVersjon: number;
  behandlingsreferanse: string;
  isOpen: boolean;
  onClose: () => void;
}

interface FormFields {
  begrunnelse: string;
  frist: string;
  grunn: SettPåVentÅrsaker;
}

export const PostmottakSettBehandllingPVentModal = ({
  isOpen,
  onClose,
  behandlingsreferanse,
  behandlingVersjon,
}: Props) => {
  const [isPending, startTransition] = useTransition();
  const { postmottakSettPåVent, error } = usePostmottakSettPåVent();

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
      label: 'Tidspunkt',
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
        {error && <Alert variant={'error'}>{error}</Alert>}
        {isOpen && (
          <form
            id={'settBehandlingPåVent'}
            onSubmit={form.handleSubmit(async (data) => {
              startTransition(async () => {
                const res = await postmottakSettPåVent(behandlingsreferanse, {
                  begrunnelse: data.begrunnelse,
                  behandlingVersjon: behandlingVersjon,
                  frist: formaterDatoForBackend(parse(data.frist, 'dd.MM.yyyy', new Date())),
                  grunn: data.grunn,
                });
                if (res.ok) {
                  await revalidatePostMottakFlyt(behandlingsreferanse);
                  onClose();
                }
              });
            })}
            className={styles.settBehandlingPåVentModalForm}
          >
            <FormField form={form} formField={formFields.begrunnelse} />
            <FormField form={form} formField={formFields.frist} />
            <FormField form={form} formField={formFields.grunn} />
          </form>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button form={'settBehandlingPåVent'} loading={isPending}>
          Sett på vent
        </Button>
        <Button variant={'secondary'} onClick={onClose}>
          Avbryt
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
