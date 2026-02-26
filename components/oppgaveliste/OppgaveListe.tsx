'use client';

import { useEffect, useState } from 'react';
import { Heading, HStack, Tabs, VStack } from '@navikt/ds-react';
import { Enhet } from 'lib/types/oppgaveTypes';
import { MineOppgaverNy } from 'components/oppgaveliste/mineoppgaverny/MineOppgaverNy';
import { LedigeOppgaverNy } from 'components/oppgaveliste/ledigeoppgaverny/LedigeOppgaverNy';
import { AlleOppgaver } from 'components/oppgaveliste/alleoppgaver/AlleOppgaver';
import { useLagreAktivTab } from 'hooks/oppgave/aktivTabHook';
import { TildelOppgaverProvider } from 'context/oppgave/TildelOppgaverContext';
import { useFeatureFlag } from 'context/UnleashContext';
import { AlleOppgaverNy } from 'components/oppgaveliste/alleoppgaverny/AlleOppgaverNy';
import { MineOppgaver } from 'components/oppgaveliste/mineoppgaver/MineOppgaver';
import { LedigeOppgaver } from 'components/oppgaveliste/ledigeoppgaver/LedigeOppgaver';

interface Props {
  enheter: Enhet[];
}

type MenyValg = 'Ledige oppgaver' | 'Mine oppgaver' | 'Alle oppgaver';

const options: MenyValg[] = ['Ledige oppgaver', 'Mine oppgaver', 'Alle oppgaver'];

export const OppgaveListe = ({ enheter }: Props) => {
  const { lagreAktivTab, hentAktivTab } = useLagreAktivTab();
  const [selected, setSelected] = useState<MenyValg>('Mine oppgaver');

  useEffect(() => {
    const lagretTab = hentAktivTab();
    if (lagretTab) {
      setSelected(lagretTab as MenyValg);
    }
  }, [hentAktivTab]);
  const backendSorteringEnabled = useFeatureFlag('OppgavelisteBackendsorteringFrontend');
  return (
    <VStack gap={'8'} padding={'8'} maxWidth={'1680px'} marginInline={'auto'} marginBlock={'0'}>
      <TildelOppgaverProvider>
        <HStack gap={'4'} align={'center'}>
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

        {selected === 'Mine oppgaver' && backendSorteringEnabled && <MineOppgaverNy />}
        {selected === 'Mine oppgaver' && !backendSorteringEnabled && <MineOppgaver />}
        {selected === 'Ledige oppgaver' && backendSorteringEnabled && <LedigeOppgaverNy enheter={enheter} />}
        {selected === 'Ledige oppgaver' && !backendSorteringEnabled && <LedigeOppgaver enheter={enheter} />}
        {selected === 'Alle oppgaver' && backendSorteringEnabled && <AlleOppgaverNy enheter={enheter} />}
        {selected === 'Alle oppgaver' && !backendSorteringEnabled && <AlleOppgaver enheter={enheter} />}
      </TildelOppgaverProvider>
    </VStack>
  );
};
