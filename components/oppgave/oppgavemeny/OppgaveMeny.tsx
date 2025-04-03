'use client';

import { Chips, Heading, HStack, VStack } from '@navikt/ds-react';
import { Kort } from 'components/oppgave/kort/Kort';
import { OppgaveTabell } from 'components/oppgave/oppgavetabell/OppgaveTabell';
import { OppgaveKøMedOppgaver } from 'components/oppgave/oppgavekømedoppgaver/OppgaveKøMedOppgaver';
import { Oppgave } from 'lib/types/types';
import { Enhet } from 'lib/types/oppgaveTypes';
import { useState } from 'react';

interface Props {
  mineOppgaver: Oppgave[];
  enheter: Enhet[];
}
type MenyValg = 'Oppgavekøer' | 'Mine reserverte';

const options: MenyValg[] = ['Oppgavekøer', 'Mine reserverte'];
export const OppgaveMeny = ({ mineOppgaver, enheter }: Props) => {
  const [selected, setSelected] = useState<MenyValg>('Oppgavekøer');
  return (
    <VStack>
      <Kort>
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
      </Kort>
      <VStack gap={'4'}>
        {selected === 'Mine reserverte' && (
          <Kort>
            <OppgaveTabell
              heading={'Mine reserverte oppgaver'}
              oppgaver={mineOppgaver}
              visBehandleOgFrigiKnapp
              showDropdownActions
              showSortAndFilters
            />
          </Kort>
        )}
        {selected === 'Oppgavekøer' && <OppgaveKøMedOppgaver enheter={enheter} />}
      </VStack>
    </VStack>
  );
};
