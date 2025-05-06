'use client';

import { Heading, HStack, Tabs, VStack } from '@navikt/ds-react';
import { OppgaveKøMedOppgaver } from 'components/oppgave/oppgavekømedoppgaver/OppgaveKøMedOppgaver';
import { Enhet } from 'lib/types/oppgaveTypes';
import { useState } from 'react';
import { MineOppgaver } from 'components/oppgave/mineoppgaver/MineOppgaver';

interface Props {
  enheter: Enhet[];
}
type MenyValg = 'Ledige oppgaver' | 'Mine oppgaver';

const options: MenyValg[] = ['Ledige oppgaver', 'Mine oppgaver'];

export const OppgaveMeny = ({ enheter }: Props) => {
  const [selected, setSelected] = useState<MenyValg>('Ledige oppgaver');

  return (
    <VStack gap={'8'} padding={'8'} maxWidth={'1680px'} marginInline={'auto'} marginBlock={'0'}>
      <HStack gap={'4'} align={'center'}>
        <Heading level={'1'} size={'large'}>
          Oppgaver
        </Heading>
        <Tabs value={selected} onChange={(value) => setSelected(value as MenyValg)}>
          <Tabs.List>
            {options.map((option) => (
              <Tabs.Tab key={option} value={option} label={option} />
            ))}
          </Tabs.List>
        </Tabs>
      </HStack>
      {selected === 'Mine oppgaver' && <MineOppgaver />}
      {selected === 'Ledige oppgaver' && <OppgaveKøMedOppgaver enheter={enheter} />}
    </VStack>
  );
};
