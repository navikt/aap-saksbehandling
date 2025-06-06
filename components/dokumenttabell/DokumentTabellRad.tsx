'use client';

import { Checkbox, Link, Table } from '@navikt/ds-react';

import { formaterDatoForFrontend } from 'lib/utils/date';
import { Dokument } from 'components/dokumenttabell/DokumentTabell';

interface Props {
  dokument: Dokument;
}

export const DokumentTabellRad = ({ dokument }: Props) => {
  return (
    <Table.Row key={`${dokument.journalpostId}-${dokument.dokumentId}`}>
      <Table.DataCell textSize={'small'}>
        <Link
          href={`/saksbehandling/api/dokumenter/${dokument.journalpostId}/${dokument.dokumentId}`}
          target="_blank"
        >
          {dokument.tittel}
        </Link>
      </Table.DataCell>
      <Table.DataCell textSize={'small'}>{dokument.journalpostId}</Table.DataCell>
      <Table.DataCell textSize={'small'}>
        {dokument.åpnet ? formaterDatoForFrontend(dokument.åpnet) : 'Nei'}
      </Table.DataCell>
      <Table.DataCell textSize={'small'}>
        <Checkbox size={'small'} hideLabel value={dokument.journalpostId}>
          Tilknytt dokument til vurdering
        </Checkbox>
      </Table.DataCell>
    </Table.Row>
  );
};
