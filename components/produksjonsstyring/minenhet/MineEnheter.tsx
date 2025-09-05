'use client';

import { Box, Button, HGrid, HStack, VStack } from '@navikt/ds-react';
import { useState } from 'react';
import { FilterSamling } from '../filtersamling/FilterSamling';
import { BulletListIcon, MenuGridIcon } from '@navikt/aksel-icons';
import { Enhet } from 'lib/types/oppgaveTypes';
import { MinEnhetOppgaver } from 'components/produksjonsstyring/minenhet/minenhetoppgaver/MinEnhetOppgaver';
import { MinEnhetBehandlinger } from 'components/produksjonsstyring/minenhet/minenhetbehandlinger/MinEnhetBehandlinger';
import { EnheterSelect } from 'components/oppgaveliste/enheterselect/EnheterSelect';
import { useLagreAktiveEnheter } from 'hooks/oppgave/aktiveEnheterHook';

export type ComboOption = { label?: string; value: string };

interface Props {
  enheter: Array<Enhet>;
}

export const MineEnheter = ({ enheter }: Props) => {
  const { hentLagredeAktiveEnheter, lagreAktiveEnheter } = useLagreAktiveEnheter();

  const [listeVisning, setListeVisning] = useState<boolean>(false);
  const [aktiveEnheter, setAktiveEnheter] = useState<ComboOption[]>(
    hentLagredeAktiveEnheter() ?? førsteEnhetTilComboOption(enheter) ?? []
  );

  const oppdaterEnheter = (enheter: ComboOption[]) => {
    console.log('lagrer', enheter);
    setAktiveEnheter(enheter);
    lagreAktiveEnheter(enheter);
  };

  return (
    <HGrid columns={'1fr 6fr'}>
      <FilterSamling />
      <VStack gap={'4'}>
        <Box
          background={'bg-default'}
          borderColor={'border-subtle'}
          borderWidth={'1'}
          padding={'4'}
          borderRadius={'medium'}
        >
          <HStack justify={'space-between'} align={'center'}>
            <EnheterSelect enheter={enheter} aktiveEnheter={aktiveEnheter} setAktiveEnheter={oppdaterEnheter} />
            <Button
              variant={'secondary'}
              icon={listeVisning ? <MenuGridIcon /> : <BulletListIcon />}
              className={'fit-content'}
              size={'small'}
              onClick={() => setListeVisning(!listeVisning)}
            >
              {listeVisning ? 'Gridvisning' : 'Listevisning'}
            </Button>
          </HStack>
        </Box>
        <VStack gap={'4'}>
          <MinEnhetBehandlinger listeVisning={listeVisning} aktiveEnheter={aktiveEnheter.map((e) => e.value)} />
          <MinEnhetOppgaver listeVisning={listeVisning} aktiveEnheter={aktiveEnheter.map((e) => e.value)} />
        </VStack>
      </VStack>
    </HGrid>
  );
};

function førsteEnhetTilComboOption(enheter: Enhet[]): ComboOption[] | null {
  const førsteEnhet = enheter.find((e) => e);
  if (førsteEnhet) {
    return [{ value: førsteEnhet.enhetNr, label: førsteEnhet.navn }];
  }
  return null;
}
