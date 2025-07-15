import { Oppgave } from 'lib/types/oppgaveTypes';
import { useState } from 'react';
import {Alert, BodyShort, CopyButton, Table, Tooltip, VStack} from '@navikt/ds-react';
import { TableStyled } from 'components/tablestyled/TableStyled';
import Link from 'next/link';
import { storForbokstavIHvertOrd } from 'lib/utils/string';
import { mapBehovskodeTilBehovstype, mapTilOppgaveBehandlingstypeTekst } from 'lib/utils/oversettelser';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { formaterÅrsak } from 'lib/utils/årsaker';
import { AvklaringsbehovKode, ÅrsakTilBehandling } from 'lib/types/types';
import { ScopedSortState, useSortertListe } from 'hooks/oppgave/SorteringHook';
import { MineOppgaverMeny } from 'components/oppgaveliste/mineoppgaver/mineoppgavermeny/MineOppgaverMeny';
import { OppgaveInformasjon } from 'components/oppgaveliste/oppgaveinformasjon/OppgaveInformasjon';
import {ManglerTilgangModal} from "components/oppgaveliste/manglertilgangmodal/ManglerTilgangModal";
interface Props {
  oppgaver: Oppgave[];
  revalidateFunction: () => void;
}

export const MineOppgaverTabell = ({ oppgaver, revalidateFunction }: Props) => {
  const [feilmelding, setFeilmelding] = useState<string | undefined>();
  const { sort, håndterSortering, sortertListe } = useSortertListe(oppgaver);
  const [isModalOpen, setIsModalOpen] = useState(false);


  return (
    <VStack gap={'5'}>
      <ManglerTilgangModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        revalidateFunction={revalidateFunction}/>
      {feilmelding && <Alert variant={'error'}>{feilmelding}</Alert>}
      <TableStyled
        size={'small'}
        zebraStripes
        sort={sort}
        onSortChange={(sortKey) => håndterSortering(sortKey as ScopedSortState<Oppgave>['orderBy'])}
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
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {sortertListe.map((oppgave, i) => (
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

              <Table.DataCell textSize={'small'}>
                <OppgaveInformasjon oppgave={oppgave} />
              </Table.DataCell>

              <Table.DataCell textSize={'small'} align={'right'}>
                <MineOppgaverMeny
                  oppgave={oppgave}
                  setFeilmelding={setFeilmelding}
                  revalidateFunction={revalidateFunction}
                  setÅpenModal={setIsModalOpen}
                />
              </Table.DataCell>
            </Table.Row>
          ))}
        </Table.Body>
      </TableStyled>
    </VStack>
  );
};
