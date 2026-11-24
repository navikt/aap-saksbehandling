import { BodyShort, ExpansionCard, Heading, HGrid, VStack } from '@navikt/ds-react';
import { ReactNode } from 'react';
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

export const SakDevTools = ({
  saksnummer,
  behandlinger,
}: {
  saksnummer: string;
  behandlinger: { referanse: string; type: TypeBehandling }[];
}) => {
  return (
    <DevtoolWrapper title="Utviklerverktøy for saken">
      <VStack gap="space-24" padding={{ xs: 'space-8', md: 'space-16' }}>
        <HGrid columns={{ xs: 1, xl: 2 }} gap="space-24" align="start">
          <VStack as="section" gap="space-12">
            <VStack gap="space-4">
              <Heading level="3" size="xsmall">
                Søknader og dokumenter
              </Heading>
            </VStack>
            <Devtool title="Meldekort" description="Send et meldekort. Standardperioden er inneværende måned.">
              <DummyMeldekort saksid={saksnummer} />
            </Devtool>
            <Devtool title="Legeerklæring" description="Simuler at en legeerklæring er mottatt.">
              <DummyLegeerklæring saksid={saksnummer} />
            </Devtool>
            <Devtool title="Enkel søknad" description="Send en ny søknad med testdata og valgfri mottatt dato.">
              <SendNySoknad saksid={saksnummer} />
            </Devtool>
            <Devtool
              title="Søknad uten medlemskap"
              description="Send en søknad med utenlandsopphold og opphold i Norge under fem år."
            >
              <SendNySoknadUtenMedlemskap saksid={saksnummer} />
            </Devtool>
          </VStack>

          <VStack gap="space-24">
            <VStack as="section" gap="space-12">
              <VStack gap="space-4">
                <Heading level="3" size="xsmall">
                  Registeropplysninger
                </Heading>
              </VStack>
              <Devtool
                title="Institusjonsopphold"
                description="Registrer perioder på helseinstitusjon eller i fengsel."
              >
                <LeggTilMockInstitusjonsopphold saksnummer={saksnummer} />
              </Devtool>
              <Devtool title="Yrkesskade" description="Legg til skader med skadeart, diagnose og eventuell skadedato.">
                <LeggTilMockYrkesskade saksnummer={saksnummer} />
              </Devtool>
            </VStack>

            <VStack as="section" gap="space-12">
              <VStack gap="space-4">
                <Heading level="3" size="xsmall">
                  Behandling og klage
                </Heading>
              </VStack>
              <Devtool title="Kravvurdering" description="Opprett en ny revurdering før du legger til kravvurderinger.">
                <LeggTilKravVurdering saksnummer={saksnummer} />
              </Devtool>
              <Devtool title="Kabal-hendelse" description="Publiser en hendelse knyttet til en klagebehandling.">
                {behandlinger.some((behandling) => behandling.type === 'Klage') ? (
                  <DummyKabalEvent
                    saksnummer={saksnummer}
                    klagebehandlinger={behandlinger
                      .filter((behandling) => behandling.type === 'Klage')
                      .map((behandling) => behandling.referanse)}
                  />
                ) : (
                  <BodyShort size="small">
                    Saken har ingen klagebehandlinger. Opprett en klage fra saksoversikten for å teste Kabal-hendelser.
                  </BodyShort>
                )}
              </Devtool>
            </VStack>
          </VStack>
        </HGrid>
      </VStack>
    </DevtoolWrapper>
  );
};

const Devtool = ({ title, description, children }: { title: string; description: string; children: ReactNode }) => (
  <ExpansionCard aria-label={title} size="small">
    <ExpansionCard.Header>
      <ExpansionCard.Title as="h4" size="small">
        {title}
      </ExpansionCard.Title>
      <ExpansionCard.Description>{description}</ExpansionCard.Description>
    </ExpansionCard.Header>
    <ExpansionCard.Content>{children}</ExpansionCard.Content>
  </ExpansionCard>
);
