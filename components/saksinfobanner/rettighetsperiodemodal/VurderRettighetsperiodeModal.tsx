import { Alert, BodyLong, Button, Modal, VStack } from '@navikt/ds-react';
import { useRouter } from 'next/navigation';

import { DetaljertBehandling, NyÅrsakTilBehandlingV0 } from 'lib/types/types';

import { useSendHendelseOgVentPåProsessering } from 'hooks/saksbehandling/SendHendelseOgVentPåProsessering';
import styles from './VurderRettighetsperiodeModal.module.css';
import { Behovstype } from 'lib/utils/form';
import { v4 as uuid } from 'uuid';
import { useConfigForm } from 'components/form/FormHook';
import { FormField } from 'components/form/FormField';
import { FormEvent } from 'react';

interface Props {
  saksnummer: string;
  behandling?: DetaljertBehandling;
  behandlingReferanse: string;
  isOpen: boolean;
  onClose: () => void;
}

interface FormFields {
  begrunnelse: string;
}

export const VurderRettighetsperiodeModal = ({
  saksnummer,
  behandling,
  behandlingReferanse,
  isOpen,
  onClose,
}: Props) => {
  const { isLoading, sendHendelseOgVentPåProsessering, sendHendelseError } = useSendHendelseOgVentPåProsessering();
  const router = useRouter();
  const harAlleredeAvklaringsbehovForVurderingAvRettighetsperiode = behandling?.avklaringsbehov?.some(
    (it) => it.definisjon.kode === Behovstype.VURDER_RETTIGHETSPERIODE && it.status === 'AVSLUTTET'
  );

  const { formFields, form } = useConfigForm<FormFields>({
    begrunnelse: {
      type: 'textarea',
      label: 'Kommentar til saksbehandler',
      defaultValue: '',
      rules: { required: 'Du må gi en kommentar til saksbehandler' },
    },
  });

  const onBekreft = (event: FormEvent<HTMLFormElement>) => {
    if (harAlleredeAvklaringsbehovForVurderingAvRettighetsperiode) {
      router.push(`/saksbehandling/sak/${saksnummer}/${behandlingReferanse}/RETTIGHETSPERIODE`);
      onClose();
    } else {
      form.handleSubmit((data) => {
        sendHendelseOgVentPåProsessering(
          saksnummer,
          {
            saksnummer: saksnummer,
            referanse: {
              type: 'SAKSBEHANDLER_KELVIN_REFERANSE',
              verdi: uuid(),
            },
            type: 'NY_ÅRSAK_TIL_BEHANDLING',
            kanal: 'DIGITAL',
            mottattTidspunkt: new Date().toISOString(),
            melding: {
              meldingType: 'NyÅrsakTilBehandlingV0',
              årsakerTilBehandling: ['VURDER_RETTIGHETSPERIODE'],
              beskrivelse: data.begrunnelse,
              behandlingReferanse: behandlingReferanse,
            } satisfies NyÅrsakTilBehandlingV0,
          },
          onClose
        );
      })(event);
    }
  };

  return (
    <Modal
      header={{
        heading: 'Vurder § 22-13 syvende ledd. Første mulige dato med rett på ytelse ',
      }}
      open={isOpen}
      onClose={onClose}
      className={styles.modal}
    >
      <form onSubmit={onBekreft}>
        <Modal.Body>
          <VStack gap="4">
            <BodyLong size="medium">
              Dersom søker kan ha rett på AAP før søknadstidspunktet kan første mulige dato med rett på ytelse
              overstyres. NAY får en oppgave for å vurdere riktig dato etter § 22-13 syvende ledd
            </BodyLong>
            <BodyLong>Tilbakedatering av søknadsdato etter § 22-13 5. ledd må gjøres i postmottak</BodyLong>
            <FormField form={form} formField={formFields.begrunnelse} size="medium" />
            {sendHendelseError && (
              <Alert variant={'error'} size={'small'}>
                {sendHendelseError.message}
              </Alert>
            )}
          </VStack>
        </Modal.Body>
        <Modal.Footer>
          <Button type={'submit'} className={'fit-content'} loading={isLoading}>
            Bekreft
          </Button>
          <Button variant={'secondary'} onClick={onClose} type="button">
            Avbryt
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};
