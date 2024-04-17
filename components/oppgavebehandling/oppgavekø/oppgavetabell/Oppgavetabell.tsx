'use client';

import { Oppgave } from 'lib/types/oppgavebehandling';
import { format } from 'date-fns';
import { Button, Table } from '@navikt/ds-react';

import styles from './Oppgavetabell.module.css';
import { fetchProxy } from 'lib/clientApi';

type Props = {
  oppgaver: Oppgave[];
};

export const Oppgavetabell = ({ oppgaver }: Props) => {
  const oppgaveErFordelt = (oppgave: Oppgave) => !!oppgave.saksbehandler;
  const fordelOppgave = async (oppgave: Oppgave) => {
    await fetchProxy(`/api/oppgavebehandling/${oppgave.oppgaveId}/tildelOppgave`, 'PATCH', {
      versjon: oppgave.versjon,
      navIdent: 'z994422',
    });
  };

  const frigiOppgave = () => window.alert('Ikke implementert enda... :(');

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
                {oppgaveErFordelt(oppgave) ? (
                  <Button variant={'secondary'} size={'small'} onClick={() => frigiOppgave()}>
                    Frigjør
                  </Button>
                ) : (
                  <Button variant={'primary'} size={'small'} onClick={() => fordelOppgave(oppgave)}>
                    Behandle
                  </Button>
                )}
              </Table.DataCell>
            </Table.Row>
          ))}
      </Table.Body>
    </Table>
  );
};
