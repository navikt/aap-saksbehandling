'use client';

import { ExternalLinkIcon, TasklistIcon } from '@navikt/aksel-icons';
import { BodyShort, Box, Button, Detail, HStack, VStack } from '@navikt/ds-react';
import { TagMedPopover } from 'components/tagmedpopover/TagMedPopover';
import { GosysOppgave } from 'lib/types/gosysTypes';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { mapOppgaveTypeTilTekst } from 'lib/utils/gosys';
import styles from './GosysOppgaverPopOver.module.css';

interface Props {
  oppgaver: GosysOppgave[];
  antallTreff: number;
  saksnummer: string;
}

export const GosysOppgaverPopOver = ({ oppgaver, antallTreff, saksnummer }: Props) => {
  const gosysOppgaverSomSkalVises = oppgaver.slice(0, 5);

  return (
    <TagMedPopover
      tagContent={`Gosys-oppgaver (${antallTreff})`}
      popoverContent={
        <Box width="400px" borderRadius="12">
          <Box background="moderate" data-color="warning" padding="space-12" borderRadius={'12 12 0 0'}>
            <HStack gap="space-8">
              <TasklistIcon aria-hidden fontSize="1.5rem" />
              <BodyShort weight="semibold">Gosysoppgaver ({antallTreff})</BodyShort>
            </HStack>
          </Box>
          <Box paddingInline="space-12">
            <VStack as="ul" className={styles.gosysOppgaver}>
              {gosysOppgaverSomSkalVises.map((oppgave) => (
                <Box
                  as="li"
                  key={oppgave.id}
                  paddingBlock="space-12"
                  borderWidth="0 0 1 0"
                  borderColor="neutral-subtle"
                >
                  <VStack gap="space-4">
                    {oppgave.opprettetTidspunkt && (
                      <Detail weight="semibold">{formaterDatoForFrontend(oppgave.opprettetTidspunkt)}</Detail>
                    )}
                    <VStack>
                      <Detail textColor={'subtle'}>Type</Detail>
                      <BodyShort size="small">{mapOppgaveTypeTilTekst(oppgave.oppgavetype)}</BodyShort>
                    </VStack>
                    <VStack>
                      <Detail textColor={'subtle'}>Enhet</Detail>
                      <BodyShort size="small">{oppgave.tildeltEnhetsnr}</BodyShort>
                    </VStack>
                  </VStack>
                </Box>
              ))}
            </VStack>
            {antallTreff > 5 && (
              <Box paddingBlock="space-12">
                <Detail textColor={'subtle'}>
                  Viser {gosysOppgaverSomSkalVises.length} av {antallTreff} oppgaver. Gå til gosys-oppgaver siden for å
                  se alle.
                </Detail>
              </Box>
            )}
          </Box>
          <Box padding="space-12" borderWidth="1 0 0 0" borderColor="neutral-subtle">
            <HStack justify="end">
              <Button
                as="a"
                role="link"
                href={`/saksbehandling/sak/${saksnummer}?t=GOSYS_OPPGAVER`}
                target="_blank"
                variant="secondary"
                size="small"
                icon={<ExternalLinkIcon aria-hidden />}
                iconPosition="right"
              >
                Gå til Gosys-oppgaver
              </Button>
            </HStack>
          </Box>
        </Box>
      }
      dataColor="warning"
      tagVariant={'outline'}
    />
  );
};
