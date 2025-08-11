'use client';

import { Box, Button, HGrid, HStack, VStack } from '@navikt/ds-react';
import { useState } from 'react';
import { FilterSamling } from '../filtersamling/FilterSamling';
import { BulletListIcon, MenuGridIcon } from '@navikt/aksel-icons';
import { Enhet } from 'lib/types/oppgaveTypes';
import { EnhetSelect } from 'components/oppgaveliste/enhetselect/EnhetSelect';
import { useLagreAktivEnhet } from 'hooks/oppgave/aktivEnhetHook';
import { MinEnhetOppgaver } from 'components/produksjonsstyring/minenhet/minenhetoppgaver/MinEnhetOppgaver';
import { MinEnhetBehandlinger } from 'components/produksjonsstyring/minenhet/minenhetbehandlinger/MinEnhetBehandlinger';

interface Props {
  enheter: Array<Enhet>;
}

export const MinEnhet = ({ enheter }: Props) => {
  const { hentLagretAktivEnhet, lagreAktivEnhet } = useLagreAktivEnhet();

  const [listeVisning, setListeVisning] = useState<boolean>(false);
  const [aktivEnhet, setAktivEnhet] = useState<string>(hentLagretAktivEnhet() ?? enheter[0]?.enhetNr ?? '');

  const oppdaterEnhet = (enhetsnr: string) => {
    setAktivEnhet(enhetsnr);
    lagreAktivEnhet(enhetsnr);
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
            <EnhetSelect enheter={enheter} aktivEnhet={aktivEnhet} setAktivEnhet={oppdaterEnhet} />
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
          <MinEnhetBehandlinger listeVisning={listeVisning} aktivEnhet={aktivEnhet} />
          <MinEnhetOppgaver listeVisning={listeVisning} aktivEnhet={aktivEnhet} />
        </VStack>
      </VStack>
    </HGrid>
  );
};
