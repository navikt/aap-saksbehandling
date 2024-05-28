import { Alert, BodyShort, Label, List } from '@navikt/ds-react';
import { FlytProsessering } from 'lib/types/types';

interface Props {
  flytProsessering: FlytProsessering;
}

export const FlytProsesseringAlert = ({ flytProsessering }: Props) => {
  return (
    <Alert variant={'error'}>
      <BodyShort spacing>Noe gikk galt i backend</BodyShort>
      <BodyShort spacing>{flytProsessering.status}</BodyShort>
      <List>
        {flytProsessering.ventendeOppgaver.map((oppgaver, index) => (
          <div key={index}>
            <Label>{oppgaver.oppgaveType}</Label>
            <BodyShort>STATUS: {oppgaver.status}</BodyShort>
          </div>
        ))}
      </List>
    </Alert>
  );
};
