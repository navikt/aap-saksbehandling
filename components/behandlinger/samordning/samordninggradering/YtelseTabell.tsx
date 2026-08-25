'use client';

import { FilesIcon } from '@navikt/aksel-icons';
import { BodyShort, Box, Button, HStack, Label, Table, VStack } from '@navikt/ds-react';
import { useFeatureFlag } from 'context/UnleashContext';
import { SamordningGraderingYtelse } from 'lib/types/types';

import styles from 'components/behandlinger/samordning/samordninggradering/YtelseTabell.module.css';
import { TableStyled } from 'components/tablestyled/TableStyled';
import { formaterDatoForFrontend } from 'lib/utils/date';

interface Props {
  ytelser: SamordningGraderingYtelse[];
  readOnly: boolean;
  onKopierYtelser: (ytelser: SamordningGraderingYtelse[]) => void;
}

export const YtelseTabell = ({ ytelser, readOnly, onKopierYtelser }: Props) => {
  const kanKopierePerioder = useFeatureFlag('kopierPerioder');

  return (
    <Box>
      <VStack gap={'space-8'}>
        <VStack gap={'space-8'}>
          <Label size="small">Vedtak om folketrygdytelser</Label>
          <BodyShort size="small">Vi har funnet følgende perioder som kan være relevante for AAP</BodyShort>
        </VStack>
        <TableStyled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Ytelse</Table.HeaderCell>
              <Table.HeaderCell>Periode</Table.HeaderCell>
              <Table.HeaderCell>Kilde</Table.HeaderCell>
              <Table.HeaderCell>Grad fra kilde</Table.HeaderCell>
              {kanKopierePerioder && (
                <Table.HeaderCell>
                  <span className="aksel-sr-only">Kopier</span>
                </Table.HeaderCell>
              )}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {!ytelser.length && (
              <Table.Row>
                <Table.DataCell colSpan={kanKopierePerioder ? 5 : 4}>Ingen andre ytelser funnet</Table.DataCell>
              </Table.Row>
            )}
            {ytelser.map((ytelse, index) => {
              const classNames = [
                ytelse.endringStatus === 'NY' && styles.ny,
                ytelse.endringStatus === 'SLETTET' && styles.slettet,
              ].join(' ');
              return (
                <Table.Row key={ytelse.saksRef ?? index} className={classNames}>
                  <Table.DataCell textSize="small">{ytelse.ytelseType}</Table.DataCell>
                  <Table.DataCell textSize="small">
                    <HStack gap={'space-8'} marginInline={'space-8'}>
                      {ytelse.endringStatus === 'NY' && (
                        <BodyShort size="small" weight="semibold" className={styles.nyTag}>
                          Ny
                        </BodyShort>
                      )}
                      {formaterDatoForFrontend(ytelse.periode.fom)} - {formaterDatoForFrontend(ytelse.periode.tom)}
                    </HStack>
                  </Table.DataCell>
                  <Table.DataCell textSize="small">{ytelse.kilde}</Table.DataCell>
                  <Table.DataCell textSize="small">{ytelse.gradering} %</Table.DataCell>
                  {kanKopierePerioder && (
                    <Table.DataCell>
                      <Button
                        size={'small'}
                        variant={'tertiary'}
                        type={'button'}
                        icon={<FilesIcon title={'Kopier periode'} />}
                        onClick={() => onKopierYtelser([ytelse])}
                        disabled={readOnly}
                      />
                    </Table.DataCell>
                  )}
                </Table.Row>
              );
            })}
          </Table.Body>
        </TableStyled>
        {kanKopierePerioder && ytelser.length > 0 && (
          <HStack>
            <Button
              size={'small'}
              variant={'tertiary'}
              type={'button'}
              icon={<FilesIcon aria-hidden />}
              onClick={() => onKopierYtelser(ytelser)}
              disabled={readOnly}
            >
              Kopier alle perioder
            </Button>
          </HStack>
        )}
      </VStack>
    </Box>
  );
};
