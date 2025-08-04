'use client';

import { Box, Button, HGrid, VStack } from '@navikt/ds-react';
import { useMemo, useState } from 'react';
import { statistikkQueryparams } from 'lib/utils/request';
import { FilterSamling } from '../filtersamling/FilterSamling';
import { BulletListIcon, MenuGridIcon } from '@navikt/aksel-icons';
import { Behandlinger } from 'components/produksjonsstyring/totaloversiktbehandlinger/behandlinger/Behandlinger';
import { Oppgaver } from 'components/produksjonsstyring/totaloversiktbehandlinger/oppgaver/Oppgaver';
import { useProduksjonsstyringFilter } from 'components/produksjonsstyring/allefiltereprovider/ProduksjonsstyringFilterHook';

export const TotaloversiktBehandlinger = () => {
  const [listeVisning, setListeVisning] = useState<boolean>(false);
  const { filter } = useProduksjonsstyringFilter();

  const behandlingstyperQuery = useMemo(
    () => statistikkQueryparams({ behandlingstyper: filter.behandlingstyper }),
    [filter]
  );

  return (
    <HGrid columns={'1fr 6fr'}>
      <FilterSamling />
      <VStack gap={'5'}>
        <Box
          background={'bg-default'}
          borderColor={'border-subtle'}
          borderWidth={'1'}
          padding={'4'}
          borderRadius={'medium'}
        >
          <VStack align={'end'}>
            <Button
              variant={'secondary'}
              icon={listeVisning ? <MenuGridIcon /> : <BulletListIcon />}
              className={'fit-content'}
              size={'small'}
              onClick={() => setListeVisning(!listeVisning)}
            >
              {listeVisning ? 'Gridvisning' : 'Listevisning'}
            </Button>
          </VStack>
        </Box>

        <VStack gap={'4'}>
          <Behandlinger behandlingstyperQuery={behandlingstyperQuery} listeVisning={listeVisning} />
          <Oppgaver behandlingstyperQuery={behandlingstyperQuery} listeVisning={listeVisning} />
        </VStack>
      </VStack>
    </HGrid>
  );
};
