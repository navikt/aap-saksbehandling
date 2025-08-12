'use client';

import styles from './OpprettSak.module.css';
import { JaEllerNei, JaEllerNeiOptions } from 'lib/utils/form';
import { useConfigForm } from 'components/form/FormHook';
import { FormField } from 'components/form/FormField';
import { Alert, Button } from '@navikt/ds-react';
import { useOpprettDummySak } from 'hooks/FetchHook';
import { OpprettDummySakDto } from 'lib/types/types';
import { mutate } from 'swr';
import { useState } from 'react';

interface OpprettSakFormFields {
  ident?: string;
  yrkesskade?: JaEllerNei;
  student?: JaEllerNei;
  medlemskap?: JaEllerNei;
}

interface OpprettSakAlert {
  id: number;
  fnr: string;
}

const OpprettTestSakSkjema = () => {
  const { isLoading, opprettSak, error } = useOpprettDummySak();
  const [opprettSakAlert, setOpprettSakAlert] = useState<OpprettSakAlert | null>(null);
  const [showError, setShowError] = useState(false);
  const { formFields, form } = useConfigForm<OpprettSakFormFields>({
    ident: {
      type: 'text',
      label: 'Fødselsnummer',
      rules: {
        required: 'Du må skrive inn et fødselsnummer',
        validate: (value) => {
          if (value == null || value.length == 0) {
            return 'Du må skrive inn et fødselsnummer';
          }
          if (!/^\d+$/.test(value)) {
            return 'Fødselsnummeret kan kun inneholde tall';
          }
          if (value.length !== 11) {
            return 'Fødselsnummeret må være 11 siffer';
          }
        },
      },
    },
    yrkesskade: {
      type: 'radio',
      label: 'Har yrkesskade?',
      defaultValue: JaEllerNei.Nei,
      options: JaEllerNeiOptions,
    },
    student: {
      type: 'radio',
      label: 'Er student?',
      defaultValue: JaEllerNei.Nei,
      options: JaEllerNeiOptions,
    },
    medlemskap: {
      type: 'radio',
      label: 'Har medlemskap folketrygden?',
      defaultValue: JaEllerNei.Ja,
      options: JaEllerNeiOptions,
    },
  });

  const handleSubmit = async (data: OpprettSakFormFields) => {
    try {
      const { ok } = await opprettSak(mapFormTilDto(data));
      if (opprettSakAlert) {
        setOpprettSakAlert(null);
        clearTimeout(opprettSakAlert.id);
      }
      if (ok) {
        setOpprettSakAlert({
          fnr: data.ident!!,
          id: window.setTimeout(() => {
            setOpprettSakAlert(null);
          }, 10000),
        });
        form.reset();
      } else {
        setShowError(true);
      }
    } catch {
      setShowError(true);
    }
    await mutate('api/sak/alle');
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className={styles.formTest}>
      <FormField form={form} formField={formFields.ident} className={styles.fnr} />
      <FormField form={form} formField={formFields.medlemskap} />
      <FormField form={form} formField={formFields.yrkesskade} />
      <FormField form={form} formField={formFields.student} />

      {showError && (
        <Alert fullWidth={true} contentMaxWidth={false} variant="error" closeButton onClose={() => setShowError(false)}>
          {error?.toString() ||
            'Noe gikk galt ved oppretting av testsaken. Vennligst sjekk at fødselsnummer er en gyldig testbruker og prøv igjen.'}
        </Alert>
      )}

      {opprettSakAlert && (
        <Alert
          fullWidth={true}
          contentMaxWidth={false}
          variant="success"
          closeButton
          onClose={() => {
            clearTimeout(opprettSakAlert?.id);
            setOpprettSakAlert(null);
          }}
        >
          En test-sak har blitt opprettet for bruker med fødselsnummer {opprettSakAlert.fnr}. Det kan ta opp mot et
          minutt før saken dukker opp i listen under, bruk gjerne knappen &#34;Refresh listen&#34; for å sjekke om saken
          er klar for behandling i Kelvin.
        </Alert>
      )}

      <Button className={'fit-content'} loading={isLoading}>
        Opprett testsak
      </Button>
    </form>
  );
};

function mapFormTilDto(data: OpprettSakFormFields): OpprettDummySakDto {
  return {
    harYrkesskade: data.yrkesskade === JaEllerNei.Ja,
    harMedlemskap: data.medlemskap === JaEllerNei.Ja,
    ident: data.ident!!,
    erStudent: data.student === JaEllerNei.Ja,
  };
}

export default OpprettTestSakSkjema;
