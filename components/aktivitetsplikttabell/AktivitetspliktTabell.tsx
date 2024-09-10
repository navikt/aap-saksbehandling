import { Aktivitetsmeldinger } from 'lib/types/types';

import styles from 'components/aktivitetsplikttabell/Aktivitetsplikttabell.module.css';
import { Table } from '@navikt/ds-react';

interface Props {
  aktivitetsmeldinger?: Aktivitetsmeldinger;
}

export const AktivitetspliktTabell = ({
  aktivitetsmeldinger = { hammere: [{ type: 'IKKE_MØTT_TIL_BEHANDLING', dato: 'hello pello', begrunnelse: 'hei' }] },
}: Props) => {
  const harAktivitetsmeldingeraktivitetsmeldinger =
    aktivitetsmeldinger.hammere && aktivitetsmeldinger.hammere.length > 0;

  console.log(harAktivitetsmeldingeraktivitetsmeldinger);

  return (
    <div>
      <section className={styles.heading}>
        <b>Tidligere brudd på aktivitetsplikten</b>
        {!harAktivitetsmeldingeraktivitetsmeldinger ? (
          <span>Ingen tidligere brudd registrert</span>
        ) : (
          <Table size={'small'}>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Type brudd</Table.HeaderCell>
                <Table.HeaderCell>Årsak</Table.HeaderCell>
                <Table.HeaderCell>Dato</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {aktivitetsmeldinger?.hammere.map((hammere, index) => {
                return (
                  <Table.Row key={index}>
                    <Table.DataCell>{hammere.begrunnelse}</Table.DataCell>
                    <Table.DataCell>{hammere.type}</Table.DataCell>
                    <Table.DataCell>{hammere.dato}</Table.DataCell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
        )}
      </section>
    </div>
  );
};
