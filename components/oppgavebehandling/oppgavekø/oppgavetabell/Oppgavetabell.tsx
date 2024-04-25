'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { Button, Dropdown, Table } from '@navikt/ds-react';

import { Oppgave } from 'lib/types/oppgavebehandling';
import { fetchProxy } from 'lib/clientApi';

import styles from './Oppgavetabell.module.css';
import { MenuElipsisVerticalIcon } from '@navikt/aksel-icons';

type Props = {
  oppgaver: Oppgave[];
  mutate: Function;
};

type ProxyResponse = {
  message: string;
  status: number;
};

export const Oppgavetabell = ({ oppgaver, mutate }: Props) => {
  const oppgaveErFordelt = (oppgave: Oppgave) => !!oppgave.tilordnetRessurs;

  const fordelOppgave = async (oppgave: Oppgave) => {
    const res: ProxyResponse | undefined = await fetchProxy(
      `/api/oppgavebehandling/${oppgave.oppgaveId}/tildelOppgave`,
      'PATCH',
      {
        versjon: oppgave.versjon,
        navIdent: 'z994422',
      }
    );
    if (res && res.status === 200) {
      await mutate();
    }
  };

  const frigiOppgave = async (oppgave: Oppgave) => {
    const res: ProxyResponse | undefined = await fetchProxy(
      `/api/oppgavebehandling/${oppgave.oppgaveId}/frigi`,
      'PATCH',
      {
        versjon: oppgave.versjon,
      }
    );
    if (res && res.status === 200) {
      await mutate();
    }
  };

  return (
    <Table zebraStripes className={styles.oppgavetabell}>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Innbygger</Table.HeaderCell>
          <Table.HeaderCell>Oppgavetype</Table.HeaderCell>
          <Table.HeaderCell>Gjelder</Table.HeaderCell>
          <Table.HeaderCell>Oppgave opprettet</Table.HeaderCell>
          <Table.HeaderCell>Saksbehandler</Table.HeaderCell>
          <Table.HeaderCell colSpan={2}></Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {oppgaver && oppgaver.length === 0 && (
          <Table.Row>
            <Table.DataCell colSpan={6}>Fant ingen oppgaver</Table.DataCell>
          </Table.Row>
        )}
        {oppgaver.length > 0 &&
          oppgaver.map((oppgave) => (
            <Table.Row key={oppgave.oppgaveId}>
              <Table.DataCell>{oppgave.foedselsnummer}</Table.DataCell>
              <Table.DataCell>{oppgave.søknadstype}</Table.DataCell>
              <Table.DataCell>{oppgave.type}</Table.DataCell>
              <Table.DataCell>{format(oppgave.opprettet, 'dd.MM.yy')}</Table.DataCell>
              <Table.DataCell>{oppgave.tilordnetRessurs ?? 'Ufordelt'}</Table.DataCell>
              <Table.DataCell className={styles.knappecelle}>
                {oppgaveErFordelt(oppgave) ? (
                  <Button variant={'secondary'} size={'small'} onClick={() => frigiOppgave(oppgave)}>
                    Frigjør
                  </Button>
                ) : (
                  <Button variant={'primary'} size={'small'} onClick={() => fordelOppgave(oppgave)}>
                    Behandle
                  </Button>
                )}
                <Dropdown>
                  <Button as={Dropdown.Toggle} variant={'tertiary'} size={'small'}>
                    <MenuElipsisVerticalIcon style={{ color: '#000' }} fontSize={'1.5rem'} />
                  </Button>
                  <Dropdown.Menu>
                    <Dropdown.Menu.List>
                      <Dropdown.Menu.List.Item as={Link} href={`/oppgaveliste/${oppgave.oppgaveId}`}>
                        Se oppgave
                      </Dropdown.Menu.List.Item>
                    </Dropdown.Menu.List>
                  </Dropdown.Menu>
                </Dropdown>
              </Table.DataCell>
            </Table.Row>
          ))}
      </Table.Body>
    </Table>
  );
};
