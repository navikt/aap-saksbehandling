'use client';

import { useState } from 'react';
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
import { Kelvinsøk } from 'components/kelvinsøkeresultat/Kelvinsøk';
import { ArrowRightLeftIcon, LeaveIcon, XMarkIcon } from '@navikt/aksel-icons';
import { Kelvinsøkeresultat } from 'components/kelvinsøkeresultat/Kelvinsøkeresultat';
import styles from './KelvinAppHeader.module.css';
import { AppSwitcher } from 'components/kelvinappheader/AppSwitcher';
import { isLocal, isProd } from 'lib/utils/environment';
import { LokalBrukerBytte } from 'components/lokalbrukerbytte/LokalBrukerBytte';
import { Roller } from 'lib/services/azure/azureUserService';
import { SøkeResultat } from 'app/api/kelvinsok/route';
import Endringslogg from '@navikt/familie-endringslogg';

interface BrukerInformasjon {
  navn: string;
  NAVident?: string;
}

const bytteBrukerForDevOgLokalt = !isProd();
const lokalBrukerbytte = isLocal();
const Brukermeny = ({ brukerInformasjon, roller }: { brukerInformasjon: BrukerInformasjon; roller?: Roller[] }) => {
  return (
    <Dropdown>
      <InternalHeader.UserButton name={brukerInformasjon.navn} as={Dropdown.Toggle} />
      <Dropdown.Menu>
        <Dropdown.Menu.GroupedList>
          <Dropdown.Menu.GroupedList.Heading>
            Roller: {roller?.map((rolle) => rolle).join(', ')}
          </Dropdown.Menu.GroupedList.Heading>
          <Dropdown.Menu.Divider />
          {bytteBrukerForDevOgLokalt && (
            <>
              <Dropdown.Menu.List.Item as={Link} href={'/oauth2/login?prompt=select_account'}>
                <BodyShort>Bytt bruker</BodyShort>
                <Spacer />
                <ArrowRightLeftIcon aria-hidden fontSize="1.5rem" />
              </Dropdown.Menu.List.Item>
            </>
          )}

          <Dropdown.Menu.List.Item as={Link} href={'/oauth2/logout'}>
            <BodyShort>Logg ut</BodyShort>
            <Spacer />
            <LeaveIcon aria-hidden fontSize="1.5rem" />
          </Dropdown.Menu.List.Item>
        </Dropdown.Menu.GroupedList>

        {lokalBrukerbytte && (
          <>
            <Dropdown.Menu.Divider />
            <LokalBrukerBytte />
          </>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

function finnEndringslogg(): HTMLElement {
  return Array.from(document.getElementsByClassName('endringslogg-knapp'))[0] as HTMLElement;
}

const lokalLenkeTilSaksoversikt = isLocal();
export const KelvinAppHeader = ({
  brukerInformasjon,
  roller,
}: {
  brukerInformasjon: BrukerInformasjon;
  roller?: Roller[];
}) => {
  const [søkeresultat, setSøkeresultat] = useState<SøkeResultat | undefined>(undefined);
  const [endringsloggÅpen, setEndringsloggÅpen] = useState<boolean>(false);

  return (
    <>
      <InternalHeader>
        <InternalHeader.Title href="/">Kelvin</InternalHeader.Title>

        <HStack gap="4" marginInline="4" className={styles.kelvinAppHeaderMenuItems}>
          <Kelvinsøk setSøkeresultat={setSøkeresultat} />
          <Link href={`/oppgave/`}>Oppgaveliste</Link>
          <Link href={`/oppgave/produksjonsstyring`}>Produksjonsstyring</Link>
          {lokalLenkeTilSaksoversikt && <Link href={`/saksbehandling/saksoversikt`}>Saksoversikt</Link>}
        </HStack>

        {/*
        TODO:
          Midlertidig revert til det er godkjent av produktleder... 😅
          <XMasSpacer />
        */}
        <Spacer />

        {brukerInformasjon.NAVident && (
          <InternalHeader.Button
            as="div"
            onClick={(e) => {
              console.log(e, finnEndringslogg());
              if (!endringsloggÅpen) {
                finnEndringslogg().click();
              }
              setEndringsloggÅpen(!endringsloggÅpen);
            }}
          >
            <Endringslogg
              userId={brukerInformasjon.NAVident}
              dataFetchingIntervalSeconds={60 * 15}
              appId={'AAP'}
              backendUrl={'/saksbehandling/api'}
              dataset={'production'}
              maxEntries={50}
              appName={'Kelvin'}
              alignLeft={true}
              stil={'lys'}
            />
          </InternalHeader.Button>
        )}
        <AppSwitcher />
        <Brukermeny brukerInformasjon={brukerInformasjon} roller={roller} />
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const XMasSpacer = () => (
  <span className="navds-stack__spacer" style={{ backgroundImage: 'url(/xmas-lights.svg)', opacity: 0.75 }} />
);
