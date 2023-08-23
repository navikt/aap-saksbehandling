import { Heading, Table } from '@navikt/ds-react';
import { listeMedSøkereOgSaker } from '../../lib/mock/saksliste';
import { Saksrad } from './Saksrad';

export const Sakstabell = () => {
  const data = listeMedSøkereOgSaker;

  return (
    <section>
      <Heading size={'large'} level={'1'}>
        Oppgaver AAP
      </Heading>
      <Table size={'medium'} zebraStripes>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Søknad</Table.ColumnHeader>
            <Table.ColumnHeader>Bruker</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data.map((søker, index) => (
            <Saksrad key={index} søker={søker} />
          ))}
        </Table.Body>
      </Table>
    </section>
  );
};
