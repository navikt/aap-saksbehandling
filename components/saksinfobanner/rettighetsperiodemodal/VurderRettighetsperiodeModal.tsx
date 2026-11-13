import { BodyLong, Button, Dialog, VStack } from '@navikt/ds-react';
import { useRouter } from 'next/navigation';

import { DetaljertBehandling, NyÅrsakTilBehandlingV0 } from 'lib/types/types';

import { useSendHendelseOgVentPåProsessering } from 'hooks/saksbehandling/SendHendelseOgVentPåProsessering';
import { Behovstype } from 'lib/utils/form';
import { useConfigForm } from 'components/form/FormHook';
import { FormField } from 'components/form/FormField';
import { SubmitEventHandler } from 'react';
import { Alert } from 'components/alert/Alert';

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

  const onBekreft: SubmitEventHandler = (event) => {
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
              verdi: crypto.randomUUID(),
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
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <Dialog.Popup width="large" closeOnOutsideClick={false}>
        <Dialog.Header>
          <Dialog.Title>Vurder § 22-13 syvende ledd. Første mulige dato med rett til ytelse</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>
          <form id="vurder-rettighetsperiode" onSubmit={onBekreft}>
            <VStack gap="space-16">
              <BodyLong size="medium">
                Dersom søker kan ha rett til AAP før søknadstidspunktet kan første mulige dato med rett til ytelse
                overstyres. NAY får en oppgave for å vurdere riktig dato etter § 22-13 syvende ledd.
              </BodyLong>
              <BodyLong>Tilbakedatering av søknadsdato etter § 22-13 5. ledd må gjøres i postmottak.</BodyLong>
              <FormField form={form} formField={formFields.begrunnelse} size="medium" />
              {sendHendelseError && <Alert variant={'error'}>{sendHendelseError.message}</Alert>}
            </VStack>
          </form>
        </Dialog.Body>
        <Dialog.Footer>
          <Button type={'submit'} form="vurder-rettighetsperiode" className={'fit-content'} loading={isLoading}>
            Bekreft
          </Button>
          <Button variant={'secondary'} onClick={onClose} type="button">
            Avbryt
          </Button>
        </Dialog.Footer>
      </Dialog.Popup>
    </Dialog>
  );
};
