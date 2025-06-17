'use client';
import { BodyShort, Button } from '@navikt/ds-react';
import { clientSendHendelse } from 'lib/clientApi';
import { useConfigForm } from 'components/form/FormHook';
import { FormEvent } from 'react';
import { FormField } from 'components/form/FormField';

interface FormFields {
  kildereferanse: string;
}

export function DummyKabalEvent({
  saksnummer,
  klagebehandlinger,
}: {
  saksnummer: string;
  klagebehandlinger: string[];
}) {
  const { form, formFields } = useConfigForm<FormFields>(
    {
      kildereferanse: {
        type: 'combobox',
        label: 'Velg klagebehandlingen hendelsen er relatert til',
        rules: { required: 'Du må velge behandling' },
        options: klagebehandlinger.map((behandling) => ({
          label: behandling,
          value: behandling,
        })),
        defaultValue: undefined,
      },
    },
    { readOnly: false }
  );

  async function publiserKabalEvent(kildereferanse: string) {
    const reqBody = {
      saksnummer: saksnummer,
      referanse: {
        type: 'KABAL_HENDELSE_ID',
        verdi: '285e66ae-7e05-4e01-bec3-932bd1312226',
      },
      type: 'KABAL_HENDELSE',
      kanal: 'DIGITAL',
      mottattTidspunkt: '2025-06-17T08:03:33.191913',
      melding: {
        meldingType: 'KabalHendelseV0',
        eventId: '285e66ae-7e05-4e01-bec3-932bd1312226',
        kildeReferanse: kildereferanse,
        kilde: 'KELVIN',
        kabalReferanse: 'kabalReferanse',
        type: 'KLAGEBEHANDLING_AVSLUTTET',
        detaljer: {
          klagebehandlingAvsluttet: {
            avsluttet: '2025-06-16T08:03:29.954401',
            utfall: 'MEDHOLD',
            journalpostReferanser: ['123', '345'],
          },
          ankebehandlingOpprettet: null,
          ankebehandlingAvsluttet: null,
          ankeITrygderettenbehandlingOpprettet: null,
          behandlingFeilregistrert: null,
          behandlingEtterTrygderettenOpphevetAvsluttet: null,
          omgjoeringskravbehandlingAvsluttet: null,
        },
      },
    };
    await clientSendHendelse(saksnummer, reqBody);
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      publiserKabalEvent(data.kildereferanse);
    })(event);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} id={'kabal-event'} autoComplete={'off'}>
        <FormField form={form} formField={formFields.kildereferanse} />
        <Button>Publiser kabalhendelse</Button>
      </form>
      <BodyShort size={'small'}>(Refresh siden for å se om det gikk bra)</BodyShort>
    </div>
  );
}
