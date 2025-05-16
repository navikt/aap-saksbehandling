'use client';

import { AvklaringsbehovKode, Oppgave, ÅrsakTilBehandling } from 'lib/types/types';
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
import { useCallback, useMemo, useState } from 'react';
import { oppgaveBehandlingstyper } from 'lib/utils/behandlingstyper';
import { oppgaveAvklaringsbehov } from 'lib/utils/avklaringsbehov';
import { ComboboxOption } from '@navikt/ds-react/cjs/form/combobox/types';
import { ComboboxControlled } from 'components/oppgaveliste/comboboxcontrolled/ComboboxControlled';
import { formaterDatoForFrontend } from 'lib/utils/date';
import Link from 'next/link';
import { OppgaveKnapp } from 'components/oppgaveliste/oppgaveknapp/OppgaveKnapp';
import { TableStyled } from 'components/tablestyled/TableStyled';
import { storForbokstavIHvertOrd } from 'lib/utils/string';
import { formaterÅrsak } from 'lib/utils/årsaker';
import { PåVentInfoboks } from 'components/oppgaveliste/påventinfoboks/PåVentInfoboks';

interface Props {
  heading?: string;
  oppgaver: Oppgave[];
  visBehandleOgFrigiKnapp?: boolean;
  showDropdownActions?: boolean;
  showSortAndFiltersInTable?: boolean;
  showSortingComboboxes?: boolean;
  includeColumns?: 'reservertAv'[];
  isLoading?: boolean;
  revalidateFunction?: () => void;
}

export interface ScopedSortState extends SortState {
  orderBy: keyof Oppgave;
}

export const OppgaveTabell = ({
  oppgaver,
  heading,
  showSortingComboboxes = false,
  showSortAndFiltersInTable = false,
  visBehandleOgFrigiKnapp = false,
  includeColumns = [],
  isLoading = false,
  revalidateFunction,
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

  const behandlingstypeFilter = useCallback(
    (oppgave: Oppgave) => {
      return selectedBehandlingstyper.length > 0
        ? selectedBehandlingstyper.find((option) => option.value === oppgave.behandlingstype)
        : true;
    },
    [selectedBehandlingstyper]
  );

  const avklaringsbehovFilter = useCallback(
    (oppgave: Oppgave) =>
      selectedAvklaringsbehov.length > 0
        ? selectedAvklaringsbehov.find((option) => option.value === oppgave.avklaringsbehovKode)
        : true,
    [selectedAvklaringsbehov]
  );

  const filtrerteOppgaver = useMemo(
    () => sortedOppgaver.filter((oppgave) => behandlingstypeFilter(oppgave) && avklaringsbehovFilter(oppgave)),
    [sortedOppgaver, avklaringsbehovFilter, behandlingstypeFilter]
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
      {showSortingComboboxes && (
        <Box background="surface-subtle" padding="4" borderRadius="xlarge">
          <HStack gap={'4'}>
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
            <Table.ColumnHeader sortKey={'personNavn'} sortable={showSortAndFiltersInTable} textSize={'small'}>
              Navn
            </Table.ColumnHeader>
            <Table.ColumnHeader sortKey={'personIdent'} sortable={showSortAndFiltersInTable} textSize={'small'}>
              Fnr
            </Table.ColumnHeader>
            <Table.ColumnHeader sortKey={'saksnummer'} sortable={showSortAndFiltersInTable}>
              ID
            </Table.ColumnHeader>
            <Table.HeaderCell>Behandlingstype</Table.HeaderCell>
            <Table.ColumnHeader sortKey={'behandlingOpprettet'} sortable={showSortAndFiltersInTable}>
              Beh. opprettet
            </Table.ColumnHeader>
            <Table.ColumnHeader sortKey={'årsak'} sortable={showSortAndFiltersInTable}>
              Årsak
            </Table.ColumnHeader>
            <Table.HeaderCell>Oppgave</Table.HeaderCell>
            <Table.ColumnHeader sortKey={'opprettetTidspunkt'} sortable={showSortAndFiltersInTable}>
              Oppg. opprettet
            </Table.ColumnHeader>
            {includeColumns?.includes('reservertAv') && (
              <Table.ColumnHeader sortKey={'reservertAv'} sortable={showSortAndFiltersInTable}>
                Reservert av
              </Table.ColumnHeader>
            )}
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {filtrerteOppgaver.map((oppgave, i) => (
            <Table.Row key={`oppgave-${i}`}>
              <Table.DataCell textSize={'small'}>
                {oppgave.saksnummer ? (
                  <Link href={`/saksbehandling/sak/${oppgave.saksnummer}`}>
                    {storForbokstavIHvertOrd(oppgave.personNavn)}
                  </Link>
                ) : (
                  <span>{storForbokstavIHvertOrd(oppgave.personNavn)}</span>
                )}
              </Table.DataCell>
              <Table.DataCell textSize={'small'}>
                {oppgave.personIdent ? (
                  <CopyButton
                    copyText={oppgave?.personIdent}
                    size="xsmall"
                    text={oppgave?.personIdent}
                    iconPosition="right"
                  />
                ) : (
                  'Ukjent'
                )}
              </Table.DataCell>
              <Table.DataCell textSize={'small'}>{oppgave.saksnummer || oppgave.journalpostId}</Table.DataCell>
              <Table.DataCell textSize={'small'}>
                {mapTilOppgaveBehandlingstypeTekst(oppgave.behandlingstype)}
              </Table.DataCell>
              <Table.DataCell textSize={'small'}>{formaterDatoForFrontend(oppgave.behandlingOpprettet)}</Table.DataCell>
              <Table.DataCell style={{ maxWidth: '150px' }} textSize={'small'}>
                <Tooltip
                  content={oppgave.årsakerTilBehandling
                    .map((årsak) => formaterÅrsak(årsak as ÅrsakTilBehandling))
                    .join(', ')}
                >
                  <BodyShort truncate size={'small'}>
                    {oppgave.årsakerTilBehandling.map((årsak) => formaterÅrsak(årsak as ÅrsakTilBehandling)).join(', ')}
                  </BodyShort>
                </Tooltip>
              </Table.DataCell>
              <Table.DataCell style={{ maxWidth: '150px' }} textSize={'small'}>
                <Tooltip content={mapBehovskodeTilBehovstype(oppgave.avklaringsbehovKode as AvklaringsbehovKode)}>
                  <BodyShort truncate size={'small'}>
                    {mapBehovskodeTilBehovstype(oppgave.avklaringsbehovKode as AvklaringsbehovKode)}
                  </BodyShort>
                </Tooltip>
              </Table.DataCell>
              <Table.DataCell textSize={'small'}>{formaterDatoForFrontend(oppgave.opprettetTidspunkt)}</Table.DataCell>
              {includeColumns?.includes('reservertAv') && <Table.DataCell>{oppgave.reservertAv || ''}</Table.DataCell>}

              <Table.DataCell textSize={'small'}>
                {oppgave.påVentTil && (
                  <PåVentInfoboks
                    frist={oppgave.påVentTil}
                    årsak={oppgave.påVentÅrsak}
                    begrunnelse={oppgave.venteBegrunnelse}
                  />
                )}
              </Table.DataCell>

              <Table.DataCell textSize={'small'}>
                <OppgaveKnapp
                  oppgave={oppgave}
                  setFeilmelding={setFeilmelding}
                  visBehandleOgFrigiKnapp={visBehandleOgFrigiKnapp}
                  revalidateFunction={revalidateFunction}
                />
              </Table.DataCell>
            </Table.Row>
          ))}
        </Table.Body>
      </TableStyled>
    </VStack>
  );
};
