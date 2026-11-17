import { ExclamationmarkTriangleIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, Link, Modal, VStack } from '@navikt/ds-react';
import { useParamsMedType } from 'hooks/saksbehandling/BehandlingHook';
import { revalidateBehandlingPath } from 'lib/actions/actions';
import { clientOpprettMarkeringHendelse } from 'lib/clientApi';
import type { MarkeringType } from 'lib/types/oppgaveTypes';
import { isSuccess } from 'lib/utils/api';
import React, { useState } from 'react';

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

  const avtaltMellomLedereValgt = form.watch('hasteBegrunnelse') === 'Avtalt mellom ledere';

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
                  begrunnelse: markeringsType === 'HASTER' ? data.hasteBegrunnelse : data.begrunnelse,
                  markeringType: markeringsType,
                  hendelseType: 'OPPRETTET',
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
              {markeringsType === 'HASTER' && (
                <BodyShort>
                  Det er viktig at behandlingen ikke blir markert som “haster” for tidlig, altså før brukeren fyller
                  kriteriene i rutinene:{' '}
                  <Link
                    href={
                      'https://navno.sharepoint.com/sites/fag-og-ytelser-arbeid-arbeidsavklaringspenger/SitePages/Rutine-for-Kelvin---Trekke-s%C3%B8knad.aspx'
                    }
                  >
                    Marker som haster (Navet)
                  </Link>
                </BodyShort>
              )}
              {markeringsType === 'HASTER' ? (
                <FormField form={form} formField={formFields.hasteBegrunnelse} />
              ) : (
                <FormField form={form} formField={formFields.begrunnelse} />
              )}
              {avtaltMellomLedereValgt && (
                <Alert variant={'warning'}>
                  Før du markerer oppgaven med haster med årsak “Avtalt mellom ledere” skal leder på Nav-kontoret og i
                  Nav arbeid og ytelser ha snakket sammen og avtalt dette.
                </Alert>
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
      return { heading: 'Marker behandling som haster', icon: <ExclamationmarkTriangleIcon /> };
  }
};
