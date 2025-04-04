'use client';

import { AvklaringsbehovKode, Oppgave } from 'lib/types/types';
import {
  Alert,
  BodyShort,
  Box,
  CopyButton,
  Heading,
  HStack,
  Loader,
  SortState,
  Table,
  Tooltip,
  VStack,
} from '@navikt/ds-react';
import { mapBehovskodeTilBehovstype, mapTilOppgaveBehandlingstypeTekst } from 'lib/utils/oversettelser';
import { useMemo, useState } from 'react';
import { oppgaveBehandlingstyper } from 'lib/utils/behandlingstyper';
import { oppgaveAvklaringsbehov } from 'lib/utils/avklaringsbehov';
import { ComboboxOption } from '@navikt/ds-react/cjs/form/combobox/types';
import { ComboboxControlled } from 'components/oppgave/comboboxcontrolled/ComboboxControlled';
import { formaterDatoForFrontend } from 'lib/utils/date';
import Link from 'next/link';
import { OppgaveKnapp } from 'components/oppgave/oppgaveknapp/OppgaveKnapp';
import { TableStyled } from 'components/tablestyled/TableStyled';

interface Props {
  heading?: string;
  oppgaver: Oppgave[];
  visBehandleOgFrigiKnapp?: boolean;
  showDropdownActions?: boolean;
  showSortAndFilters?: boolean;
  includeColumns?: 'reservertAv'[];
  isLoading?: boolean;
}
interface ScopedSortState extends SortState {
  orderBy: keyof Oppgave;
}
export const OppgaveTabell = ({
  oppgaver,
  heading,
  showSortAndFilters = false,
  visBehandleOgFrigiKnapp = false,
  includeColumns = [],
  isLoading = false,
}: Props) => {
  const [feilmelding, setFeilmelding] = useState<string | undefined>();

  const [sort, setSort] = useState<ScopedSortState | undefined>();

  const [selectedBehandlingstyper, setSelectedBehandlingstyper] = useState<ComboboxOption[]>([]);

  const [selectedAvklaringsbehov, setSelectedAvklaringsbehov] = useState<ComboboxOption[]>([]);

  const sortedOppgaver = (oppgaver || []).slice().sort((a, b) => {
    if (sort) {
      return sort.direction === 'ascending' ? comparator(b, a, sort.orderBy) : comparator(a, b, sort.orderBy);
    }
    return 1;
  });
  const behandlingstypeFilter = (oppgave: Oppgave) => {
    return selectedBehandlingstyper.length > 0
      ? selectedBehandlingstyper.find((option) => option.value === oppgave.behandlingstype)
      : true;
  };
  const avklaringsbehovFilter = (oppgave: Oppgave) =>
    selectedAvklaringsbehov.length > 0
      ? selectedAvklaringsbehov.find((option) => option.value === oppgave.avklaringsbehovKode)
      : true;
  const filtrerteOppgaver = useMemo(
    () => sortedOppgaver.filter((oppgave) => behandlingstypeFilter(oppgave) && avklaringsbehovFilter(oppgave)),
    [selectedBehandlingstyper, selectedAvklaringsbehov, sortedOppgaver]
  );

  const handleSort = (sortKey: ScopedSortState['orderBy']) => {
    setSort(
      sort && sortKey === sort.orderBy && sort.direction === 'descending'
        ? undefined
        : {
            orderBy: sortKey,
            direction: sort && sortKey === sort.orderBy && sort.direction === 'ascending' ? 'descending' : 'ascending',
          }
    );
  };

  function comparator<T>(a: T, b: T, orderBy: keyof T): number {
    if (b[orderBy] == null || b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  return (
    <VStack gap={'5'}>
      {feilmelding && <Alert variant={'error'}>{feilmelding}</Alert>}
      {heading && (
        <Heading size={'medium'} level={'2'} spacing>
          {heading}
        </Heading>
      )}
      {showSortAndFilters && (
        <Box background="surface-subtle" padding="4" borderRadius="xlarge">
          <HStack gap={'3'}>
            <ComboboxControlled
              label={'Behandlingstype'}
              options={oppgaveBehandlingstyper}
              selectedOptions={selectedBehandlingstyper}
              setSelectedOptions={setSelectedBehandlingstyper}
            />
            <ComboboxControlled
              label={'Avklaringsbehov'}
              options={oppgaveAvklaringsbehov}
              selectedOptions={selectedAvklaringsbehov}
              setSelectedOptions={setSelectedAvklaringsbehov}
            />
          </HStack>
        </Box>
      )}
      {isLoading && (
        <HStack justify={'center'}>
          <Loader size={'2xlarge'} />
        </HStack>
      )}
      <TableStyled
        size={'small'}
        zebraStripes
        sort={sort}
        onSortChange={(sortKey) => handleSort(sortKey as ScopedSortState['orderBy'])}
      >
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader sortKey={'personNavn'} sortable={showSortAndFilters}>
              Navn
            </Table.ColumnHeader>
            <Table.ColumnHeader sortKey={'personIdent'} sortable={showSortAndFilters}>
              Fnr
            </Table.ColumnHeader>
            <Table.ColumnHeader sortKey={'saksnummer'} sortable={showSortAndFilters}>
              Sak/Journal ID
            </Table.ColumnHeader>
            <Table.HeaderCell>Behandlingstype</Table.HeaderCell>
            <Table.HeaderCell>Avklaringsbehov</Table.HeaderCell>
            <Table.ColumnHeader sortKey={'opprettetTidspunkt'} sortable={showSortAndFilters}>
              Oppg. opprettet
            </Table.ColumnHeader>
            <Table.ColumnHeader sortKey={'behandlingOpprettet'} sortable={showSortAndFilters}>
              Beh. opprettet
            </Table.ColumnHeader>
            <Table.ColumnHeader sortKey={'veileder'} sortable={showSortAndFilters}>
              Veileder i modia
            </Table.ColumnHeader>
            {includeColumns?.includes('reservertAv') && (
              <Table.ColumnHeader sortKey={'reservertAv'} sortable={showSortAndFilters}>
                Reservert av
              </Table.ColumnHeader>
            )}
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {filtrerteOppgaver.map((oppgave, i) => (
            <Table.Row key={`oppgave-${i}`}>
              <Table.DataCell>{`${oppgave.personNavn}`}</Table.DataCell>
              <Table.DataCell>
                {oppgave.personIdent ? (
                  <CopyButton
                    copyText={oppgave?.personIdent}
                    size="small"
                    text={oppgave?.personIdent}
                    iconPosition="right"
                  />
                ) : (
                  'Ukjent'
                )}
              </Table.DataCell>
              <Table.DataCell>
                {oppgave.saksnummer ? (
                  <Link href={`/saksbehandling/sak/${oppgave.saksnummer}`}>{oppgave.saksnummer}</Link>
                ) : (
                  oppgave.journalpostId
                )}
              </Table.DataCell>
              <Table.DataCell>{mapTilOppgaveBehandlingstypeTekst(oppgave.behandlingstype)}</Table.DataCell>
              <Table.DataCell style={{ maxWidth: '150px' }}>
                <Tooltip content={mapBehovskodeTilBehovstype(oppgave.avklaringsbehovKode as AvklaringsbehovKode)}>
                  <BodyShort truncate>
                    {mapBehovskodeTilBehovstype(oppgave.avklaringsbehovKode as AvklaringsbehovKode)}
                  </BodyShort>
                </Tooltip>
              </Table.DataCell>
              <Table.DataCell>{formaterDatoForFrontend(oppgave.opprettetTidspunkt)}</Table.DataCell>
              <Table.DataCell>{formaterDatoForFrontend(oppgave.behandlingOpprettet)}</Table.DataCell>
              <Table.DataCell>{oppgave.veileder}</Table.DataCell>
              {includeColumns?.includes('reservertAv') && <Table.DataCell>{oppgave.reservertAv || ''}</Table.DataCell>}
              <Table.DataCell>
                <OppgaveKnapp
                  oppgave={oppgave}
                  setFeilmelding={setFeilmelding}
                  visBehandleOgFrigiKnapp={visBehandleOgFrigiKnapp}
                />
              </Table.DataCell>
            </Table.Row>
          ))}
        </Table.Body>
      </TableStyled>
    </VStack>
  );
};
