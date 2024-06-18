import { Alert, BodyShort, Label, List } from '@navikt/ds-react';
import { FlytProsessering } from 'lib/types/types';

interface Props {
  flytProsessering: FlytProsessering;
}

export const FlytProsesseringAlert = ({ flytProsessering }: Props) => {
  return (
    <Alert variant={'error'}>
      <BodyShort spacing>Noe gikk galt i backend</BodyShort>
      <List>
        {flytProsessering.ventendeOppgaver.map((oppgaver, index) => (
          <div key={index}>
            <Label>{oppgaver.oppgaveType}</Label>
            <BodyShort>Status: {oppgaver.status}</BodyShort>
            <BodyShort>Feilmelding: {oppgaver.feilmelding}</BodyShort>
            <BodyShort>Antall feilende forsøk: {oppgaver.antallFeilendeForsøk}</BodyShort>
          </div>
        ))}
      </List>
    </Alert>
  );
};
