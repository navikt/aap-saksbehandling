'use client';

import { BodyShort, Button, HStack, VStack } from '@navikt/ds-react';
import { Alert } from 'components/alert/Alert';
import { Spinner } from 'components/felles/Spinner';
import { useGosysOppgaver } from 'hooks/oppgave/GosysOppgaverHook';
import { GosysOppgaverForPersonTabell } from './GosysOppgaverForPersonTabell';

interface Props {
  personident: string;
  gosysUrl?: string;
}

export const GosysOppgaverForPerson = ({ personident, gosysUrl }: Props) => {
  const { oppgaver, antallTreff, kanLasteFlere, isLoading, isValidating, error, harLastetOppgaver, lastInnFlere } =
    useGosysOppgaver(undefined, undefined, undefined, personident);

  return (
    <VStack gap="space-16">
      {isLoading ? (
        <Spinner label="Henter Gosys-oppgaver" />
      ) : (
        harLastetOppgaver && (
          <>
            <BodyShort size="small">{`Viser ${oppgaver.length} av ${antallTreff} oppgaver`}</BodyShort>
            <GosysOppgaverForPersonTabell oppgaver={oppgaver} gosysUrl={gosysUrl} />
          </>
        )
      )}
      {error && <Alert variant="error">{'Kunne ikke hente Gosys-oppgaver.'}</Alert>}
      {kanLasteFlere && (
        <HStack justify="center">
          <Button
            variant="secondary"
            size="small"
            loading={isValidating}
            disabled={isValidating}
            onClick={() => lastInnFlere()}
          >
            {'Last inn flere oppgaver'}
          </Button>
        </HStack>
      )}
    </VStack>
  );
};
