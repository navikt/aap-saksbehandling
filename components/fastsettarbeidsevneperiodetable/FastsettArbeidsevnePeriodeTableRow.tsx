import { FastSettArbeidsevnePeriode } from 'components/fastsettarbeidsevneperiodeform/FastsettArbeidsevnePeriodeForm';
import { formaterDato } from 'lib/utils/date';
import { Table } from '@navikt/ds-react';
export const FastsettArbeidsevnePeriodeTableRow = ({
  id,
  fraDato,
  arbeidsevne,
  benevning,
  dokumenterBruktIVurderingen,
}: FastSettArbeidsevnePeriode) => {
  return (
    <Table.Row key={id}>
      <Table.DataCell>{formaterDato(fraDato)}</Table.DataCell>
      <Table.DataCell>{`${arbeidsevne} ${benevning}`}</Table.DataCell>
      <Table.DataCell>{`${dokumenterBruktIVurderingen.join()}`}</Table.DataCell>
    </Table.Row>
  );
};
