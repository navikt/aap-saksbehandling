import { AktivitetspliktHendelse } from 'lib/types/types';

import styles from 'components/aktivitetsplikt/aktivitetsplikthendelsertabell/AktivitetspliktHendelserTabell.module.css';
import { BodyShort, Label, Table } from '@navikt/ds-react';
import { AktivitetspliktHendelserRad } from 'components/aktivitetsplikt/aktivitetsplikthendelsertabell/AktivitetspliktHendelserRad';

export type AktivitetspliktHendelserMedFormId = AktivitetspliktHendelse & { id: string };

interface Props {
  aktivitetspliktHendelser?: AktivitetspliktHendelserMedFormId[];
}

export const AktivitetspliktHendelserTabell = ({ aktivitetspliktHendelser }: Props) => {
  const harAktivitetsmeldingeraktivitetsmeldinger = aktivitetspliktHendelser && aktivitetspliktHendelser.length > 0;

  return (
    <div className={styles.aktivitetsplikthendelser}>
      <section className={styles.heading}>
        <Label size={'medium'}>Tidligere brudd på aktivitetsplikten</Label>
        {!harAktivitetsmeldingeraktivitetsmeldinger ? (
          <BodyShort>Ingen tidligere brudd registrert</BodyShort>
        ) : (
          <Table size={'small'}>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>§</Table.HeaderCell>
                <Table.HeaderCell>Brudd</Table.HeaderCell>
                <Table.HeaderCell>Grunn</Table.HeaderCell>
                <Table.HeaderCell>Begrunnelse</Table.HeaderCell>
                <Table.HeaderCell>Periode</Table.HeaderCell>
                <Table.HeaderCell></Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {aktivitetspliktHendelser?.map((aktivitetspliktHendelse) => (
                <AktivitetspliktHendelserRad
                  key={aktivitetspliktHendelse.id}
                  aktivitetspliktHendelse={aktivitetspliktHendelse}
                />
              ))}
            </Table.Body>
          </Table>
        )}
      </section>
    </div>
  );
};
