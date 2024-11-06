'use client';

import { Button, Checkbox, Table } from '@navikt/ds-react';
import { DokumentTabellRad } from 'components/dokumenttabell/DokumentTabellRad';

import styles from './DokumentTabell.module.css';
import { PlusIcon } from '@navikt/aksel-icons';

export interface Dokument {
  journalpostId: string;
  dokumentId: string;
  tittel: string;
  åpnet?: Date;
  erTilknyttet: boolean;
}

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
    <div className={styles.dokumentTabell}>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell textSize={'small'}>Dokument</Table.HeaderCell>
            <Table.HeaderCell textSize={'small'}>Journalpostid</Table.HeaderCell>
            <Table.HeaderCell textSize={'small'}>Åpnet</Table.HeaderCell>
            <Table.HeaderCell textSize={'small'}>Tilknytt dokument til vurdering</Table.HeaderCell>
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
      <Button
        className={`fit-content ${styles.leggTilDokumentKnapp}`}
        size={'small'}
        icon={<PlusIcon />}
        variant={'tertiary'}
        onClick={(e) => e.preventDefault()}
      >
        Legg til dokument
      </Button>
      <Checkbox value={'dokumentasjonMangler'}>Dokumentasjon mangler</Checkbox>
    </div>
  );
};
