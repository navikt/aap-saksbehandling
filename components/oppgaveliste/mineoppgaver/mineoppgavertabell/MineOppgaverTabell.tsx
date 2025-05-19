import { Oppgave } from 'lib/types/oppgaveTypes';
import { useCallback, useMemo, useState, useTransition } from 'react';
import { ComboboxOption } from '@navikt/ds-react/cjs/form/combobox/types';
import {
  Alert,
  BodyShort,
  Box,
  Button,
  CopyButton,
  Dropdown,
  HStack,
  Loader,
  Table,
  Tooltip,
  VStack,
} from '@navikt/ds-react';
import { ComboboxControlled } from 'components/oppgaveliste/comboboxcontrolled/ComboboxControlled';
import { oppgaveBehandlingstyper } from 'lib/utils/behandlingstyper';
import { oppgaveAvklaringsbehov } from 'lib/utils/avklaringsbehov';
import { TableStyled } from 'components/tablestyled/TableStyled';
import Link from 'next/link';
import { storForbokstavIHvertOrd } from 'lib/utils/string';
import { mapBehovskodeTilBehovstype, mapTilOppgaveBehandlingstypeTekst } from 'lib/utils/oversettelser';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { formaterÅrsak } from 'lib/utils/årsaker';
import { AvklaringsbehovKode, ÅrsakTilBehandling } from 'lib/types/types';
import { PåVentInfoboks } from 'components/oppgaveliste/påventinfoboks/PåVentInfoboks';
import { ScopedSortState } from 'components/oppgaveliste/oppgavetabell/OppgaveTabell';
import styles from 'components/oppgaveliste/oppgaveknapp/OppgaveKnapp.module.css';
import { ChevronDownIcon } from '@navikt/aksel-icons';
import { avreserverOppgaveClient, plukkOppgaveClient } from 'lib/oppgaveClientApi';
import { isSuccess } from 'lib/utils/api';
import { byggKelvinURL } from 'lib/utils/request';

interface Props {
  oppgaver: Oppgave[];
}

const oppgaveStatus = { VENT: (oppgave: Oppgave) => !!oppgave.påVentTil } as const;

const oppgaveStatuser: ComboboxOption[] = [{ label: 'På vent', value: 'VENT' }];

export const MineOppgaverTabell = ({ oppgaver }: Props) => {
  const [feilmelding, setFeilmelding] = useState<string | undefined>();
  const [isPendingFrigi, startTransitionFrigi] = useTransition();

  const [sort, setSort] = useState<ScopedSortState | undefined>();

  const [selectedBehandlingstyper, setSelectedBehandlingstyper] = useState<ComboboxOption[]>([]);

  const [selectedAvklaringsbehov, setSelectedAvklaringsbehov] = useState<ComboboxOption[]>([]);

  const [selectedStatus, setSelectedStatus] = useState<ComboboxOption[]>([]);

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

  const statusFilter = useCallback(
    (oppgave: Oppgave) =>
      selectedStatus.length > 0
        ? selectedStatus.find((option) => oppgaveStatus[option.value as keyof typeof oppgaveStatus](oppgave))
        : true,
    [selectedStatus]
  );

  const filtrerteOppgaver = useMemo(
    () =>
      sortedOppgaver.filter(
        (oppgave) => behandlingstypeFilter(oppgave) && avklaringsbehovFilter(oppgave) && statusFilter(oppgave)
      ),
    [sortedOppgaver, avklaringsbehovFilter, behandlingstypeFilter, statusFilter]
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

  async function frigiOppgave(oppgave: Oppgave) {
    startTransitionFrigi(async () => {
      const res = await avreserverOppgaveClient(oppgave);

      if (isSuccess(res)) {
        if (revalidateFunction) {
          revalidateFunction();
        }
      } else {
        setFeilmelding(`Feil ved avreservering av oppgave: ${res.apiException.message}`);
      }
    });
  }

  async function plukkOgGåTilOppgave(oppgave: Oppgave) {
    startTransitionBehandle(async () => {
      if (oppgave.id !== undefined && oppgave.id !== null && oppgave.versjon >= 0) {
        const plukketOppgave = await plukkOppgaveClient(oppgave.id, oppgave.versjon);
        if (isSuccess(plukketOppgave)) {
          router.push(byggKelvinURL(plukketOppgave.data));
        } else {
          setFeilmelding(`Feil ved plukking av oppgave: ${plukketOppgave.apiException.message}`);
        }
      }
    });
  }

  return (
    <VStack gap={'5'}>
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
          <ComboboxControlled
            label={'Status'}
            options={oppgaveStatuser}
            selectedOptions={selectedStatus}
            setSelectedOptions={setSelectedStatus}
          />
        </HStack>
      </Box>

      {feilmelding && <Alert variant={'error'}>{feilmelding}</Alert>}
      <TableStyled
        size={'small'}
        zebraStripes
        sort={sort}
        onSortChange={(sortKey) => handleSort(sortKey as ScopedSortState['orderBy'])}
      >
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader sortKey={'personNavn'} sortable={true} textSize={'small'}>
              Navn
            </Table.ColumnHeader>
            <Table.ColumnHeader sortKey={'personIdent'} sortable={true} textSize={'small'}>
              Fnr
            </Table.ColumnHeader>
            <Table.ColumnHeader sortKey={'saksnummer'} sortable={true}>
              ID
            </Table.ColumnHeader>
            <Table.HeaderCell>Behandlingstype</Table.HeaderCell>
            <Table.ColumnHeader sortKey={'behandlingOpprettet'} sortable={true}>
              Beh. opprettet
            </Table.ColumnHeader>
            <Table.ColumnHeader sortKey={'årsak'} sortable={true}>
              Årsak
            </Table.ColumnHeader>
            <Table.HeaderCell>Oppgave</Table.HeaderCell>
            <Table.ColumnHeader sortKey={'opprettetTidspunkt'} sortable={true}>
              Oppg. opprettet
            </Table.ColumnHeader>

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
                <div className={styles.comboButton}>
                  <Button
                    type={'button'}
                    size={'small'}
                    variant={'secondary'}
                    onClick={() => plukkOgGåTilOppgave(oppgave)}
                    loading={isPendingBehandle}
                  >
                    Behandle
                  </Button>
                  <Dropdown>
                    <Button as={Dropdown.Toggle} size="small" variant="secondary">
                      <HStack align={'center'}>
                        {isPendingFrigi ? <Loader size={'xsmall'} /> : <ChevronDownIcon title="Meny" />}
                      </HStack>
                    </Button>
                    <Dropdown.Menu>
                      <Dropdown.Menu.GroupedList>
                        <Dropdown.Menu.GroupedList.Item onClick={() => frigiOppgave(oppgave)}>
                          Frigi oppgave
                        </Dropdown.Menu.GroupedList.Item>
                      </Dropdown.Menu.GroupedList>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </Table.DataCell>
            </Table.Row>
          ))}
        </Table.Body>
      </TableStyled>
    </VStack>
  );
};
