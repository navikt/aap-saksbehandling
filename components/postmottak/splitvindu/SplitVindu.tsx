'use client';

import { Button, HGrid, HStack } from '@navikt/ds-react';
import { ReactNode, useState } from 'react';
import styles from './SplitVindu.module.css';
import { ExpandIcon, SidebarLeftFillIcon } from '@navikt/aksel-icons';

interface Props {
  dokumentvisning: ReactNode;
  children: ReactNode;
}
export const SplitVindu = ({ dokumentvisning, children }: Props) => {
  const [is3070Split, setIs3070Split] = useState<boolean>(false);
  return (
    <HGrid columns={is3070Split ? '1fr 2fr' : '1fr 1fr'} gap={'4'} className={styles.splitVindu}>
      <div>
        <HStack justify={'end'} paddingInline={'4'}>
          <Button
            variant={'secondary'}
            size={'small'}
            icon={is3070Split ? <ExpandIcon /> : <SidebarLeftFillIcon />}
            type={'button'}
            onClick={() => setIs3070Split(!is3070Split)}
          />
        </HStack>
        {children}
      </div>
      {dokumentvisning}
    </HGrid>
  );
};
