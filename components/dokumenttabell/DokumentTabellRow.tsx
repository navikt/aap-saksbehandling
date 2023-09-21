'use client';

import { Checkbox, Link, Table } from '@navikt/ds-react';
import { Dokument } from 'lib/types/types';
import { formaterDato } from 'lib/utils/date';

export interface Props {
  dokument: Dokument;
  onVedleggClick: (journalpostId: string, dokumentId: string) => void;
  onTilknyttetClick: (journalpostId: string, dokumentId: string) => void;
}

export const DokumentTabellRow = ({ dokument, onVedleggClick, onTilknyttetClick }: Props) => {
  return (
    <Table.Row key={`${dokument.journalpostId}-${dokument.dokumentId}`}>
      <Table.DataCell>
        <Link
          href={`/api/dokument/${dokument.journalpostId}/${dokument.dokumentId}`}
          onClick={() => onVedleggClick(dokument.journalpostId, dokument.dokumentId)}
          target="_blank"
        >
          {dokument.tittel}
        </Link>
      </Table.DataCell>
      <Table.DataCell>{dokument.journalpostId}</Table.DataCell>
      <Table.DataCell>{dokument.åpnet ? formaterDato(dokument.åpnet) : 'Nei'}</Table.DataCell>
      <Table.DataCell>
        <Checkbox
          hideLabel
          checked={dokument.erTilknyttet}
          onChange={() => onTilknyttetClick(dokument.journalpostId, dokument.dokumentId)}
        >
          Tilknytt dokument til vurdering
        </Checkbox>
      </Table.DataCell>
    </Table.Row>
  );
};
