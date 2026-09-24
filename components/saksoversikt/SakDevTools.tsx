import { HGrid, Tabs, VStack } from '@navikt/ds-react';
import { DummyMeldekort } from 'components/devtools/DummyMeldekort';
import { SendNySoknad } from 'components/devtools/SendNySoknad';
import { SendNySoknadUtenMedlemskap } from 'components/devtools/SendNySoknadUtenMedlemskap';
import { DummyKabalEvent } from 'components/devtools/DummyKabalEvent';
import { LeggTilMockInstitusjonsopphold } from 'components/devtools/LeggTilMockInstitusjonsopphold';
import { LeggTilMockYrkesskade } from 'components/devtools/LeggTilMockYrkesskade';
import { TypeBehandling } from 'lib/types/types';
import { DevtoolWrapper } from 'components/devtools/DevtoolWrapper';
import { LeggTilKravVurdering } from 'components/devtools/LeggTilKravVurdering';
import { DummyLegeerklæring } from 'components/devtools/DummyLegeerklæring';
import { SimulerJournalpostHendelse } from 'components/opprettsak/SimulerJournalpostHendelse';

export const SakDevTools = ({
  saksnummer,
  ident,
  behandlinger,
}: {
  saksnummer: string;
  ident: string;
  behandlinger: { referanse: string; type: TypeBehandling }[];
}) => {
  return (
    <DevtoolWrapper>
      <VStack gap="space-16" padding="space-8">
        <Tabs defaultValue="meldekort">
          <Tabs.List>
            <Tabs.Tab value="meldekort" label="Send et meldekort for inneværende mnd" />
            <Tabs.Tab value="simuler-journalpost-hendelse" label="Simuler journalpost-hendelse" />
          </Tabs.List>
          <Tabs.Panel value="meldekort">
            <HGrid gap="space-8" columns={2}>
              <VStack gap="space-16">
                <DummyMeldekort saksid={saksnummer} />
                <DummyLegeerklæring saksid={saksnummer} />
                <SendNySoknad saksid={saksnummer} />
                <SendNySoknadUtenMedlemskap saksid={saksnummer} />

                {behandlinger && (
                  <DummyKabalEvent
                    saksnummer={saksnummer}
                    klagebehandlinger={behandlinger.filter((e) => e.type === 'Klage').map((e) => e.referanse)}
                  />
                )}
              </VStack>

              <VStack gap="space-16">
                <LeggTilMockInstitusjonsopphold saksnummer={saksnummer} />
                <LeggTilMockYrkesskade saksnummer={saksnummer} />
                <LeggTilKravVurdering saksnummer={saksnummer} />
              </VStack>
            </HGrid>
          </Tabs.Panel>
          <Tabs.Panel value="simuler-journalpost-hendelse">
            <SimulerJournalpostHendelse defaultFnr={ident} />
          </Tabs.Panel>
        </Tabs>
      </VStack>
    </DevtoolWrapper>
  );
};
