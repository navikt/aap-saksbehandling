'use client';

import { søkerSchema } from 'lib/types/types';
import { DATO_FORMATER, formaterDatoBirthDate } from 'lib/utils/date';
import styles from './page.module.css';
import { XMarkIcon, CheckmarkIcon } from '@navikt/aksel-icons';
import { BodyShort, Heading, Link, Table } from '@navikt/ds-react';
import { listeMedSøkereOgSaker } from 'lib/mock/saksliste';

const Saksrad = ({ søker }: { søker: søkerSchema }) => {
  return (
    <Table.Row key={søker.sak.saksid}>
      <Table.DataCell>
        {søker.sak.søknadstidspunkt && (
          <Link to={`/sak/${søker.personident}`} as={Link}>
            {formaterDatoBirthDate(søker.sak.søknadstidspunkt, DATO_FORMATER.ddMMMyyyy)}
          </Link>
        )}
      </Table.DataCell>
      <Table.DataCell>{søker.personident}</Table.DataCell>
      <Table.DataCell>&nbsp;</Table.DataCell>
      <Table.DataCell>SaksTag Kommer</Table.DataCell>
      <Table.DataCell>
        {søker.sisteVersjon ? <CheckmarkIcon color={'green'} /> : <XMarkIcon color={'red'} />}
      </Table.DataCell>
    </Table.Row>
  );
};
const Page = () => {
  const data = listeMedSøkereOgSaker;
  const kanSorteres = data && data?.length > 1;

  const IngenSakerFunnet = () => (
    <Table.Row>
      <Table.DataCell colSpan={5} style={{ textAlign: 'center' }}>
        <BodyShort>Fant ingen saker.</BodyShort>
      </Table.DataCell>
    </Table.Row>
  );

  const tabellInnhold = () => {
    if (data?.length === 0) {
      return <IngenSakerFunnet />;
    }
    return data
      ?.sort(
        (søker1: søkerSchema, søker2: søkerSchema) =>
          new Date(søker2.sak.søknadstidspunkt).valueOf() -
          new Date(søker1.sak.søknadstidspunkt).valueOf(),
      )
      .map((søker: søkerSchema) => <Saksrad key={søker.personident} søker={søker} />);
  };

  return (
    <div className={styles.main__content}>
      <section className={styles.saksliste__innhold}>
        <Heading size={'large'} level={'1'}>
          Oppgaver AAP
        </Heading>
        <Table size={'medium'} className={styles.saksliste__tabell} zebraStripes>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader sortable={kanSorteres} sortKey={'søknadsdato'}>
                Søknad
              </Table.ColumnHeader>
              <Table.ColumnHeader sortable={kanSorteres} sortKey={'pid'}>
                Bruker
              </Table.ColumnHeader>
              <Table.ColumnHeader sortable={kanSorteres} sortKey={'status'}>
                Status
              </Table.ColumnHeader>
              <Table.ColumnHeader sortable={kanSorteres} sortKey={'sakstype'}>
                AAP
              </Table.ColumnHeader>
              <Table.ColumnHeader>Siste versjon</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>{tabellInnhold()}</Table.Body>
        </Table>
      </section>
    </div>
  );
};

export default Page;
