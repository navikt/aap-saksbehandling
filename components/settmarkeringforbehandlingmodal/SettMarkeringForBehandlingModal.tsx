import { ExclamationmarkTriangleIcon } from '@navikt/aksel-icons';
import { Button, Modal, VStack } from '@navikt/ds-react';
import { useParamsMedType } from 'hooks/saksbehandling/BehandlingHook';
import { revalidateBehandlingPath } from 'lib/actions/actions';
import { clientOpprettMarkeringHendelse } from 'lib/clientApi';
import {
  MarkeringType,
  OpprettMarkeringDto,
  OpprettMarkeringHendelseType,
  OpprettMarkeringType,
} from 'lib/types/oppgaveTypes';
import { isSuccess } from 'lib/utils/api';
import { useState } from 'react';

import { Alert } from 'components/alert/Alert';
import { FormField } from 'components/form/FormField';
import { useConfigForm } from 'components/form/FormHook';
import styles from 'components/settbehandlingpåventmodal/SettBehandlingPåVentModal.module.css';

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
                  begrunnelse: type === MarkeringType.HASTER ? data.hasteBegrunnelse : data.begrunnelse,
                  markeringType: mapTilOpprettMarkeringType(type),
                  hendelseType: OpprettMarkeringHendelseType.OPPRETTET,
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
              {type === MarkeringType.HASTER ? (
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

function mapTilOpprettMarkeringType(type: MarkeringType): OpprettMarkeringDto['markeringType'] {
  switch (type) {
    case 'HASTER':
      return OpprettMarkeringType.HASTER;
    case 'AVSLAG_11_5':
      return OpprettMarkeringType.AVSLAG_11_5;
    default:
      return OpprettMarkeringType.HASTER;
  }
}

const markeringTypeTilOverskrift = (type: MarkeringType) => {
  switch (type) {
    case 'HASTER':
      return { heading: 'Marker behandling som haster', icon: <ExclamationmarkTriangleIcon /> };
  }
};
