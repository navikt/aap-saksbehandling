import { AktivitetspliktHendelse } from 'lib/types/types';

import styles from 'components/aktivitetsplikthendelsertabell/AktivitetspliktHendelserTabell.module.css';
import { Table } from '@navikt/ds-react';
import { formaterDatoForFrontend } from 'lib/utils/date';

interface Props {
  aktivitetspliktHendelser?: AktivitetspliktHendelse[];
}

export const AktivitetspliktHendelserTabell = ({ aktivitetspliktHendelser }: Props) => {
  const harAktivitetsmeldingeraktivitetsmeldinger = aktivitetspliktHendelser && aktivitetspliktHendelser.length > 0;

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
              {aktivitetspliktHendelser?.map((aktivitetspliktHendelse, index) => {
                return (
                  <Table.Row key={index}>
                    <Table.DataCell>{aktivitetspliktHendelse.paragraf}</Table.DataCell>
                    <Table.DataCell>{aktivitetspliktHendelse.brudd}</Table.DataCell>
                    <Table.DataCell>{formaterDatoForFrontend(aktivitetspliktHendelse.periode.fom)}</Table.DataCell>
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
