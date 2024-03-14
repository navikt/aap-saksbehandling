'use client';

import { Checkbox, Link, Table } from '@navikt/ds-react';

import { formaterDato } from 'lib/utils/date';
import { Dokument } from 'components/dokumenttabell/DokumentTabell';

export interface Props {
  dokument: Dokument;
}

export const DokumentTabellRad = ({ dokument }: Props) => {
  return (
    <Table.Row key={`${dokument.journalpostId}-${dokument.dokumentId}`}>
      <Table.DataCell>
        <Link
          href={`/api/dokument/${dokument.journalpostId}/${dokument.dokumentId}`}
          onClick={() => console.log('åpner dokument')}
          target="_blank"
        >
          {dokument.tittel}
        </Link>
      </Table.DataCell>
      <Table.DataCell>{dokument.journalpostId}</Table.DataCell>
      <Table.DataCell>{dokument.åpnet ? formaterDato(dokument.åpnet) : 'Nei'}</Table.DataCell>
      <Table.DataCell>
        <Checkbox hideLabel value={dokument.tittel}>
          Tilknytt dokument til vurdering
        </Checkbox>
      </Table.DataCell>
    </Table.Row>
  );
};
