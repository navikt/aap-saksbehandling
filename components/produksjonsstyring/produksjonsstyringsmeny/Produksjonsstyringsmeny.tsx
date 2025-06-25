'use client';

import { Heading, HStack, Tabs, VStack } from '@navikt/ds-react';
import { useState } from 'react';
import { AlleFiltereProvider } from 'components/produksjonsstyring/allefiltereprovider/AlleFiltereProvider';
import { TotaloversiktBehandlinger } from 'components/produksjonsstyring/totaloversiktbehandlinger/TotaloversiktBehandlinger';
import { MinEnhet } from 'components/produksjonsstyring/minenhet/MinEnhet';
import { Enhet } from 'lib/types/oppgaveTypes';

interface Props {
  enheter: Enhet[];
}

type MenyValg = 'Totaloversikt' | 'Min enhet';

const options: MenyValg[] = ['Totaloversikt', 'Min enhet'];

export const Produksjonsstyringsmeny = ({ enheter }: Props) => {
  const [selected, setSelected] = useState<MenyValg>('Totaloversikt');

  return (
    <AlleFiltereProvider>
      <VStack gap={'8'} padding={'8'} maxWidth={'1680px'} marginInline={'auto'} marginBlock={'0'}>
        <HStack gap={'4'} align={'center'}>
          <Heading level={'1'} size={'large'}>
            Produkssjonsstyring
          </Heading>
          <Tabs value={selected} onChange={(value) => setSelected(value as MenyValg)}>
            <Tabs.List>
              {options.map((option) => (
                <Tabs.Tab key={option} value={option} label={option} />
              ))}
            </Tabs.List>
          </Tabs>
        </HStack>

        {selected === 'Totaloversikt' && <TotaloversiktBehandlinger />}
        {selected === 'Min enhet' && <MinEnhet enheter={enheter} />}
      </VStack>
    </AlleFiltereProvider>
  );
};
