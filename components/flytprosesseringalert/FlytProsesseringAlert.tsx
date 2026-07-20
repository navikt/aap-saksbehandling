'use client';

import { useState } from 'react';
import { Box } from '@navikt/ds-react/Box';
import { LocalAlert } from '@navikt/ds-react/LocalAlert';
import { ReadMore } from '@navikt/ds-react/ReadMore';
import { VStack } from '@navikt/ds-react/Stack';
import { BodyShort, Detail, Label } from '@navikt/ds-react/Typography';
import { FlytProsessering } from 'lib/types/types';

interface Props {
  flytProsessering: FlytProsessering;
}

export const FlytProsesseringAlert = ({ flytProsessering }: Props) => {
  const { ventendeOppgaver } = flytProsessering;

  return (
    <LocalAlert status="error" size="small">
      <LocalAlert.Header>
        <LocalAlert.Title>Prosessering feilet i Kelvin</LocalAlert.Title>
      </LocalAlert.Header>
      <LocalAlert.Content>
        {ventendeOppgaver.length === 0 ? (
          <BodyShort size="small">Kunne ikke hente detaljer om feilet prosessering.</BodyShort>
        ) : (
          <VStack gap="space-12">
            {ventendeOppgaver.map((oppgave, index) => (
              <VStack key={oppgave.id} gap="space-8">
                {index > 0 && <hr style={{ margin: 0, borderColor: 'var(--a-border-default)' }} />}
                <VentendeOppgave oppgave={oppgave} />
              </VStack>
            ))}
            <BodyShort size="small" weight={'semibold'}>
              Dersom feilen vedvarer kan du ta kontakt med brukerstøtte for å få løst problemet.
            </BodyShort>
          </VStack>
        )}
      </LocalAlert.Content>
    </LocalAlert>
  );
};

type Oppgave = FlytProsessering['ventendeOppgaver'][number];

const VentendeOppgave = ({ oppgave }: { oppgave: Oppgave }) => {
  const [open, setOpen] = useState(true);

  return (
    <VStack gap="space-8">
      <VStack gap="space-4">
        <Label size="small">{oppgave.navn}</Label>
        {oppgave.beskrivelse && <Detail>{oppgave.beskrivelse}</Detail>}
        <Detail>
          Feilende forsøk: <strong>{oppgave.antallFeilendeForsøk}</strong>
        </Detail>
      </VStack>
      {oppgave.feilmelding?.trim() && (
        <Box background="neutral-moderateA" padding="space-8" style={{ minWidth: 0 }}>
          <ReadMore
            header={open ? 'Skjul feilmelding' : 'Vis feilmelding'}
            size="small"
            open={open}
            onOpenChange={setOpen}
          >
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
  );
};
