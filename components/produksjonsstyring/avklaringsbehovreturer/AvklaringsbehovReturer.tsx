'use client';

import { BodyShort, Detail, Table, VStack } from '@navikt/ds-react';
import { PlotWrapper } from '../plotwrapper/PlotWrapper';
import { BehandlingAvklaringsbehovRetur, BehandlingAvklaringsbehovReturDTO } from 'lib/types/statistikkTypes';
import { sekunderTilDager } from 'lib/utils/time';
import { ScopedSortState, useSortertListe } from 'hooks/oppgave/SorteringHook';
import styles from '../totaloversiktbehandlinger/TotaloversiktBehandlinger.module.css';
import { mapBehovskodeTilBehovstype, mapGrunnTilString, mapReturFraStatusTilTekst } from 'lib/utils/oversettelser';

interface Props {
  data: Array<BehandlingAvklaringsbehovReturDTO>;
}

export const AvklaringsbehovReturer = ({ data }: Props) => {
  const { sort, håndterSortering, sortertListe } = useSortertListe(data);

  return (
    <PlotWrapper>
      <VStack align={'center'} gap={'2'}>
        <BodyShort size={'small'}>Returer</BodyShort>
        <Detail className={styles.detailgray}>
          Åpne behandlinger som har blitt returnert fra kvalitetssikrer eller beslutter
        </Detail>
      </VStack>
      <VStack padding={'space-8'} />
      <Table
        sort={sort}
        onSortChange={(sortKey) =>
          // @ts-ignore
          håndterSortering(sortKey as ScopedSortState<BehandlingAvklaringsbehovRetur>['orderBy'])
        }
      >
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Avklaringsbehov</Table.HeaderCell>
            <Table.ColumnHeader sortKey={'antallTotalt'} sortable={true}>
              Antall
            </Table.ColumnHeader>
            <Table.ColumnHeader sortKey={'returFra'}>Retur fra</Table.ColumnHeader>
            <Table.ColumnHeader sortKey={'årsakTilRetur'}>Årsak til retur</Table.ColumnHeader>
            <Table.ColumnHeader sortKey={'antallIndividuelt'} sortable={true}>
              Antall
            </Table.ColumnHeader>
            <Table.ColumnHeader sortKey={'gjennomsnittligAlder'} sortable={true}>
              Snittalder
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {sortertListe.map((avklaringsbehov, groupIdx) =>
            avklaringsbehov.returerPerAvklaringsbehov.map((row, rowIdx) => (
              <Table.Row key={`${groupIdx}-${rowIdx}`}>
                {rowIdx === 0 && (
                  <>
                    <Table.DataCell rowSpan={avklaringsbehov.returerPerAvklaringsbehov.length}>
                      {mapBehovskodeTilBehovstype(row.avklaringsbehov.toString())}
                    </Table.DataCell>
                    <Table.DataCell rowSpan={avklaringsbehov.returerPerAvklaringsbehov.length}>
                      {avklaringsbehov.totalt}
                    </Table.DataCell>
                  </>
                )}
                <Table.DataCell>{mapReturFraStatusTilTekst(row.returFra)}</Table.DataCell>
                <Table.DataCell>{mapGrunnTilString(row.returÅrsak)}</Table.DataCell>
                <Table.DataCell>{row.antallÅpneBehandlinger}</Table.DataCell>
                <Table.DataCell>{sekunderTilDager(row.gjennomsnittTidFraRetur)}</Table.DataCell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table>
    </PlotWrapper>
  );
};
