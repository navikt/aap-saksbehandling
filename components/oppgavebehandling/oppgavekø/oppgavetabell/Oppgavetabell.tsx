'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { Button, Dropdown, Table } from '@navikt/ds-react';

import { Oppgave } from 'lib/types/oppgavebehandling';

import styles from './Oppgavetabell.module.css';
import { MenuElipsisVerticalIcon } from '@navikt/aksel-icons';
import { useContext } from 'react';
import { useRouter } from 'next/navigation';
import { KøContext } from 'components/oppgavebehandling/KøContext';
import { fetchProxy } from 'lib/clientApi';

type Props = {
  oppgaver: Oppgave[];
  mutate: Function;
};

const mapAvklaringsbehov = (behandlingstype: string) => {
  switch (behandlingstype) {
    case 'AVKLAR_STUDENT':
      return 'Student';
    case 'AVKLAR_SYKDOM':
      return 'Nedsatt arbeidsevne';
    case 'AVKLAR_BISTANDSBEHOV':
      return 'Behov for bistand';
    case 'FRITAK_MELDEPLIKT':
      return 'Unntak fra meldeplikt';
    case 'VURDER_SYKEPENGEERSTATNING':
      return 'Sykepengeerstatning';
    case 'FASTSETT_ARBEIDSEVNE':
      return 'Fastsett arbeidsevne';
    case 'FASTSETT_BEREGNINGSTIDSPUNKT':
      return 'Fastsett beregningstidspunkt';
    case 'FORESLÅ_VEDTAK':
      return 'Foreslå vedtak';
    case 'FATTE_VEDTAK':
      return 'Fatte vedtak';
    default:
      return behandlingstype;
  }
};

export const Oppgavetabell = ({ oppgaver }: Props) => {
  const køContext = useContext(KøContext);

  const valgtKø = køContext.valgtKø;
  const router = useRouter();
  const oppgaveErFordelt = (oppgave: Oppgave) => !!oppgave.tilordnetRessurs;

  const sorter = (sortKey: string | undefined) => {
    if (sortKey) {
      if (valgtKø.sortering?.orderBy === sortKey && valgtKø.sortering.direction === 'descending') {
        køContext.oppdaterValgtKø({ ...valgtKø, sortering: undefined });
      } else {
        køContext.oppdaterValgtKø({
          ...valgtKø,
          sortering: {
            orderBy: sortKey,
            direction: valgtKø.sortering?.direction === 'ascending' ? 'descending' : 'ascending',
          },
        });
      }
    }
  };

  const behandle = async (oppgave: Oppgave) => {
    const res = await fetchProxy<Response>(`/api/oppgavebehandling/${oppgave.oppgaveId}/tildelOppgave`, 'PATCH', {
      versjon: 1,
      navIdent: 'z994422',
    });
    if (res && res.status === 200) {
      router.push(`/sak/${oppgave.saksnummer}/${oppgave.behandlingsreferanse}`);
    } else {
      console.error('Klarte ikke å tildele oppgave');
    }
  };

  const frigi = async (oppgave: Oppgave) => {
    const res = await fetchProxy<Response>(`/api/oppgavebehandling/${oppgave.oppgaveId}/frigi`, 'PATCH', {
      versjon: 1,
    });
    if (res && res.status === 200) {
      window.location.reload();
    } else {
      console.error('Klarte ikke å frigi oppgave');
    }
  };

  return (
    <Table
      zebraStripes
      className={styles.oppgavetabell}
      sort={valgtKø.sortering}
      onSortChange={(sortKey) => sorter(sortKey)}
    >
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader>Innbygger</Table.ColumnHeader>
          <Table.ColumnHeader sortable sortKey={'behandlingstype'}>
            Behandlingstype
          </Table.ColumnHeader>
          <Table.ColumnHeader sortable sortKey={'avklaringsbehov'}>
            Gjelder
          </Table.ColumnHeader>
          <Table.ColumnHeader sortable sortKey={'behandlingOpprettetTid'}>
            Behandling opprettet
          </Table.ColumnHeader>
          <Table.ColumnHeader sortable sortKey={'avklaringsbehovOpprettetTid'}>
            Oppgave opprettet
          </Table.ColumnHeader>
          <Table.ColumnHeader>Saksbehandler</Table.ColumnHeader>
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
              <Table.DataCell>{oppgave.behandlingstype}</Table.DataCell>
              <Table.DataCell>{mapAvklaringsbehov(oppgave.avklaringsbehov)}</Table.DataCell>
              <Table.DataCell>{format(oppgave.behandlingOpprettetTid, 'dd.MM.yy')}</Table.DataCell>
              <Table.DataCell>{format(oppgave.oppgaveOpprettet, 'dd.MM.yy')}</Table.DataCell>
              <Table.DataCell>{oppgave.tilordnetRessurs ?? 'Ufordelt'}</Table.DataCell>
              <Table.DataCell className={styles.knappecelle}>
                {oppgaveErFordelt(oppgave) ? (
                  <Button variant={'secondary'} size={'small'} onClick={() => frigi(oppgave)}>
                    Frigjør
                  </Button>
                ) : (
                  <Button variant={'primary'} size={'small'} onClick={() => behandle(oppgave)}>
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
