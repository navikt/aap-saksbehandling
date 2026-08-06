'use client';

import { ArrowRightLeftIcon, ExternalLinkIcon, LeaveIcon, MigrationIcon, XMarkIcon } from '@navikt/aksel-icons';
import {
  ActionMenu,
  BodyShort,
  Box,
  Button,
  HStack,
  Heading,
  InternalHeader,
  Link,
  Spacer,
  Theme,
  VStack,
} from '@navikt/ds-react';
import Endringslogg from '@navikt/endringslogg';
import { SøkeResultat } from 'app/api/kelvinsok/route';
import { useFeatureFlag } from 'context/UnleashContext';
import { useInnloggetBruker } from 'hooks/BrukerHook';
import { BrukerInformasjon } from 'lib/services/azure/azureUserService';
import { Roller } from 'lib/types/types';
import { isLocal, isProd } from 'lib/utils/environment';
import { useState } from 'react';

import { AppSwitcher } from 'components/kelvinappheader/AppSwitcher';
import { SisteBehandledeSakerOgOppgaver } from 'components/kelvinappheader/SisteBehandledeSakerOgOppgaver';
import { Kelvinsøk } from 'components/kelvinsøkeresultat/Kelvinsøk';
import { Kelvinsøkeresultat } from 'components/kelvinsøkeresultat/Kelvinsøkeresultat';
import { LokalBrukerBytte } from 'components/lokalbrukerbytte/LokalBrukerBytte';
import { MigrerSakModal } from 'components/migrersakmodal/MigrerSakModal';

import styles from './KelvinAppHeader.module.css';

const bytteBrukerForDevOgLokalt = !isProd();
const lokalBrukerbytte = isLocal();

const Brukermeny = ({ brukerInformasjon, roller }: { brukerInformasjon: BrukerInformasjon; roller?: Roller[] }) => {
  return (
    <ActionMenu>
      <ActionMenu.Trigger>
        <InternalHeader.UserButton name={brukerInformasjon.navn} />
      </ActionMenu.Trigger>

      <ActionMenu.Content>
        <SisteBehandledeSakerOgOppgaver />

        <ActionMenu.Sub>
          <ActionMenu.SubTrigger>Mine roller</ActionMenu.SubTrigger>
          <ActionMenu.SubContent>
            {roller?.map((rolle) => (
              <ActionMenu.Item key={`brukermeny-${rolle}`} as={BodyShort}>
                {rolle}
              </ActionMenu.Item>
            ))}
          </ActionMenu.SubContent>
        </ActionMenu.Sub>

        <ActionMenu.Divider />

        <ActionMenu.Group aria-label="temp">
          {bytteBrukerForDevOgLokalt && (
            <ActionMenu.Item as="a" href={'/oauth2/login?prompt=select_account'} rel="noreferrer noopener">
              <BodyShort>Bytt bruker</BodyShort>
              <Spacer />
              <ArrowRightLeftIcon aria-hidden fontSize="1.5rem" />
            </ActionMenu.Item>
          )}

          <ActionMenu.Item as="a" href={'/oauth2/logout'} rel="noreferrer noopener">
            <BodyShort>Logg ut</BodyShort>
            <Spacer />
            <LeaveIcon aria-hidden fontSize="1.5rem" />
          </ActionMenu.Item>
        </ActionMenu.Group>

        {lokalBrukerbytte && (
          <>
            <ActionMenu.Divider />
            <LokalBrukerBytte />
          </>
        )}
      </ActionMenu.Content>
    </ActionMenu>
  );
};

function finnEndringslogg(): HTMLElement {
  return Array.from(document.getElementsByClassName('endringslogg-knapp'))[0] as HTMLElement;
}

const lokalLenkeTilSaksoversikt = isLocal();
export const KelvinAppHeader = () => {
  const [søkeresultat, setSøkeresultat] = useState<SøkeResultat | undefined>(undefined);
  const [endringsloggÅpen, setEndringsloggÅpen] = useState<boolean>(false);
  const [migrerSakModalÅpen, setMigrerSakModalÅpen] = useState<boolean>(false);
  const brukerInformasjon = useInnloggetBruker();
  const visMigrereSakFraArena = useFeatureFlag('VisMigrereSakFraArenaKnapp');

  return (
    <>
      <InternalHeader data-color={'neutral'}>
        <InternalHeader.Title href="/">Kelvin</InternalHeader.Title>

        <HStack gap="space-16" marginInline="space-16">
          <Kelvinsøk setSøkeresultat={setSøkeresultat} />
          <Link data-color={'neutral'} href={`/oppgave/`}>
            Oppgaveliste
          </Link>

          <Link
            href={'https://metabase.ansatt.nav.no/public/dashboard/da1ad654-13a9-492c-bfa0-8cc828aab274?'}
            target="_blank"
            data-color={'neutral'}
          >
            Produksjonsstyring <ExternalLinkIcon />
          </Link>

          {lokalLenkeTilSaksoversikt && (
            <Link data-color={'neutral'} href={`/saksbehandling/saksoversikt`}>
              Saksoversikt
            </Link>
          )}
        </HStack>

        <Spacer />

        {brukerInformasjon.NAVident && (
          <InternalHeader.Button
            as="div"
            onClick={() => {
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
        {brukerInformasjon.roller.includes(Roller.SAKSBEHANDLER_NASJONAL) && visMigrereSakFraArena && (
          <>
            <InternalHeader.Button as="button" onClick={() => setMigrerSakModalÅpen(!migrerSakModalÅpen)}>
              <MigrationIcon title="Migrer sak" />
            </InternalHeader.Button>
            <Theme theme={'light'}>
              <MigrerSakModal isOpen={migrerSakModalÅpen} onClose={() => setMigrerSakModalÅpen(false)} />
            </Theme>
          </>
        )}
        <AppSwitcher />
        <Brukermeny brukerInformasjon={brukerInformasjon} roller={brukerInformasjon.roller} />
      </InternalHeader>
      {søkeresultat && (
        <Theme theme={'dark'}>
          <Box background={'neutral-moderateA'} className={styles.kelvinAppHeaderSearchResult}>
            <VStack padding="space-16">
              <HStack justify={'space-between'}>
                <Heading size="small" spacing>
                  Søkeresultater
                </Heading>
                <Button
                  data-color="neutral"
                  variant={'primary'}
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
        </Theme>
      )}
    </>
  );
};
