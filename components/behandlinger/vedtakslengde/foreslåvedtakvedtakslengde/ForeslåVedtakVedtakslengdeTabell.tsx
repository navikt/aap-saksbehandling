import { ForeslåVedtakVedtakslengdeGrunnlag } from 'lib/types/types';
import { TableStyled } from 'components/tablestyled/TableStyled';
import { HStack, Table } from '@navikt/ds-react';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { CheckmarkCircleIcon, XMarkOctagonIcon } from '@navikt/aksel-icons';
import styles from 'components/behandlinger/vedtak/foreslåvedtak/foreslåvedtaktabell/ForeslåVedtakTabell.module.css';
import { mapRettighetsTypeTilTekst } from 'lib/utils/rettighetstype';

interface Props {
  grunnlag: ForeslåVedtakVedtakslengdeGrunnlag;
}

export const ForeslåVedtakVedtakslengdeTabell = ({ grunnlag }: Props) => {
  return (
    <TableStyled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Rettighet</Table.HeaderCell>
          <Table.HeaderCell>Periode</Table.HeaderCell>
          <Table.HeaderCell>Type</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {grunnlag.perioder!.length === 0 ? (
          <Table.Row>
            <Table.DataCell>
              <HStack gap={'space-8'} align={'center'}>
                <XMarkOctagonIcon className={styles.avslåttIcon} />
                {mapUtfallTilTekst('IKKE_OPPFYLT')}
              </HStack>
            </Table.DataCell>
            <Table.DataCell>-</Table.DataCell>
            <Table.DataCell>-</Table.DataCell>
          </Table.Row>
        ) : (
          grunnlag.perioder!.map((vedtaksPeriode) => (
            <Table.Row key={`${vedtaksPeriode.utfall}-${vedtaksPeriode.rettighetsType}-${vedtaksPeriode.periode?.fom}`}>
              <Table.DataCell>
                <HStack gap={'space-8'} align={'center'}>
                  {vedtaksPeriode.utfall === 'OPPFYLT' ? (
                    <CheckmarkCircleIcon className={styles.godkjentIcon} />
                  ) : (
                    <XMarkOctagonIcon className={styles.avslåttIcon} />
                  )}
                  {mapUtfallTilTekst(vedtaksPeriode.utfall)}
                </HStack>
              </Table.DataCell>
              <Table.DataCell>
                {formaterDatoForFrontend(vedtaksPeriode.periode.fom)} -{' '}
                {formaterDatoForFrontend(vedtaksPeriode.periode.tom)}
              </Table.DataCell>
              <Table.DataCell>
                {vedtaksPeriode.utfall === 'OPPFYLT' ? mapRettighetsTypeTilTekst(vedtaksPeriode.rettighetsType) : '–'}
              </Table.DataCell>
            </Table.Row>
          ))
        )}
      </Table.Body>
    </TableStyled>
  );
};

function mapUtfallTilTekst(utfall: string) {
  switch (utfall) {
    case 'OPPFYLT':
      return 'AAP innvilget';
    case 'IKKE_OPPFYLT':
      return 'Ikke rett på AAP';
  }
}
