'use client';

import { BodyShort, Box, Label, Table, VStack } from '@navikt/ds-react';
import { SamordningGraderingYtelse } from 'lib/types/types';

import { formaterDatoForVisning } from '@navikt/aap-felles-utils-client';
import styles from './YtelseTabell.module.css';

interface Props {
  ytelser: SamordningGraderingYtelse[];
}

export const YtelseTabell = ({ ytelser }: Props) => {
  return (
    <Box paddingBlock={'4'}>
      <VStack gap={'2'} marginBlock={'4'}>
        <Label size="small">Vedtak om folketrygdytelser</Label>
        <BodyShort size="small">
          Vi har funnet følgende perioder med overlapp mellom andre folketrygdytelser og AAP
        </BodyShort>
      </VStack>
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
          {!ytelser.length && (
            <Table.Row>
              <Table.DataCell colSpan={4}>Ingen andre ytelser funnet</Table.DataCell>
            </Table.Row>
          )}
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
    </Box>
  );
};
