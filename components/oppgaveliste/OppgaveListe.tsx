'use client';

import { HStack, Heading, Tabs, VStack } from '@navikt/ds-react';
import { TildelOppgaverProvider } from 'context/oppgave/TildelOppgaverContext';
import { useLagreAktivTab } from 'hooks/oppgave/aktivTabHook';
import { Enhet } from 'lib/types/oppgaveTypes';
import { useEffect, useState } from 'react';

import { AlleOppgaver } from 'components/oppgaveliste/alleoppgaver/AlleOppgaver';
import { LedigeOppgaver } from 'components/oppgaveliste/ledigeoppgaver/LedigeOppgaver';
import { MineOppgaver } from 'components/oppgaveliste/mineoppgaver/MineOppgaver';

interface Props {
  enheter: Enhet[];
}

type MenyValg = 'Ledige oppgaver' | 'Mine oppgaver' | 'Alle oppgaver';

const options: MenyValg[] = ['Ledige oppgaver', 'Mine oppgaver', 'Alle oppgaver'];

export const OppgaveListe = ({ enheter }: Props) => {
  const { lagreAktivTab, hentAktivTab } = useLagreAktivTab<MenyValg>();
  const [selected, setSelected] = useState<MenyValg>('Mine oppgaver');

  useEffect(() => {
    const lagretTab = hentAktivTab();
    if (lagretTab) {
      setSelected(lagretTab);
    }
  }, [hentAktivTab]);

  return (
    <VStack gap={'space-32'} padding={'space-32'} maxWidth={'1680px'} marginInline={'auto'} marginBlock={'space-0'}>
      <TildelOppgaverProvider>
        <HStack gap={'space-16'} align={'center'}>
          <Heading level={'1'} size={'large'}>
            Oppgaver
          </Heading>
          <Tabs
            value={selected}
            onChange={(value) => {
              setSelected(value as MenyValg);
              lagreAktivTab(value as MenyValg);
            }}
          >
            <Tabs.List>
              {options.map((option) => (
                <Tabs.Tab key={option} value={option} label={option} />
              ))}
            </Tabs.List>
          </Tabs>
        </HStack>

        {selected === 'Mine oppgaver' && <MineOppgaver />}
        {selected === 'Ledige oppgaver' && <LedigeOppgaver enheter={enheter} />}
        {selected === 'Alle oppgaver' && <AlleOppgaver enheter={enheter} />}
      </TildelOppgaverProvider>
    </VStack>
  );
};
