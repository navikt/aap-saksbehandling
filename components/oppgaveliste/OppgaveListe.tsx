'use client';

import { useEffect, useState } from 'react';
import { Heading, HStack, Tabs, VStack } from '@navikt/ds-react';
import { Enhet } from 'lib/types/oppgaveTypes';
import { MineOppgaver } from 'components/oppgaveliste/mineoppgaver/MineOppgaver';
import { LedigeOppgaverNy } from 'components/oppgaveliste/ledigeoppgaver/LedigeOppgaverNy';
import { AlleOppgaverNy } from 'components/oppgaveliste/alleoppgaver/AlleOppgaverNy';
import { useLagreAktivTab } from 'hooks/oppgave/aktivTabHook';
import { TildelOppgaverProvider } from 'context/oppgave/TildelOppgaverContext';
import { AlleOppgaver } from 'components/oppgaveliste/alleoppgaver/AlleOppgaver';
import { LedigeOppgaver } from 'components/oppgaveliste/ledigeoppgaver/LedigeOppgaver';
import { toggles } from 'lib/utils/toggles';

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

        {selected === 'Mine oppgaver' && <MineOppgaver />}
        {selected === 'Ledige oppgaver' && !toggles.featureComboboxForValgAvEnheter && (
          <LedigeOppgaver enheter={enheter} />
        )}
        {selected === 'Ledige oppgaver' && toggles.featureComboboxForValgAvEnheter && (
          <LedigeOppgaverNy enheter={enheter} />
        )}
        {selected === 'Alle oppgaver' && !toggles.featureComboboxForValgAvEnheter && <AlleOppgaver enheter={enheter} />}
        {selected === 'Alle oppgaver' && toggles.featureComboboxForValgAvEnheter && (
          <AlleOppgaverNy enheter={enheter} />
        )}
      </TildelOppgaverProvider>
    </VStack>
  );
};
