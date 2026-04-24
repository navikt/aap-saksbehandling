import { Alert, BodyShort, Label, List, Box } from '@navikt/ds-react';
import { FlytProsessering } from 'lib/types/types';

interface Props {
  flytProsessering: FlytProsessering;
}

export const FlytProsesseringAlert = ({ flytProsessering }: Props) => {
  return (
    <Alert variant={'error'}>
      <BodyShort spacing>Noe gikk galt i backend</BodyShort>
      <Box marginBlock="space-16" asChild>
        <List>
          {flytProsessering.ventendeOppgaver.map((oppgaver, index) => (
            <List.Item key={index}>
              <Label>{oppgaver.type}</Label>
              <BodyShort>Antall feilende forsøk: {oppgaver.antallFeilendeForsøk}</BodyShort>
              <BodyShort>Status: {oppgaver.status}</BodyShort>
              <BodyShort>Feilmelding: {oppgaver.feilmelding}</BodyShort>
            </List.Item>
          ))}
        </List>
      </Box>
    </Alert>
  );
};
