'use client';

import { Chips, Heading, HStack, VStack } from '@navikt/ds-react';
import { OppgaveKøMedOppgaver } from 'components/oppgave/oppgavekømedoppgaver/OppgaveKøMedOppgaver';
import { Enhet } from 'lib/types/oppgaveTypes';
import { useState } from 'react';
import { MineOppgaver } from 'components/oppgave/mineoppgaver/MineOppgaver';

interface Props {
  enheter: Enhet[];
}
type MenyValg = 'Oppgavekøer' | 'Mine oppgaver';

const options: MenyValg[] = ['Oppgavekøer', 'Mine oppgaver'];
export const OppgaveMeny = ({ enheter }: Props) => {
  const [selected, setSelected] = useState<MenyValg>('Oppgavekøer');
  return (
    <VStack gap={'8'} padding={'8'}>
      <HStack gap={'4'} align={'center'}>
        <Heading level={'1'} size={'large'}>
          Oppgaver
        </Heading>
        <Chips>
          {options.map((option) => (
            <Chips.Toggle
              key={option}
              checkmark={false}
              selected={selected === option}
              onClick={() => setSelected(option)}
            >
              {option}
            </Chips.Toggle>
          ))}
        </Chips>
      </HStack>
      {selected === 'Mine oppgaver' && <MineOppgaver />}
      {selected === 'Oppgavekøer' && <OppgaveKøMedOppgaver enheter={enheter} />}
    </VStack>
  );
};
