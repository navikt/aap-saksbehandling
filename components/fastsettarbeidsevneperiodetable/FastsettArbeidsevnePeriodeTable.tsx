import { ReactNode } from 'react';
import { Table } from '@navikt/ds-react';

interface Props {
  children: ReactNode;
}
export const FastsettArbeidsevnePeriodeTable = ({ children }: Props) => {
  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell scope="col">Fra og med</Table.HeaderCell>
          <Table.HeaderCell scope="col">Arbeidsevne</Table.HeaderCell>
          <Table.HeaderCell scope="col">Tilknyttede dokumenter</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>{children}</Table.Body>
    </Table>
  );
};
