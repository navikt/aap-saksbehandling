import { Button } from '@navikt/ds-react/Button';
import { BodyShort } from '@navikt/ds-react/Typography';
import { FormField } from 'components/form/FormField';
import { useConfigForm } from 'components/form/FormHook';
import { clientSendHendelse } from 'lib/clientApi';
import { MeldekortV0 } from 'lib/types/types';

const pad = (input: number): string => input.toString().padStart(2, '0');
const formaterDato = (dato: Date): string => `${dato.getFullYear()}-${pad(dato.getMonth() + 1)}-${pad(dato.getDate())}`;

interface DummyMeldekortForm {
  sendtDato: Date;
  timerArbeidet: number;
  mndStart: Date;
  mndSlutt: Date;
}

async function postMeldekort(saksid: string, data: DummyMeldekortForm) {
  const reqBody = {
    saksnummer: saksid,
    referanse: {
      type: 'JOURNALPOST',
      verdi: new Date().getTime(),
    },
    type: 'MELDEKORT',
    kanal: 'DIGITAL',
    mottattTidspunkt: data.sendtDato.toISOString(),
    melding: {
      meldingType: 'MeldekortV0',
      harDuArbeidet: data.timerArbeidet > 0,
      timerArbeidPerPeriode: [
        {
          fraOgMedDato: formaterDato(data.mndStart),
          tilOgMedDato: formaterDato(data.mndSlutt),
          timerArbeid: data.timerArbeidet,
        },
      ],
    } satisfies MeldekortV0,
  };
  await clientSendHendelse(saksid, reqBody);
}

export function DummyMeldekort({ saksid }: { saksid: string }) {
  const nå = new Date();
  const mndStart = new Date(nå.getFullYear(), nå.getMonth(), 1);
  const mndSlutt = new Date(nå.getFullYear(), nå.getMonth() + 1, 0);

  const { formFields, form } = useConfigForm<DummyMeldekortForm>({
    timerArbeidet: {
      type: 'number',
      defaultValue: '25.0',
    },
    mndSlutt: {
      type: 'date',
      defaultValue: mndSlutt,
    },
    mndStart: {
      type: 'date',
      defaultValue: mndStart,
    },
    sendtDato: {
      type: 'date',
      defaultValue: new Date(),
    },
  });

  return (
    <div>
      <form
        onSubmit={form.handleSubmit(async (data) => {
          await postMeldekort(saksid, data);
        })}
      >
        <Button>Send inn et meldekort</Button>
        <details>
          <FormField form={form} formField={formFields.sendtDato} />
          <FormField form={form} formField={formFields.timerArbeidet} />
          <FormField form={form} formField={formFields.mndStart} />
          <FormField form={form} formField={formFields.mndSlutt} />
        </details>
      </form>
      <BodyShort size={'small'}>(Refresh siden for å se om det gikk bra)</BodyShort>
    </div>
  );
}
