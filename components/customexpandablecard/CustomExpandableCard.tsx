'use client';

import { HStack, VStack } from '@navikt/ds-react';
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
        <HStack align={'center'} justify={'space-between'}>
          <HStack align={'center'} gap={'1'}>
            {editable ? <PencilIcon color={'black'} /> : <PadlockLockedIcon color={'black'} />}
            {heading}
          </HStack>
          {expanded ? <ChevronUpIcon color={'black'} /> : <ChevronDownIcon color={'black'} />}
        </HStack>
      </button>
      {expanded && <VStack>{children}</VStack>}
    </VStack>
  );
};
