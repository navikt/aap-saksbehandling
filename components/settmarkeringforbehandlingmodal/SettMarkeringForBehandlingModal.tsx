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

interface Props {
  referanse: string;
  type: MarkeringType;
  isOpen: boolean;
  onClose: () => void;
}

// Fjerner begrunnelse-felt fra modal midlertidig
interface FormFields {
  begrunnelse: string;
}

export const SettMarkeringForBehandlingModal = ({ referanse, type, isOpen, onClose }: Props) => {
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  const { form } = useConfigForm<FormFields>({
    begrunnelse: {
      type: 'textarea',
      label: 'Skriv en begrunnelse',
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
              onSubmit={form.handleSubmit(async () => {
                setIsLoading(true);

                const res = await clientSettMarkeringForBehandling(referanse, {
                  markeringType: markeringTypeTilEnum(type),
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
            ></form>
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
