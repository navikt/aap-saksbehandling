'use client';

import { BodyShort, Box, Button, Detail, HStack, VStack } from '@navikt/ds-react';

import styles from './Filtrering.module.css';
import { useState } from 'react';
import { FilterIcon, XMarkIcon } from '@navikt/aksel-icons';

interface Props {}

interface FormFields {
  behandlingstype: string[];
  behandlingOpprettetFom: string;
  behandlingOpprettettom: string;
  årsak: string[];
  oppgave: string[];
  status: string;
}

export const Filtrering = () => {
  const [visFilter, setVisFilter] = useState(false);

  return (
    <Box borderRadius={'xlarge'} paddingBlock={'2'} paddingInline={'3'}>
      <VStack>
        <HStack justify={'space-between'} align={'end'} className={styles.filtreringTop}>
          <Button
            icon={visFilter ? <XMarkIcon /> : <FilterIcon />}
            iconPosition={'right'}
            variant={'secondary'}
            size={'small'}
            onClick={() => setVisFilter(!visFilter)}
          >
            {visFilter ? 'Lukk filter' : 'Filtrer listen'}
          </Button>

          <Detail>Totalt 9 oppgaver</Detail>
        </HStack>
        <Box background={'surface-subtle'} paddingBlock={'2'} paddingInline={'3'}>
          her kommer det noe mer
        </Box>
      </VStack>
    </Box>
  );
};
