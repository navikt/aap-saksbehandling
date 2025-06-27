'use client';
import { BodyShort, Button } from '@navikt/ds-react';
import { clientSendHendelse } from 'lib/clientApi';
import { useConfigForm } from 'components/form/FormHook';
import { FormEvent } from 'react';
import { FormField } from 'components/form/FormField';
import { KabalBehandlingDetaljer, KabalSvarType } from 'lib/types/types';
import { uuidv4 } from 'unleash-client/lib/uuidv4';

interface FormFields {
  kildereferanse: string;
  type: KabalSvarType;
}

const utledDetaljerFraType = (type: KabalSvarType): KabalBehandlingDetaljer => {
  const tomtResultat: any = {
    ankebehandlingOpprettet: null,
    ankebehandlingAvsluttet: null,
    ankeITrygderettenbehandlingOpprettet: null,
    behandlingFeilregistrert: null,
    behandlingEtterTrygderettenOpphevetAvsluttet: null,
    omgjoeringskravbehandlingAvsluttet: null,
    klagebehandlingAvsluttet: null,
  };
  switch (type) {
    case 'KLAGEBEHANDLING_AVSLUTTET':
      return {
        ...tomtResultat,
        klagebehandlingAvsluttet: {
          avsluttet: '2025-06-16T08:03:29.954401',
          utfall: 'MEDHOLD',
          journalpostReferanser: ['123', '345'],
        },
      };
    case 'ANKEBEHANDLING_OPPRETTET':
      return {
        ...tomtResultat,
        ankebehandlingOpprettet: {
          mottattKlageinstans: '2025-06-16T08:03:29.954401',
        },
      };
    case 'BEHANDLING_FEILREGISTRERT':
      return {
        ...tomtResultat,
        behandlingFeilregistrert: {
          type: 'KLAGE',
          navIdent: 'AB1234',
          feilregistrert: '2025-06-16T08:03:29.954401',
          reason:
            'Noe tekst som begrunner hvorfor behandlingen er feilregistrert. Noe tekst som begrunner hvorfor behandlingen er feilregistrert. Noe tekst som begrunner hvorfor behandlingen er feilregistrert. Noe tekst som begrunner hvorfor behandlingen er feilregistrert. ',
        },
      };
    case 'BEHANDLING_ETTER_TRYGDERETTEN_OPPHEVET_AVSLUTTET':
      return {
        ...tomtResultat,
        behandlingEtterTrygderettenOpphevetAvsluttet: {
          avsluttet: '2025-06-16T08:03:29.954401',
          utfall: 'STADFESTELSE',
          journalpostReferanser: [],
        },
      };
    case 'OMGJOERINGSKRAVBEHANDLING_AVSLUTTET':
      return {
        ...tomtResultat,
        omgjoeringskravbehandlingAvsluttet: {
          avsluttet: '2025-06-16T08:03:29.954401',
          utfall: 'MEDHOLD_ETTER_FVL_35',
          journalpostReferanser: [],
        },
      };
    case 'ANKE_I_TRYGDERETTENBEHANDLING_OPPRETTET':
      return {
        ...tomtResultat,
        ankeITrygderettenbehandlingOpprettet: {
          sendtTilTrygderetten: '2025-06-16T08:03:29.954401',
          utfall: 'INNSTILLING_STADFESTELSE',
        },
      };
    case 'ANKEBEHANDLING_AVSLUTTET':
      return {
        ...tomtResultat,
        ankebehandlingAvsluttet: {
          avsluttet: '2025-06-16T08:03:29.954401',
          utfall: 'STADFESTELSE',
          journalpostReferanser: [],
        },
      };
  }
};

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
      type: {
        type: 'combobox',
        label: 'Velg type hendelse',
        rules: { required: 'Du må velge type' },
        options: [
          'KLAGEBEHANDLING_AVSLUTTET',
          'ANKEBEHANDLING_OPPRETTET',
          'BEHANDLING_FEILREGISTRERT',
          'BEHANDLING_ETTER_TRYGDERETTEN_OPPHEVET_AVSLUTTET',
          'OMGJOERINGSKRAVBEHANDLING_AVSLUTTET',
          'ANKE_I_TRYGDERETTENBEHANDLING_OPPRETTET',
          'ANKEBEHANDLING_AVSLUTTET',
        ],
        defaultValue: undefined,
      },
    },
    { readOnly: false }
  );

  async function publiserKabalEvent(kildereferanse: string, type: KabalSvarType) {
    const id = uuidv4();
    const reqBody = {
      saksnummer: saksnummer,
      referanse: {
        type: 'KABAL_HENDELSE_ID',
        verdi: id,
      },
      type: 'KABAL_HENDELSE',
      kanal: 'DIGITAL',
      mottattTidspunkt: '2025-06-17T08:03:33.191913',
      melding: {
        meldingType: 'KabalHendelseV0',
        eventId: id,
        kildeReferanse: kildereferanse,
        kilde: 'KELVIN',
        kabalReferanse: 'kabalReferanse',
        type: type,
        detaljer: utledDetaljerFraType(type),
      },
    };
    await clientSendHendelse(saksnummer, reqBody);
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      publiserKabalEvent(data.kildereferanse, data.type);
    })(event);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} id={'kabal-event'} autoComplete={'off'}>
        <FormField form={form} formField={formFields.kildereferanse} />
        <FormField form={form} formField={formFields.type} />
        <Button>Publiser kabalhendelse</Button>
      </form>
      <BodyShort size={'small'}>(Refresh siden for å se om det gikk bra)</BodyShort>
    </div>
  );
}
