'use client';

import { Table } from '@navikt/ds-react';
import { Dokument } from 'lib/types/types';
import { DokumentTabellRad } from 'components/dokumenttabell/DokumentTabellRad';

const defaultDokumenter: Dokument[] = [
  {
    dokumentId: '123',
    erTilknyttet: false,
    journalpostId: '123',
    tittel: 'Legeerklæring 02.05.2023',
  },
  {
    dokumentId: '456',
    erTilknyttet: false,
    journalpostId: '456',
    tittel: 'Melding om vedtak: yrkesskade',
  },
  {
    dokumentId: '789',
    erTilknyttet: false,
    journalpostId: '789',
    tittel: 'Sykemelding',
  },
];

interface Props {
  dokumenter?: Dokument[];
}

export const DokumentTabell = ({ dokumenter = defaultDokumenter }: Props) => {
  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Dokument</Table.HeaderCell>
          <Table.HeaderCell>Journalpostid</Table.HeaderCell>
          <Table.HeaderCell>Åpnet</Table.HeaderCell>
          <Table.HeaderCell>Tilknytt dokument til vurdering</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      {dokumenter.length > 0 && (
        <Table.Body>
          {dokumenter.map((dokument) => (
            <DokumentTabellRad key={`${dokument.journalpostId}-${dokument.dokumentId}`} dokument={dokument} />
          ))}
        </Table.Body>
      )}
    </Table>
  );
};
