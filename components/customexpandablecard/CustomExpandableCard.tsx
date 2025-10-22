'use client';

import { HGrid, VStack } from '@navikt/ds-react';
import { ReactNode, useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon, PadlockLockedIcon, PencilIcon } from '@navikt/aksel-icons';
import styles from './CustomExpandableCard.module.css';

interface Props {
  defaultOpen?: boolean;
  editable: boolean;
  heading: ReactNode;
  children: ReactNode;
}
export const CustomExpandableCard = ({ heading, children, defaultOpen = false, editable }: Props) => {
  const [expanded, setExpanded] = useState(defaultOpen);
  return (
    <VStack gap={'4'} className={styles.container}>
      <button className={styles.headingButton} type="button" onClick={() => setExpanded(!expanded)}>
        <HGrid columns={'1fr 16px'} align={'center'} gap={'1'}>
          <HGrid columns={'16px 1fr'} align={'center'} gap={'1'}>
            {editable ? <PencilIcon color={'black'} /> : <PadlockLockedIcon color={'black'} />}
            {heading}
          </HGrid>
          {expanded ? <ChevronUpIcon color={'black'} /> : <ChevronDownIcon color={'black'} />}
        </HGrid>
      </button>
      {expanded && <VStack style={{ paddingLeft: '1.6rem', paddingBottom: '1rem' }}>{children}</VStack>}
    </VStack>
  );
};
