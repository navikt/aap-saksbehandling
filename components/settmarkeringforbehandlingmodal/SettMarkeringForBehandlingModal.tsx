import { ExclamationmarkTriangleIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, Dialog, HStack, Link, VStack } from '@navikt/ds-react';
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

  const avtaltMellomLedereLabel = 'Avtalt mellom ledere';
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
        avtaltMellomLedereLabel,
      ],
      rules: { required: 'Du må velge en årsak' },
    },
  });

  function onCloseClick() {
    form.reset();
    setError(undefined);
    onClose();
  }

  const avtaltMellomLedereValgt = form.watch('hasteBegrunnelse') === avtaltMellomLedereLabel;

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
                {markeringsType === 'HASTER' && (
                  <BodyShort>
                    Det er viktig at behandlingen ikke blir markert som “haster” for tidlig, altså før brukeren fyller
                    kriteriene i rutinene:{' '}
                    <Link
                      href={
                        'https://navno.sharepoint.com/sites/fag-og-ytelser-arbeid-arbeidsavklaringspenger/SitePages/Rutine-for-Kelvin---Trekke-s%C3%B8knad.aspx'
                      }
                      target="_blank"
                      rel="noopener noreferrer"
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
                    {`Før du markerer oppgaven som haster med årsak “${avtaltMellomLedereLabel}” skal leder på Nav-kontoret og i Nav arbeid og ytelser ha snakket sammen og avtalt dette.`}
                  </Alert>
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
      return {
        heading: 'Marker behandling som haster',
        icon: <ExclamationmarkTriangleIcon fontSize={'1.5rem'} aria-hidden />,
      };
    default:
      return {
        heading: 'Sett markering på behandling',
        icon: <ExclamationmarkTriangleIcon fontSize={'1.5rem'} aria-hidden />,
      };
  }
};
