'use client';

import styles from './page.module.css';
import { Button, Heading } from '@navikt/ds-react';
import { leggTilIYrkesskadeMock, rekjørFeiledeOppgaver } from 'lib/clientApi';
import { useConfigForm } from 'hooks/FormHook';
import { OpprettYrkesskadeTestCase } from 'lib/types/types';
import { FormField } from 'components/input/formfield/FormField';

const Page = () => {
  const { form, formFields } = useConfigForm<OpprettYrkesskadeTestCase>({
    ident: {
      type: 'text',
      label: 'ident',
    },
    yrkesskadeDato: {
      type: 'text',
      label: 'Dato for yrkesskade (yyyy-mm-dd)',
    },
  });
  return (
    <main className={styles.main}>
      <div>
        <Button size={'small'} onClick={async () => await rekjørFeiledeOppgaver()}>
          Rekjør feilede oppgaver
        </Button>
      </div>
      <form onSubmit={form.handleSubmit(leggTilIYrkesskadeMock)} className={styles.yrkesskadeMock}>
        <Heading size={'medium'} level={'2'}>
          Legg til yrkesskade i midlertidig testregister
        </Heading>
        <FormField form={form} formField={formFields.ident} />
        <FormField form={form} formField={formFields.yrkesskadeDato} />
        <div>
          <Button size={'small'}>Send inn</Button>
        </div>
      </form>
    </main>
  );
};

export default Page;
