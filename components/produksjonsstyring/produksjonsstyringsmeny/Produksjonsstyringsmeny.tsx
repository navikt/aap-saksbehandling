'use client';

import { Tabs } from '@navikt/ds-react';
import { ReactNode } from 'react';
import styles from './Produksjonsstyringsmeny.module.css';
import { AlleFiltereProvider } from 'components/produksjonsstyring/allefiltereprovider/AlleFiltereProvider';

interface Props {
  totaloversikt: ReactNode;
  minenhet: ReactNode;
  produktivitet: ReactNode;
}
export const Produksjonsstyringsmeny = ({ totaloversikt, minenhet }: Props) => {
  return (
    <AlleFiltereProvider>
      <Tabs defaultValue="total" fill className={styles.produksjonsstyringsmeny}>
        <Tabs.List>
          <Tabs.Tab value="total" label="Totaloversikt" />
          <Tabs.Tab value="min-enhet" label="Min enhet" />
        </Tabs.List>
        <Tabs.Panel value="total">{totaloversikt}</Tabs.Panel>
        <Tabs.Panel value="min-enhet">{minenhet}</Tabs.Panel>
      </Tabs>
    </AlleFiltereProvider>
  );
};
