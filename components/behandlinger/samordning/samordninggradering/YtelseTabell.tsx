'use client';

import { BodyShort, Box, HStack, Label, Table, VStack } from '@navikt/ds-react';
import { SamordningGraderingYtelse } from 'lib/types/types';

import styles from 'components/behandlinger/samordning/samordninggradering/YtelseTabell.module.css';
import { TableStyled } from 'components/tablestyled/TableStyled';
import { formaterDatoForFrontend } from 'lib/utils/date';

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
      <TableStyled>
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
          {ytelser.map((ytelse, index) => {
            const classNames = [
              ytelse.endringStatus === 'NY' && styles.ny,
              ytelse.endringStatus === 'SLETTET' && styles.slettet,
            ].join(' ');
            return (
              <Table.Row key={ytelse.saksRef ?? index} className={classNames}>
                <Table.DataCell textSize="small">
                  <HStack gap={'2'} marginInline={'2'}>
                    {ytelse.endringStatus === 'NY' && (
                      <BodyShort size="small" weight="semibold" className={styles.nyTag}>
                        Ny
                      </BodyShort>
                    )}
                    {formaterDatoForFrontend(ytelse.periode.fom)} - {formaterDatoForFrontend(ytelse.periode.tom)}
                  </HStack>
                </Table.DataCell>
                <Table.DataCell textSize="small">{ytelse.ytelseType}</Table.DataCell>
                <Table.DataCell textSize="small">{ytelse.kilde}</Table.DataCell>
                <Table.DataCell textSize="small">{ytelse.gradering}</Table.DataCell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </TableStyled>
    </Box>
  );
};
