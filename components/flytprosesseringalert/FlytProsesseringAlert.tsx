'use client';

import { BodyShort, Box, Detail, HStack, Label, LocalAlert, ReadMore, VStack } from '@navikt/ds-react';
import { FlytProsessering } from 'lib/types/types';

interface Props {
  flytProsessering: FlytProsessering;
}

export const FlytProsesseringAlert = ({ flytProsessering }: Props) => {
  const { ventendeOppgaver } = flytProsessering;

  console.log(flytProsessering);
  return (
    <LocalAlert status="error" size={'small'}>
      <LocalAlert.Header>
        <LocalAlert.Title>Prosessering feilet i Kelvin</LocalAlert.Title>
      </LocalAlert.Header>
      <LocalAlert.Content>
        {ventendeOppgaver.length === 0 ? (
          <BodyShort>Kunne ikke hente detaljer om feilet prosessering.</BodyShort>
        ) : (
          <VStack gap="space-16">
            {ventendeOppgaver.map((oppgave) => (
              <VStack key={oppgave.id} gap="space-8">
                <div>
                  <Label>{oppgave.navn}</Label>
                  {oppgave.beskrivelse && <BodyShort size="small">{oppgave.beskrivelse}</BodyShort>}
                </div>

                <HStack gap="space-16" wrap>
                  <BodyShort size="small">
                    Feilende forsøk: <strong>{oppgave.antallFeilendeForsøk}</strong>
                  </BodyShort>
                </HStack>

                {oppgave.feilmelding?.trim() && (
                  <Box background="neutral-moderateA" padding="space-8" style={{ minWidth: 0 }}>
                    <ReadMore header="Vis feilmelding" size="small" defaultOpen={true}>
                      <pre
                        style={{
                          fontSize: 'small',
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                          maxHeight: '20rem',
                          overflowY: 'auto',
                          overflowX: 'hidden',
                        }}
                      >
                        {oppgave.feilmelding}
                      </pre>
                    </ReadMore>
                  </Box>
                )}
              </VStack>
            ))}
          </VStack>
        )}
      </LocalAlert.Content>
    </LocalAlert>
  );
};
