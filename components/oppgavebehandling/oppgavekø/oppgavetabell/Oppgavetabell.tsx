'use client';

import { format } from 'date-fns';
import { Button, Dropdown, Link, Table } from '@navikt/ds-react';

import { Oppgave } from 'lib/types/oppgavebehandling';

import styles from './Oppgavetabell.module.css';
import { ChevronDownIcon } from '@navikt/aksel-icons';
import { useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { KøContext } from 'components/oppgavebehandling/KøContext';
import { fetchProxy } from 'lib/clientApi';
import { useSWRConfig } from 'swr';
import { byggQueryString } from 'components/oppgavebehandling/lib/query';
import { hentAlleBehandlinger } from 'components/oppgavebehandling/oppgavekø/oppgavetabell/OppgaveFetcher';

type Props = {
  oppgaver: Oppgave[];
  sorterbar?: boolean;
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

export const Oppgavetabell = ({ oppgaver, sorterbar = true }: Props) => {
  const [behandlerDokument, oppdaterBehandlerDokument] = useState<number | undefined>();
  const køContext = useContext(KøContext);

  const valgtKø = køContext.valgtKø;
  const router = useRouter();
  const { mutate } = useSWRConfig();

  const search = byggQueryString(køContext.valgtKø);
  const refresh = () => mutate('oppgaveliste', () => hentAlleBehandlinger(search));

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
    oppdaterBehandlerDokument(oppgave.oppgaveId);
    const res = await fetchProxy<Response>(`/api/oppgavebehandling/${oppgave.oppgaveId}/tildelOppgave/`, 'PATCH', {
      versjon: 1,
    });
    if (res && res.status === 200) {
      router.push(`/sak/${oppgave.saksnummer}/${oppgave.behandlingsreferanse}`);
    } else {
      oppdaterBehandlerDokument(undefined);
      console.error('Klarte ikke å tildele oppgave');
    }
  };

  const frigi = async (oppgave: Oppgave) => {
    oppdaterBehandlerDokument(oppgave.oppgaveId);
    const res = await fetchProxy<Response>(`/api/oppgavebehandling/${oppgave.oppgaveId}/frigi/`, 'PATCH', {
      versjon: 1,
    });
    if (res && res.status === 200) {
      oppdaterBehandlerDokument(undefined);
      await refresh();
    } else {
      oppdaterBehandlerDokument(undefined);
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
          <Table.ColumnHeader sortable={sorterbar} sortKey={'foedselsnummer'}>
            Innbygger
          </Table.ColumnHeader>
          <Table.ColumnHeader sortable={sorterbar} sortKey={'behandlingstype'}>
            Behandlingstype
          </Table.ColumnHeader>
          <Table.ColumnHeader sortable={sorterbar} sortKey={'avklaringsbehov'}>
            Oppgavetype
          </Table.ColumnHeader>
          <Table.ColumnHeader sortable={sorterbar} sortKey={'behandlingOpprettetTid'}>
            Behandling opprettet
          </Table.ColumnHeader>
          <Table.ColumnHeader sortable={sorterbar} sortKey={'avklaringsbehovOpprettetTid'}>
            Avklaringsbehov opprettet
          </Table.ColumnHeader>
          <Table.ColumnHeader sortable={sorterbar} sortKey={'tilordnetRessurs'}>
            Saksbehandler
          </Table.ColumnHeader>
          <Table.HeaderCell colSpan={2}></Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {oppgaver && oppgaver.length === 0 && (
          <Table.Row>
            <Table.DataCell colSpan={7}>Fant ingen oppgaver</Table.DataCell>
          </Table.Row>
        )}
        {oppgaver.length > 0 &&
          oppgaver.map((oppgave) => (
            <Table.Row key={oppgave.oppgaveId}>
              <Table.DataCell>{oppgave.foedselsnummer}</Table.DataCell>
              <Table.DataCell>{oppgave.behandlingstype}</Table.DataCell>
              <Table.DataCell>{mapAvklaringsbehov(oppgave.avklaringsbehov)}</Table.DataCell>
              <Table.DataCell>{format(oppgave.behandlingOpprettetTid, 'dd.MM.yy HH:mm')}</Table.DataCell>
              <Table.DataCell>{format(oppgave.avklaringsbehovOpprettetTid, 'dd.MM.yy HH:mm')}</Table.DataCell>
              <Table.DataCell>{oppgave.tilordnetRessurs ?? 'Ufordelt'}</Table.DataCell>
              <Table.DataCell>
                <div className={styles.onebutton}>
                  <Button
                    size={'small'}
                    type={'button'}
                    variant={'primary'}
                    onClick={() => behandle(oppgave)}
                    loading={behandlerDokument === oppgave.oppgaveId}
                  >
                    Behandle
                  </Button>
                  <Dropdown>
                    <Button as={Dropdown.Toggle} variant={'primary'} size={'small'} title={'Handlinger'}>
                      <ChevronDownIcon fontSize={'1.5rem'} />
                    </Button>
                    <Dropdown.Menu>
                      <Dropdown.Menu.List>
                        <Dropdown.Menu.List.Item
                          as={Link}
                          href={`/sak/${oppgave.saksnummer}/${oppgave.behandlingsreferanse}`}
                        >
                          Se sak
                        </Dropdown.Menu.List.Item>
                        <Dropdown.Menu.List.Item onClick={() => alert('Ikke implementert')}>
                          Tildelt annen behandler
                        </Dropdown.Menu.List.Item>
                        <Dropdown.Menu.Divider />
                        <Dropdown.Menu.List.Item onClick={() => frigi(oppgave)}>
                          Frigjør oppgave
                        </Dropdown.Menu.List.Item>
                      </Dropdown.Menu.List>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </Table.DataCell>
            </Table.Row>
          ))}
      </Table.Body>
    </Table>
  );
};
