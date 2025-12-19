import { ExpansionCard } from '@navikt/ds-react';
import { InformationSquareFillIcon } from '@navikt/aksel-icons';

import styles from './ManglendeInstitusjonsOpphold.module.css';

export const ManglendeInstitusjonsOpphold = () => {
  return (
    <ExpansionCard size={'small'} aria-label={'Institusjonsopphold'} defaultOpen={true} className={styles.infobox}>
      <div className={styles.content}>
        <InformationSquareFillIcon />
        <span>
          Det finnes institusjonsopphold for bruker, men institusjonsoppholdet varer for kort til å gi reduksjon av AAP.
        </span>
      </div>
    </ExpansionCard>
  );
};
