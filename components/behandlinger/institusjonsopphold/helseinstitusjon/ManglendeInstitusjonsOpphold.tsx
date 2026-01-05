import { Alert } from '@navikt/ds-react';

import styles from './ManglendeInstitusjonsOpphold.module.css';

export const ManglendeInstitusjonsOpphold = () => {
  return (
    <Alert size={'small'} aria-label={'Institusjonsopphold'} variant={'info'} className={styles.infobox}>
      <div className={styles.content}>
        <span>Brukeren har et institusjonsopphold, men det varer for kort til at AAP kan reduseres.</span>
      </div>
    </Alert>
  );
};
