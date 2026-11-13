import { ExclamationmarkTriangleIcon } from '@navikt/aksel-icons';
import { Button, Dialog, HStack, VStack } from '@navikt/ds-react';
import { useParamsMedType } from 'hooks/saksbehandling/BehandlingHook';
import { revalidateBehandlingPath } from 'lib/actions/actions';
import { clientOpprettMarkeringHendelse } from 'lib/clientApi';
import type { MarkeringType } from 'lib/types/oppgaveTypes';
import { isSuccess } from 'lib/utils/api';
import React, { useState } from 'react';

import { Alert } from 'components/alert/Alert';
import { FormField } from 'components/form/FormField';
import { useConfigForm } from 'components/form/FormHook';

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
  const overskrift = markeringTypeTilOverskrift(type);
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
        'Avtalt mellom ledere',
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
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onCloseClick();
      }}
    >
      <Dialog.Popup width="large" closeOnOutsideClick={false}>
        <Dialog.Header>
          <Dialog.Title>
            <HStack as={'span'} gap={'space-4'} align={'center'}>
              {overskrift.icon}
              <span>{overskrift.heading}</span>
            </HStack>
          </Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>
          <VStack gap={'space-16'}>
            {isOpen && (
              <form
                id={'settMarkeringPåBehandling'}
                onSubmit={form.handleSubmit(async (data) => {
                  setIsLoading(true);

                  const res = await clientOpprettMarkeringHendelse(referanse, {
                    begrunnelse: markeringsType === 'HASTER' ? data.hasteBegrunnelse : data.begrunnelse,
                    markeringType: markeringsType,
                    hendelseType: 'OPPRETTET',
                  });

                  if (isSuccess(res)) {
                    await revalidateBehandlingPath(saksnummer, behandlingsreferanse);
                    onCloseClick();
                  } else {
                    setError(res.apiException.message);
                  }

                  setIsLoading(false);
                })}
                className={'flex-column'}
                autoComplete={'off'}
              >
                {markeringsType === 'HASTER' ? (
                  <FormField form={form} formField={formFields.hasteBegrunnelse} />
                ) : (
                  <FormField form={form} formField={formFields.begrunnelse} />
                )}
              </form>
            )}
            {error && <Alert variant={'error'}>{error}</Alert>}
          </VStack>
        </Dialog.Body>
        <Dialog.Footer>
          <Button form={'settMarkeringPåBehandling'} className={'fit-content'} loading={isLoading}>
            Sett markering
          </Button>
          <Button variant={'secondary'} onClick={onCloseClick}>
            Avbryt
          </Button>
        </Dialog.Footer>
      </Dialog.Popup>
    </Dialog>
  );
};

const markeringTypeTilEnum = (type: MarkeringType) => {
  switch (type) {
    case 'HASTER':
      return 'HASTER' satisfies MarkeringType;
    case 'AVSLAG_11_5':
      return 'AVSLAG_11_5' satisfies MarkeringType;
    default:
      return 'HASTER' satisfies MarkeringType;
  }
};

const markeringTypeTilOverskrift = (type: MarkeringType) => {
  switch (type) {
    case 'HASTER':
      return { heading: 'Marker behandling som haster',
        icon: <ExclamationmarkTriangleIcon fontSize={'1.5rem'} aria-hidden />, };
    default:
      return { heading: 'Sett markering på behandling',
        icon: <ExclamationmarkTriangleIcon fontSize={'1.5rem'} aria-hidden />, };
  }
};
