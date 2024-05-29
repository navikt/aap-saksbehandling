import { Button, Table } from '@navikt/ds-react';
import { useState } from 'react';
import { PencilIcon } from '@navikt/aksel-icons';
import { AktivitetHistorikkType } from 'components/aktivitethistorikk/AktivitetHistorikk';
import { EndreAktivitetForm } from 'components/aktivitethistorikk/EndreAktivitetForm';
interface Props {
  key: number;
  aktivitet: AktivitetHistorikkType;
}
export const AktivitetHistorikkTableRow = ({ aktivitet, key }: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <Table.ExpandableRow key={key} content={<EndreAktivitetForm />} togglePlacement={'right'} open={isOpen}>
      <Table.DataCell>{`${aktivitet.dato}`}</Table.DataCell>
      <Table.DataCell>{aktivitet.grunn}</Table.DataCell>
      <Table.DataCell>{aktivitet.begrunnelse}</Table.DataCell>
      <Table.DataCell>
        {
          <Button icon={<PencilIcon />} type={'button'} onClick={() => setIsOpen(!isOpen)}>
            Endre
          </Button>
        }
      </Table.DataCell>
    </Table.ExpandableRow>
  );
};
