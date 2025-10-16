import React, { useEffect, useState } from 'react';
import { useConfigForm } from 'components/form/FormHook';
import { ExclamationmarkTriangleIcon } from '@navikt/aksel-icons';
import { BookIcon } from '@navikt/aksel-icons';
import styles from 'components/settbehandlingpåventmodal/SettBehandlingPåVentModal.module.css';
import { Alert, Button, Modal, VStack } from '@navikt/ds-react';

import { revalidateFlyt } from 'lib/actions/actions';
import { clientSettMarkeringForBehandling } from 'lib/clientApi';
import { MarkeringType } from 'lib/types/oppgaveTypes';
import { NoNavAapOppgaveMarkeringMarkeringDtoMarkeringType } from '@navikt/aap-oppgave-typescript-types';
import { FormField } from 'components/form/FormField';
import { isSuccess } from 'lib/utils/api';

interface Props {
  referanse: string;
  type: MarkeringType;
  isOpen: boolean;
  onClose: () => void;
}

interface FormFields {
  begrunnelse: string;
  hasteBegrunnelse: string;
}

export const SettMarkeringForBehandlingModal = ({ referanse, type, isOpen, onClose }: Props) => {
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const markeringsType = markeringTypeTilEnum(type);

  const { form, formFields } = useConfigForm<FormFields>({
    begrunnelse: {
      type: 'textarea',
      label: 'Skriv en begrunnelse',
      rules: { required: 'Du må gi en begrunnelse' },
    },
    hasteBegrunnelse: {
      type: 'select',
      label: 'Velg en årsak',
      options: [
        { label: '', value: '' },
        'Brukeren har ikke, eller mister snart, livsoppholdsytelse',
        'Vedtak er omgjort etter klage',
        'Avtalt med leder',
      ],
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
      header={markeringTypeTilOverskrift(type)}
      className={styles.settBehandlingPåVentModal}
    >
      <Modal.Body>
        <VStack gap={'4'}>
          {isOpen && (
            <form
              id={'settMarkeringPåBehandling'}
              onSubmit={form.handleSubmit(async (data) => {
                setIsLoading(true);

                const res = await clientSettMarkeringForBehandling(referanse, {
                  begrunnelse:
                    markeringsType === NoNavAapOppgaveMarkeringMarkeringDtoMarkeringType.HASTER
                      ? data.hasteBegrunnelse
                      : data.begrunnelse,
                  markeringType: markeringsType,
                });

                if (isSuccess(res)) {
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
              {markeringsType === NoNavAapOppgaveMarkeringMarkeringDtoMarkeringType.HASTER ? (
                <FormField form={form} formField={formFields.hasteBegrunnelse} />
              ) : (
                <FormField form={form} formField={formFields.begrunnelse} />
              )}
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
        <Button form={'settMarkeringPåBehandling'} className={'fit-content'} loading={isLoading}>
          Sett markering
        </Button>
        <Button variant={'secondary'} onClick={onClose}>
          Avbryt
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const markeringTypeTilEnum = (type: MarkeringType) => {
  switch (type) {
    case 'HASTER':
      return NoNavAapOppgaveMarkeringMarkeringDtoMarkeringType.HASTER;
    case 'KREVER_SPESIALKOMPETANSE':
      return NoNavAapOppgaveMarkeringMarkeringDtoMarkeringType.KREVER_SPESIALKOMPETANSE;
    default:
      return NoNavAapOppgaveMarkeringMarkeringDtoMarkeringType.HASTER;
  }
};

const markeringTypeTilOverskrift = (type: MarkeringType) => {
  switch (type) {
    case 'HASTER':
      return { heading: 'Marker behandling som haster', icon: <ExclamationmarkTriangleIcon /> };
    case 'KREVER_SPESIALKOMPETANSE':
      return { heading: 'Marker behandlingen med krever spesialkompetanse', icon: <BookIcon /> };
  }
};
