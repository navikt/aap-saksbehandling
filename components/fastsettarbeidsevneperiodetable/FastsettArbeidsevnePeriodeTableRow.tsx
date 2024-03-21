import { FastSettArbeidsevnePeriode } from 'components/fastsettarbeidsevneperiodeform/FastsettArbeidsevnePeriodeForm';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { BodyLong, Table } from '@navikt/ds-react';
export const FastsettArbeidsevnePeriodeTableRow = ({
  id,
  fraDato,
  arbeidsevne,
  benevning,
  dokumenterBruktIVurderingen,
  begrunnelse,
}: FastSettArbeidsevnePeriode) => {
  return (
    <Table.ExpandableRow key={id} content={<BodyLong>{begrunnelse}</BodyLong>}>
      <Table.DataCell>{formaterDatoForFrontend(fraDato)}</Table.DataCell>
      <Table.DataCell>{`${arbeidsevne} ${benevning}`}</Table.DataCell>
      <Table.DataCell>{`${dokumenterBruktIVurderingen.join()}`}</Table.DataCell>
    </Table.ExpandableRow>
  );
};
