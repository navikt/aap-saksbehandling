import { Button, Heading, Table } from '@navikt/ds-react';
import { MigrertKravVurdering } from 'lib/types/types';
import { formaterDatoForFrontend } from 'lib/utils/date';

import { formaterKravtype } from 'components/behandlinger/krav/kravutils';
import { TableStyled } from 'components/tablestyled/TableStyled';

interface Props {
  migrertKrav: MigrertKravVurdering;
  readOnly: boolean;
  åpen: boolean;
  onToggleÅpen: () => void;
}

export const MigrerteKravTabell = ({ migrertKrav, readOnly, åpen, onToggleÅpen }: Props) => {
  return (
    <>
      <Heading size="xsmall">Migrert sak</Heading>
      <TableStyled size="small">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell>Arenasaksnr</Table.HeaderCell>
            <Table.HeaderCell>Type</Table.HeaderCell>
            <Table.HeaderCell>Virkningstidspunkt på sak</Table.HeaderCell>
            <Table.HeaderCell>Migrert til Kelvin</Table.HeaderCell>
            <Table.HeaderCell>Resterende kvote på migreringstidspunkt</Table.HeaderCell>
            <Table.HeaderCell>Vurdert av</Table.HeaderCell>
            <Table.HeaderCell>Valg</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.ExpandableRow content={migrertKrav.begrunnelse} key={migrertKrav.referanse}>
            <Table.DataCell textSize={'small'}>{migrertKrav.arenaSaksnummer}</Table.DataCell>
            <Table.DataCell textSize={'small'}>{formaterKravtype(migrertKrav.type)}</Table.DataCell>
            <Table.DataCell textSize={'small'}>
              {formaterDatoForFrontend(migrertKrav.virkningstidspunktArena)}
            </Table.DataCell>
            <Table.DataCell textSize={'small'}>{formaterDatoForFrontend(migrertKrav.muligRettFra)}</Table.DataCell>
            <Table.DataCell textSize={'small'}>Ordinær: {migrertKrav.resterendeKvoteOrdinær}</Table.DataCell>
            <Table.DataCell textSize={'small'}>{migrertKrav.vurdertAv}</Table.DataCell>
            <Table.DataCell textSize={'small'}>
              <Button
                type="button"
                size="small"
                variant={åpen ? 'primary' : 'secondary'}
                onClick={onToggleÅpen}
                disabled={readOnly}
              >
                {åpen ? 'Lukk' : 'Endre'}
              </Button>
            </Table.DataCell>
          </Table.ExpandableRow>
        </Table.Body>
      </TableStyled>
    </>
  );
};
