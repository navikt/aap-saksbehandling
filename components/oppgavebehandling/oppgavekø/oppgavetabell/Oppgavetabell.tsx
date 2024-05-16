'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { Button, Dropdown, SortState, Table } from '@navikt/ds-react';

import { Oppgave } from 'lib/types/oppgavebehandling';
import { fetchProxy } from 'lib/clientApi';

import styles from './Oppgavetabell.module.css';
import { MenuElipsisVerticalIcon } from '@navikt/aksel-icons';
import { useState } from 'react';

type Props = {
  oppgaver: Oppgave[];
  mutate: Function;
};

type ProxyResponse = {
  message: string;
  status: number;
};

export const Oppgavetabell = ({ oppgaver, mutate }: Props) => {
  const [sort, setSort] = useState<SortState | undefined>();
  const oppgaveErFordelt = (oppgave: Oppgave) => !!oppgave.tilordnetRessurs;

  const sorter = (sortKey: string | undefined) => {
    if (sortKey) {
      if (sort?.orderBy === sortKey && sort.direction === 'descending') {
        setSort(undefined);
      } else {
        setSort({ orderBy: sortKey, direction: sort?.direction === 'ascending' ? 'descending' : 'ascending' });
      }
    }
  };

  const comparator = (a: any, b: any, orderBy: string) => {
    if (b[orderBy] < a[orderBy] || b[orderBy] === undefined) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  };

  const sortedData = oppgaver.slice().sort((a, b) => {
    if (sort) {
      return sort.direction === 'ascending' ? comparator(b, a, sort.orderBy) : comparator(a, b, sort.orderBy);
    }
    return 1;
  });

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
    <Table zebraStripes className={styles.oppgavetabell} sort={sort} onSortChange={(sortKey) => sorter(sortKey)}>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader sortable sortKey={'foedselsnummer'}>
            Innbygger
          </Table.ColumnHeader>
          <Table.ColumnHeader sortable sortKey={'søknadstype'}>
            Oppgavetype
          </Table.ColumnHeader>
          <Table.ColumnHeader sortable sortKey={'type'}>
            Status
          </Table.ColumnHeader>
          <Table.ColumnHeader sortable sortKey={'opprettet'}>
            Oppgave opprettet
          </Table.ColumnHeader>
          <Table.ColumnHeader sortable sortKey={'tilordnetRessurs'}>
            Saksbehandler
          </Table.ColumnHeader>
          <Table.HeaderCell colSpan={2}></Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {oppgaver && oppgaver.length === 0 && (
          <Table.Row>
            <Table.DataCell colSpan={6}>Fant ingen oppgaver</Table.DataCell>
          </Table.Row>
        )}
        {sortedData.length > 0 &&
          sortedData.map((oppgave) => (
            <Table.Row key={oppgave.oppgaveId}>
              <Table.DataCell>{oppgave.foedselsnummer}</Table.DataCell>
              <Table.DataCell>{oppgave.behandlingstype}</Table.DataCell>
              <Table.DataCell>{oppgave.status}</Table.DataCell>
              <Table.DataCell>{format(oppgave.avklaringsbehovOpprettetTid, 'dd.MM.yy')}</Table.DataCell>
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
                      <Dropdown.Menu.List.Item
                        as={Link}
                        href={`/sak/${oppgave.saksnummer}/${oppgave.behandlingsreferanse}`}
                      >
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
