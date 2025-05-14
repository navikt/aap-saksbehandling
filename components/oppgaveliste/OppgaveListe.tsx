'use client';

import { MineOppgaver } from 'components/oppgaveliste/mineoppgaver/MineOppgaver';
import { LedigeOppgaver } from 'components/oppgaveliste/ledigeoppgaver/LedigeOppgaver';
import { useState } from 'react';
import { Heading, HStack, Tabs, VStack } from '@navikt/ds-react';
import { Enhet } from 'lib/types/oppgaveTypes';
import { AlleOppgaver } from 'components/oppgaveliste/alleoppgaver/AlleOppgaver';
import { isDev } from 'lib/utils/environment';

interface Props {
  enheter: Enhet[];
}

type MenyValg = 'Ledige oppgaver' | 'Mine oppgaver' | 'Alle oppgaver';

const options: MenyValg[] = isDev()
  ? ['Ledige oppgaver', 'Mine oppgaver', 'Alle oppgaver']
  : ['Ledige oppgaver', 'Mine oppgaver'];

export const OppgaveListe = ({ enheter }: Props) => {
  const [selected, setSelected] = useState<MenyValg>('Mine oppgaver');

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
      {selected === 'Ledige oppgaver' && <LedigeOppgaver enheter={enheter} />}
      {isDev() && selected === 'Alle oppgaver' && <AlleOppgaver enheter={enheter} />}
    </VStack>
  );
};
