'use client';

import { useState } from 'react';
import { Box, Button, Dropdown, Heading, HStack, InternalHeader, Link, Spacer, VStack } from '@navikt/ds-react';
import { Kelvinsøk, SøkeResultat } from './Kelvinsøk';
import { LeaveIcon, XMarkIcon } from '@navikt/aksel-icons';
import { Kelvinsøkeresultat } from './Kelvinsøkeresultat';
import styles from './KelvinAppHeader.module.css';

interface BrukerInformasjon {
  navn: string;
  NAVident?: string;
}

const Brukermeny = ({ brukerInformasjon }: { brukerInformasjon: BrukerInformasjon }) => (
  <Dropdown>
    <InternalHeader.UserButton name={brukerInformasjon.navn} as={Dropdown.Toggle} />
    <Dropdown.Menu>
      <Dropdown.Menu.List>
        <Dropdown.Menu.List.Item>
          <Link href={'/oauth2/logout'}>Logg ut</Link>
          <Spacer />
          <LeaveIcon aria-hidden fontSize="1.5rem" />
        </Dropdown.Menu.List.Item>
      </Dropdown.Menu.List>
    </Dropdown.Menu>
  </Dropdown>
);

export const KelvinAppHeader = ({ brukerInformasjon }: { brukerInformasjon: BrukerInformasjon }) => {
  const [søkeresultat, setSøkeresultat] = useState<SøkeResultat | undefined>(undefined);

  return (
    <>
      <InternalHeader className={styles.kelvinAppHeader}>
        <InternalHeader.Title href="/">Kelvin</InternalHeader.Title>

        <HStack gap="4" marginInline="4">
          <Kelvinsøk setSøkeresultat={setSøkeresultat} />
          <Link href={`/oppgave/`}>
            Oppgaveliste
          </Link>
          <Link href={`/oppgave/produksjonsstyring`}>
            Produksjonsstyring
          </Link>
          <Link href={`/saksbehandling/saksoversikt`}>
            Saksoversikt
          </Link>
          <Link href={`/postmottak/`}>
            Postmottak
          </Link>
          <Link href={`/saksbehandling/sanity`}>
            Sanity
          </Link>
        </HStack>

        <Spacer />
        <Brukermeny brukerInformasjon={brukerInformasjon} />
      </InternalHeader>

      {søkeresultat && (
        <Box background="surface-inverted" className={styles.kelvinAppHeaderSearchResult}>
          <VStack padding="4">
            <HStack justify={'space-between'}>
              <Heading size="small" spacing>
                Søkeresultater
              </Heading>
              <Button
                variant={'primary-neutral'}
                size={'small'}
                icon={<XMarkIcon />}
                onClick={() => setSøkeresultat(undefined)}
              >
                Lukk
              </Button>
            </HStack>

            <Kelvinsøkeresultat søkeresultat={søkeresultat} />
          </VStack>
        </Box>
      )}
    </>
  );
};
