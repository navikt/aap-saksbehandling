import { useState } from 'react';

import { Button, VStack } from '@navikt/ds-react';
import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';

import styles from './ReadOnly.module.css';

export const ReadOnly = ({ children }: { children: React.ReactNode }) => {
  const [showAll, toggleShowAll] = useState<boolean>(false);
  return (
    <div className={styles.readonlyWrapper}>
      <div className={showAll ? styles.readonlyExpanded : styles.readonlyHidden} style={{ position: 'relative' }}>
        {children}
      </div>
      <VStack>
        <Button
          variant={'tertiary'}
          onClick={() => toggleShowAll(!showAll)}
          icon={showAll ? <ChevronUpIcon aria-label="Skjul" /> : <ChevronDownIcon aria-label="Vis" />}
        />
      </VStack>
    </div>
  );
};
