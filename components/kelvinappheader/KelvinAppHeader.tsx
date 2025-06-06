'use client';

import { useEffect, useState } from 'react';
import {
  BodyShort,
  Box,
  Button,
  Dropdown,
  Heading,
  HStack,
  InternalHeader,
  Link,
  Spacer,
  VStack,
} from '@navikt/ds-react';
import { Kelvinsøk, SøkeResultat } from './Kelvinsøk';
import { ArrowRightLeftIcon, CheckmarkCircleFillIcon, LeaveIcon, XMarkIcon } from '@navikt/aksel-icons';
import { Kelvinsøkeresultat } from './Kelvinsøkeresultat';
import styles from './KelvinAppHeader.module.css';
import { AppSwitcher } from 'components/kelvinappheader/AppSwitcher';
import { isDev, isLocal, isProd } from 'lib/utils/environment';
import { useRouter } from 'next/navigation';

interface BrukerInformasjon {
  navn: string;
  NAVident?: string;
}

type Brukere = 'VEILEDER' | 'KVALITETSSIKRER' | 'SAKSBEHANDLER' | 'BESLUTTER';

const Brukermeny = ({ brukerInformasjon }: { brukerInformasjon: BrukerInformasjon }) => {
  const router = useRouter();
  const [bruker, setBruker] = useState<string | null>();

  const switchUser = (bruker: Brukere) => {
    document.cookie = `bruker=${bruker}; path=/; max-age=86400000`; // 1 dag
    setBruker(bruker);
    router.refresh();
  };

  useEffect(() => {
    const cookieValue = getCookie('bruker');
    setBruker(cookieValue);
  }, [setBruker]);

  return (
    <Dropdown>
      <InternalHeader.UserButton name={brukerInformasjon.navn} as={Dropdown.Toggle} />
      <Dropdown.Menu>
        <Dropdown.Menu.GroupedList>
          {!isProd() && (
            <>
              <Dropdown.Menu.List.Item as={Link} href={'/oauth2/login?prompt=select_account'}>
                <BodyShort>Bytt bruker</BodyShort>
                <Spacer />
                <ArrowRightLeftIcon aria-hidden fontSize="1.5rem" />
              </Dropdown.Menu.List.Item>
              <Dropdown.Menu.Divider />
            </>
          )}

          <Dropdown.Menu.List.Item as={Link} href={'/oauth2/logout'}>
            <BodyShort>Logg ut</BodyShort>
            <Spacer />
            <LeaveIcon aria-hidden fontSize="1.5rem" />
          </Dropdown.Menu.List.Item>
        </Dropdown.Menu.GroupedList>
        <Dropdown.Menu.Divider />
        {isLocal() && (
          <Dropdown.Menu.GroupedList>
            <Dropdown.Menu.GroupedList.Heading>Lokal backend</Dropdown.Menu.GroupedList.Heading>
            <Dropdown.Menu.GroupedList.Item onClick={() => switchUser('SAKSBEHANDLER')}>
              <HStack gap={'1'} align={'center'}>
                <BodyShort>Saksbehandler</BodyShort>
                {bruker === 'SAKSBEHANDLER' && <CheckmarkCircleFillIcon color={'green'} />}
              </HStack>
            </Dropdown.Menu.GroupedList.Item>
            <Dropdown.Menu.GroupedList.Item onClick={() => switchUser('KVALITETSSIKRER')}>
              <HStack gap={'1'} align={'center'}>
                <BodyShort>Kvalitetssikrer</BodyShort>
                {bruker === 'KVALITETSSIKRER' && <CheckmarkCircleFillIcon color={'green'} />}
              </HStack>
            </Dropdown.Menu.GroupedList.Item>
            <Dropdown.Menu.GroupedList.Item onClick={() => switchUser('VEILEDER')}>
              <HStack gap={'1'} align={'center'}>
                <BodyShort>Veileder</BodyShort>
                {bruker === 'VEILEDER' && <CheckmarkCircleFillIcon color={'green'} />}
              </HStack>
            </Dropdown.Menu.GroupedList.Item>
            <Dropdown.Menu.GroupedList.Item onClick={() => switchUser('BESLUTTER')}>
              <HStack gap={'1'} align={'center'}>
                <BodyShort>Beslutter</BodyShort>
                {bruker === 'BESLUTTER' && <CheckmarkCircleFillIcon color={'green'} />}
              </HStack>
            </Dropdown.Menu.GroupedList.Item>
          </Dropdown.Menu.GroupedList>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export const KelvinAppHeader = ({ brukerInformasjon }: { brukerInformasjon: BrukerInformasjon }) => {
  const [søkeresultat, setSøkeresultat] = useState<SøkeResultat | undefined>(undefined);

  return (
    <>
      <InternalHeader>
        <InternalHeader.Title href="/">Kelvin</InternalHeader.Title>

        <HStack gap="4" marginInline="4" className={styles.kelvinAppHeaderMenuItems}>
          <Kelvinsøk setSøkeresultat={setSøkeresultat} />
          <Link href={`/oppgave/`}>Oppgaveliste</Link>
          <Link href={`/oppgave/produksjonsstyring`}>Produksjonsstyring</Link>
          {isLocal() && <Link href={`/saksbehandling/saksoversikt`}>Saksoversikt</Link>}
        </HStack>

        <Spacer />
        {(isLocal() || isDev()) && <AppSwitcher />}
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

function getCookie(name: string) {
  const cookies = document.cookie.split('; ');
  console.log(cookies);
  const cookie = cookies.find((coockie) => coockie.startsWith(name + '='));
  return cookie ? decodeURIComponent(cookie.split('=')[1]) : null;
}
