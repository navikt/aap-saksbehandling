import React, { useState } from 'react';
import { useConfigForm } from 'components/form/FormHook';
import { ExclamationmarkTriangleIcon } from '@navikt/aksel-icons';
import styles from 'components/settbehandlingpåventmodal/SettBehandlingPåVentModal.module.css';
import { Button } from '@navikt/ds-react/Button';
import { Modal } from '@navikt/ds-react/Modal';
import { VStack } from '@navikt/ds-react/Stack';

import { revalidateBehandlingPath } from 'lib/actions/actions';
import { clientOpprettMarkeringHendelse, MarkeringHendelseType } from 'lib/clientApi';
import { MarkeringType } from 'lib/types/oppgaveTypes';
import { NoNavAapOppgaveMarkeringMarkeringDtoMarkeringType } from '@navikt/aap-oppgave-typescript-types';
import { FormField } from 'components/form/FormField';
import { isSuccess } from 'lib/utils/api';
import { useParamsMedType } from 'hooks/saksbehandling/BehandlingHook';
import { Alert } from 'components/alert/Alert';

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
  const { saksnummer, behandlingsreferanse } = useParamsMedType();

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
        'Brukeren har ikke statlig livsoppholdsytelse',
        'Vedtak er omgjort etter klage',
        'Avtalt med leder',
      ],
      rules: { required: 'Du må velge en årsak' },
    },
  });

  function onCloseClick() {
    form.reset();
    setError(undefined);
    onClose();
  }

  return (
    <Modal
      open={isOpen}
      onClose={onCloseClick}
      header={markeringTypeTilOverskrift(type)}
      className={styles.settBehandlingPåVentModal}
    >
      <Modal.Body>
        <VStack gap={'space-16'}>
          {isOpen && (
            <form
              id={'settMarkeringPåBehandling'}
              onSubmit={form.handleSubmit(async (data) => {
                setIsLoading(true);

                const res = await clientOpprettMarkeringHendelse(referanse, {
                  begrunnelse:
                    markeringsType === NoNavAapOppgaveMarkeringMarkeringDtoMarkeringType.HASTER
                      ? data.hasteBegrunnelse
                      : data.begrunnelse,
                  markeringType: markeringsType,
                  hendelseType: MarkeringHendelseType.OPPRETTET,
                });

                if (isSuccess(res)) {
                  await revalidateBehandlingPath(saksnummer, behandlingsreferanse);
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
          {error && <Alert variant={'error'}>{error}</Alert>}
        </VStack>
      </Modal.Body>
      <Modal.Footer>
        <Button form={'settMarkeringPåBehandling'} className={'fit-content'} loading={isLoading}>
          Sett markering
        </Button>
        <Button variant={'secondary'} onClick={onCloseClick}>
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
    case 'AVSLAG_11_5':
      return NoNavAapOppgaveMarkeringMarkeringDtoMarkeringType.AVSLAG_11_5;
    default:
      return NoNavAapOppgaveMarkeringMarkeringDtoMarkeringType.HASTER;
  }
};

const markeringTypeTilOverskrift = (type: MarkeringType) => {
  switch (type) {
    case 'HASTER':
      return { heading: 'Marker behandling som haster', icon: <ExclamationmarkTriangleIcon /> };
  }
};
