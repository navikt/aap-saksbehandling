'use client';

import { BodyShort, Detail, Switch, Table, VStack } from '@navikt/ds-react';
import { PlotWrapper } from 'components/produksjonsstyring/plotwrapper/PlotWrapper';
import { BehandlingAvklaringsbehovRetur, BehandlingAvklaringsbehovReturDTO } from 'lib/types/statistikkTypes';
import { sekunderTilDager } from 'lib/utils/time';
import { ScopedSortState, useSortertListe } from 'hooks/oppgave/SorteringHook';
import styles from '../totaloversiktbehandlinger/TotaloversiktBehandlinger.module.css';
import { mapBehovskodeTilBehovstype, mapGrunnTilString, mapReturFraStatusTilTekst } from 'lib/utils/oversettelser';
import { useState } from 'react';

interface Props {
  data: Array<BehandlingAvklaringsbehovReturDTO>;
}

export const AvklaringsbehovReturer = ({ data }: Props) => {
  const [visning, setVisningMedÅrsak] = useState<string>('medÅrsak');
  const dataMapped = visning === 'medÅrsak' ? data : slåSammenÅrsak(data);
  const { sort, håndterSortering, sortertListe } = useSortertListe(dataMapped);

  return (
    <PlotWrapper>
      <VStack align={'center'} gap={'2'}>
        <BodyShort size={'small'}>Returer</BodyShort>
        <Detail className={styles.detailgray}>
          Åpne behandlinger som har blitt returnert fra kvalitetssikrer eller beslutter
        </Detail>
      </VStack>
      <VStack padding={'space-8'} />
      <VStack align={'center'} gap={'2'}>
        <Switch
          value="medÅrsak"
          checked={visning === 'medÅrsak'}
          onChange={(e) => setVisningMedÅrsak((prevState) => (prevState ? '' : e.target.value))}
        >
          Årsak til retur
        </Switch>
      </VStack>
      <VStack padding={'space-8'} />
      <Table
        sort={sort}
        onSortChange={(sortKey) =>
          håndterSortering(sortKey as ScopedSortState<BehandlingAvklaringsbehovReturDTO>['orderBy'])
        }
      >
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Avklaringsbehov</Table.HeaderCell>
            <Table.ColumnHeader sortKey={'totalt'} sortable={true}>
              Antall
            </Table.ColumnHeader>
            <Table.ColumnHeader>Retur fra</Table.ColumnHeader>
            {visning === 'medÅrsak' && <Table.ColumnHeader>Årsak til retur</Table.ColumnHeader>}
            <Table.ColumnHeader>Antall</Table.ColumnHeader>
            <Table.ColumnHeader>Snittalder</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {sortertListe.map((avklaringsbehov, groupIdx) =>
            avklaringsbehov.returerPerAvklaringsbehov.map((row, rowIdx) => (
              <Table.Row key={`${groupIdx}-${rowIdx}`} shadeOnHover={false}>
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
                {visning === 'medÅrsak' && <Table.DataCell>{mapGrunnTilString(row.returÅrsak)}</Table.DataCell>}
                <Table.DataCell>{row.antallÅpneBehandlinger}</Table.DataCell>
                <Table.DataCell>{sekunderTilDager(row.gjennomsnittTidFraRetur)} dager</Table.DataCell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table>
    </PlotWrapper>
  );
};

function slåSammenÅrsak(
  alleAvklaringsbehov: Array<BehandlingAvklaringsbehovReturDTO> = []
): Array<BehandlingAvklaringsbehovReturDTO> {
  return alleAvklaringsbehov.map((behov) => {
    const grouped: Record<string, BehandlingAvklaringsbehovRetur[]> = {};

    behov.returerPerAvklaringsbehov.forEach((cur) => {
      if (!grouped[cur.returFra]) {
        grouped[cur.returFra] = [];
      }
      grouped[cur.returFra].push(cur);
    });

    const sammenslått = Object.entries(grouped).map(([returFra, items]) => {
      return {
        avklaringsbehov: items[0].avklaringsbehov,
        returFra,
        returÅrsak: '',
        antallÅpneBehandlinger: items.reduce((sum, x) => sum + x.antallÅpneBehandlinger, 0),
        gjennomsnittTidFraRetur: items.reduce((sum, x) => sum + x.gjennomsnittTidFraRetur, 0) / items.length,
      };
    });

    return {
      ...behov,
      returerPerAvklaringsbehov: sammenslått,
    };
  });
}
