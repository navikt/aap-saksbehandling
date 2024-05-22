'use client';

import styles from './page.module.css';
import { Button } from '@navikt/ds-react';
import { rekjørFeiledeOppgaver } from 'lib/clientApi';

const Page = () => {
  return (
    <main className={styles.main}>
      <Button size={'small'} onClick={async () => await rekjørFeiledeOppgaver()}>
        Rekjør feilede oppgaver
      </Button>
    </main>
  );
};

export default Page;
