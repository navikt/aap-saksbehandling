'use server';

import styles from 'app/sak/[saksId]/aktivitet/page.module.css';
import { Aktivitetsplikt } from 'components/aktivitetsplikt/Aktivitetsplikt';

export const AktivitetspliktMedDatafetching = async () => {
  return (
    <div className={styles.aktivitetSkjema}>
      <Aktivitetsplikt />
    </div>
  );
};
