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
  noBorder?: boolean;
}
export const CustomExpandableCard = ({
  heading,
  children,
  expanded,
  setExpanded,
  editable,
  disabled,
  noBorder = false,
}: Props) => {
  return (
    <VStack
      gap={'4'}
      justify={'center'}
      className={`${styles.container} ${noBorder ? styles.noBorder :  ''}`}
      padding={'0'}
    >
      <button className={styles.headingButton} type="button" onClick={() => setExpanded(!expanded)}>
        <HGrid columns={'1fr 16px'} align={'center'} gap={'1'}>
          <HGrid columns={'16px 1fr'} align={'center'} gap={'1'}>
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
