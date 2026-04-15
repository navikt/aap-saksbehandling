'use client';

import { HGrid, VStack } from '@navikt/ds-react';
import { ReactNode } from 'react';
import { ChevronDownIcon, ChevronUpIcon, CircleSlashIcon, PadlockLockedIcon, PencilIcon } from '@navikt/aksel-icons';
import styles from './CustomExpandableCard.module.css';

interface Props {
  defaultOpen?: boolean;
  editable: boolean;
  heading: ReactNode;
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
  children: ReactNode;
  disabled?: boolean;
}
export const CustomExpandableCard = ({ heading, children, expanded, setExpanded, editable, disabled }: Props) => {
  return (
    <VStack gap={"space-16"} justify={'center'} className={styles.container} padding={"space-0"}>
      <button className={styles.headingButton} type="button" onClick={() => setExpanded(!expanded)}>
        <HGrid columns={'1fr 16px'} align={'center'} gap={"space-4"}>
          <HGrid columns={'16px 1fr'} align={'center'} gap={"space-4"}>
            {disabled ? (
              <CircleSlashIcon color={'black'} />
            ) : editable ? (
              <PencilIcon color={'black'} />
            ) : (
              <PadlockLockedIcon color={'black'} />
            )}
            {heading}
          </HGrid>
          {expanded ? <ChevronUpIcon color={'black'} /> : <ChevronDownIcon color={'black'} />}
        </HGrid>
      </button>
      <VStack style={{ ...(!expanded ? { display: 'none' } : {}), paddingLeft: '1.6rem', paddingBottom: '1rem' }}>
        {children}
      </VStack>
    </VStack>
  );
};
