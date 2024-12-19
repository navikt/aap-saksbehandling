import { Table } from '@navikt/ds-react';
import { AktivitetspliktHendelserTabellRad } from 'components/aktivitetsplikt/aktivitetsplikthendelser/aktivitetsplikthendelsertabell/aktivitetsplikthendelsertabellrad/AktivitetspliktHendelserTabellRad';
import { AktivitetspliktHendelserMedFormId } from 'components/aktivitetsplikt/aktivitetsplikthendelser/AktivitetspliktHendelser';

interface Props {
  aktivitetspliktHendelser: AktivitetspliktHendelserMedFormId[];
}

export const AktivitetspliktHendelserTabell = ({ aktivitetspliktHendelser }: Props) => {
  return (
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
          <AktivitetspliktHendelserTabellRad
            key={aktivitetspliktHendelse.id}
            aktivitetspliktHendelse={aktivitetspliktHendelse}
          />
        ))}
      </Table.Body>
    </Table>
  );
};
