import { formaterDatoForVisning } from '@navikt/aap-felles-utils-client';
import { Alert, BodyShort, Button, Table } from '@navikt/ds-react';
import { LegeerklæringStatus } from 'lib/types/types';
import { ReactNode } from 'react';

import styles from './Dialogmeldinger.module.css';
import { ThumbDownIcon, TimerPauseIcon } from '@navikt/aksel-icons';
import { sorterEtterNyesteDato } from 'lib/utils/date';

type Props = {
  dialogmeldinger?: LegeerklæringStatus[];
};

const mapStatusTilTekst = (status?: 'BESTILT' | 'SENDT' | 'OK' | 'AVVIST' | null): ReactNode => {
  switch (status) {
    case 'BESTILT':
      return (
        <Alert size={'small'} variant="info">
          Bestilt
        </Alert>
      );
    case 'SENDT':
      return (
        <Alert size={'small'} variant="info">
          Sendt
        </Alert>
      );
    case 'OK':
      return (
        <Alert size={'small'} variant="success">
          Mottatt
        </Alert>
      );
    case 'AVVIST':
      return (
        <Alert size={'small'} variant="error">
          Avvist
        </Alert>
      );
    default:
      return '';
  }
};

const Dialogmelding = ({ melding }: { melding: LegeerklæringStatus }) => {
  return (
    <Table.Row>
      <Table.DataCell className={styles.status}>{mapStatusTilTekst(melding.status)}</Table.DataCell>
      <Table.DataCell className={styles.dato}>{formaterDatoForVisning(melding.opprettet)}</Table.DataCell>
      <Table.DataCell className={styles.behandlernavn}>{melding.behandlerNavn}</Table.DataCell>
      <Table.DataCell>
        {melding.status === 'OK' && (
          <Button variant="secondary" type="button" size="small" icon={<ThumbDownIcon title="Avslå legeerklæring" />} />
        )}
        {melding.status === 'SENDT' && (
          <Button variant="secondary" type="button" size="small" icon={<TimerPauseIcon title="Send purring" />} />
        )}
      </Table.DataCell>
    </Table.Row>
  );
};

export const Dialogmeldinger = ({ dialogmeldinger }: Props) => {
  if (!dialogmeldinger || dialogmeldinger.length === 0) {
    return <BodyShort size={'small'}>Det finnes ingen dialogmeldinger for denne saken</BodyShort>;
  }

  return (
    <Table size={'small'}>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Status</Table.HeaderCell>
          <Table.HeaderCell>Bestilt dato</Table.HeaderCell>
          <Table.HeaderCell>Behandler</Table.HeaderCell>
          <Table.HeaderCell>Handling</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {dialogmeldinger
          .sort((a, b) => sorterEtterNyesteDato(a.opprettet, b.opprettet))
          .map((dialogmelding) => (
            <Dialogmelding key={dialogmelding.dialogmeldingUuid} melding={dialogmelding} />
          ))}
      </Table.Body>
    </Table>
  );
};
