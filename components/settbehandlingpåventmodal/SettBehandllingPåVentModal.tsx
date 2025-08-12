'use client';

import React, { useEffect, useState } from 'react';
import { Alert, Box, Button, Modal, VStack } from '@navikt/ds-react';
import { formaterDatoForBackend } from 'lib/utils/date';
import { clientSettBehandlingPåVent } from 'lib/clientApi';
import { revalidateFlyt } from 'lib/actions/actions';

import styles from './SettBehandlingPåVentModal.module.css';
import { HourglassBottomFilledIcon } from '@navikt/aksel-icons';
import { SettPåVentÅrsaker } from 'lib/types/types';
import { parse } from 'date-fns';
import { FormField, ValuePair } from 'components/form/FormField';
import { useConfigForm } from 'components/form/FormHook';
import { erDatoIFremtiden, validerDato } from 'lib/validation/dateValidation';
import { useFlyt } from 'hooks/saksbehandling/FlytHook';

interface Props {
  referanse: string;
  reservert: boolean;
  isOpen: boolean;
  onClose: () => void;
}

interface FormFields {
  begrunnelse: string;
  frist: string;
  grunn: SettPåVentÅrsaker;
}

export const SettBehandllingPåVentModal = ({ referanse, reservert, isOpen, onClose }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const { flyt } = useFlyt();

  const grunnOptions: ValuePair<SettPåVentÅrsaker>[] = [
    { label: 'Venter på medisinske opplysninger', value: 'VENTER_PÅ_MEDISINSKE_OPPLYSNINGER' },
    { label: 'Venter på opplysninger', value: 'VENTER_PÅ_OPPLYSNINGER' },
    { label: 'Venter på vurdering fra rådgivende overlege', value: 'VENTER_PÅ_VURDERING_AV_ROL' },
    {
      label: 'Venter på opplysninger fra utenlandske myndigheter',
      value: 'VENTER_PÅ_OPPLYSNINGER_FRA_UTENLANDSKE_MYNDIGHETER',
    },
    { label: 'Venter på svar fra bruker', value: 'VENTER_PÅ_SVAR_FRA_BRUKER' },
    { label: 'Venter på svar på forhåndsvarsel', value: 'VENTER_PÅ_SVAR_PÅ_FORHÅNDSVARSEL' },
    { label: 'Venter på manglende funksjonalitet', value: 'VENTER_PÅ_FUNKSJONALITET' },
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
      rules: {
        required: 'Du må sette en frist',
        validate: (value) => {
          const valideringsresultat = validerDato(value as string);
          if (valideringsresultat) {
            return valideringsresultat;
          }

          if (!erDatoIFremtiden(value)) {
            return 'Datoen kan ikke være tilbake i tid.';
          }
        },
      },
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
    setError(undefined);
  }, [isOpen, form]);

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      header={{ heading: 'Sett behandling på vent', icon: <HourglassBottomFilledIcon /> }}
      className={styles.settBehandlingPåVentModal}
    >
      <Modal.Body>
        <VStack gap={'4'}>
          {isOpen && (
            <form
              id={'settBehandlingPåVent'}
              onSubmit={form.handleSubmit(async (data) => {
                setIsLoading(true);
                if (!flyt?.behandlingVersjon) {
                  setError('Behandlingsversjon finnes ikke');
                  return;
                }

                const res = await clientSettBehandlingPåVent(referanse, {
                  begrunnelse: data.begrunnelse,
                  behandlingVersjon: flyt.behandlingVersjon,
                  frist: formaterDatoForBackend(parse(data.frist, 'dd.MM.yyyy', new Date())),
                  grunn: data.grunn,
                });

                if (res.type === 'SUCCESS') {
                  await revalidateFlyt(referanse);
                  onClose();
                } else {
                  setError(res.apiException.message);
                }

                setIsLoading(false);
              })}
              className={'flex-column'}
              autoComplete={'off'}
            >
              {!reservert && (
                <Box marginBlock={'0 2'}>
                  <Alert variant={'info'} size={'small'}>
                    Behandlingen er ikke reservert. Når du setter den på vent, blir den reservert deg.
                  </Alert>
                </Box>
              )}
              <FormField form={form} formField={formFields.begrunnelse} />
              <FormField form={form} formField={formFields.frist} />
              <FormField form={form} formField={formFields.grunn} />
            </form>
          )}
          {error && (
            <Alert variant={'error'} size={'small'}>
              {error}
            </Alert>
          )}
        </VStack>
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
