import { FastSettArbeidsevnePeriode } from 'components/fastsettarbeidsevneperiodeform/FastsettArbeidsevnePeriodeForm';
import { formaterDato } from 'lib/utils/date';
import { Table } from '@navikt/ds-react';
interface Props extends FastSettArbeidsevnePeriode {
  onDelete: (id: string) => void;
}
export const FastsettArbeidsevnePeriodeTableItem = ({ id, fraDato, arbeidsevne, benevning }: Props) => {
  return (
    <Table.Row key={id}>
      <Table.DataCell>{formaterDato(fraDato)}</Table.DataCell>
      <Table.DataCell>{`${arbeidsevne} ${benevning}`}</Table.DataCell>
      <Table.DataCell>
        <button type={'button'}>Slett</button>
      </Table.DataCell>
    </Table.Row>
  );
};
