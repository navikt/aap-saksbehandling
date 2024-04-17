'use client';

import { Oppgave } from 'lib/types/oppgavebehandling';
import { format } from 'date-fns';
import { Button, Table } from '@navikt/ds-react';

import styles from './Oppgavetabell.module.css';

type Props = {
  oppgaver: Oppgave[];
};

export const Oppgavetabell = ({ oppgaver }: Props) => {
  const oppgaveErFordelt = (oppgave: Oppgave) => !!oppgave.saksbehandler;
  return (
    <Table zebraStripes className={styles.oppgavetabell}>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Innbygger</Table.HeaderCell>
          <Table.HeaderCell>Oppgavetype</Table.HeaderCell>
          <Table.HeaderCell>Gjelder</Table.HeaderCell>
          <Table.HeaderCell>Oppgave opprettet</Table.HeaderCell>
          <Table.HeaderCell>Saksbehandler</Table.HeaderCell>
          <Table.HeaderCell></Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {oppgaver.length === 0 && (
          <Table.Row>
            <Table.DataCell colSpan={6}>Fant ingen oppgaver</Table.DataCell>
          </Table.Row>
        )}
        {oppgaver.length > 0 &&
          oppgaver.map((oppgave) => (
            <Table.Row key={oppgave.navn}>
              <Table.DataCell>{oppgave.navn}</Table.DataCell>
              <Table.DataCell>{oppgave.søknadstype}</Table.DataCell>
              <Table.DataCell>{oppgave.type}</Table.DataCell>
              <Table.DataCell>{format(oppgave.opprettet, 'dd.MM.yy')}</Table.DataCell>
              <Table.DataCell>{oppgave.saksbehandler ?? 'Ufordelt'}</Table.DataCell>
              <Table.DataCell>
                <Button variant={oppgaveErFordelt(oppgave) ? 'secondary' : 'primary'} size={'small'}>
                  {oppgaveErFordelt(oppgave) ? 'Frigjør' : 'Behandle'}
                </Button>
              </Table.DataCell>
            </Table.Row>
          ))}
      </Table.Body>
    </Table>
  );
};
