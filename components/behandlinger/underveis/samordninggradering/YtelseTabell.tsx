'use client';

import { Table } from '@navikt/ds-react';
import { SamordningGraderingYtelse } from 'lib/types/types';

import { formaterDatoForVisning } from '@navikt/aap-felles-utils-client';
import styles from './YtelseTabell.module.css';

interface Props {
  ytelser: SamordningGraderingYtelse[];
}

export const YtelseTabell = ({ ytelser }: Props) => {
  return (
    <>
      <Table className={styles.ytelsestabell}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Periode</Table.HeaderCell>
            <Table.HeaderCell>Ytelse</Table.HeaderCell>
            <Table.HeaderCell>Kilde</Table.HeaderCell>
            <Table.HeaderCell>Grad fra kilde</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {ytelser.map((ytelse) => (
            <Table.Row key={ytelse.saksRef}>
              <Table.DataCell textSize="small">
                {formaterDatoForVisning(ytelse.periode.fom)} - {formaterDatoForVisning(ytelse.periode.tom)}
              </Table.DataCell>
              <Table.DataCell textSize="small">{ytelse.ytelseType}</Table.DataCell>
              <Table.DataCell textSize="small">{ytelse.kilde}</Table.DataCell>
              <Table.DataCell textSize="small">{ytelse.gradering}</Table.DataCell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </>
  );
};
