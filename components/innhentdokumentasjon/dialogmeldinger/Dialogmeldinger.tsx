import { Alert, BodyShort, Button, HStack, Table } from '@navikt/ds-react';
import { LegeerklæringStatus } from 'lib/types/types';
import { ReactNode } from 'react';

import styles from './Dialogmeldinger.module.css';
import { ThumbDownIcon, TimerPauseIcon } from '@navikt/aksel-icons';
import { formaterDatoForFrontend, sorterEtterNyesteDato } from 'lib/utils/date';
import { clientPurrPåLegeerklæring } from 'lib/clientApi';
import { useBehandlingsReferanse } from 'hooks/BehandlingHook';
import { isBefore, subDays } from 'date-fns';

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

const grenseForPurring = subDays(new Date(), 21);
const kanSendePurring = (opprettet: string) => isBefore(new Date(opprettet), grenseForPurring);

const Dialogmelding = ({ melding }: { melding: LegeerklæringStatus }) => {
  const behandlingsreferanse = useBehandlingsReferanse();
  return (
    <Table.Row>
      <Table.DataCell textSize={'small'} className={styles.status}>
        {mapStatusTilTekst(melding.status)}
      </Table.DataCell>
      <Table.DataCell textSize={'small'} className={styles.dato}>
        {formaterDatoForFrontend(melding.opprettet)}
      </Table.DataCell>
      <Table.DataCell textSize={'small'} className={styles.behandlernavn}>
        {melding.behandlerNavn}
      </Table.DataCell>
      <Table.DataCell textSize={'small'}>
        <HStack gap={'2'}>
          {melding.status === 'OK' && (
            <Button
              variant="secondary"
              type="button"
              size="small"
              icon={<ThumbDownIcon title="Avslå legeerklæring" />}
            />
          )}
          {kanSendePurring(melding.opprettet) && (
            <Button
              variant="secondary"
              type="button"
              size="small"
              icon={<TimerPauseIcon title="Send purring" />}
              onClick={() => clientPurrPåLegeerklæring(melding.dialogmeldingUuid, behandlingsreferanse)}
            />
          )}
        </HStack>
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
          <Table.HeaderCell textSize={'small'}>Status</Table.HeaderCell>
          <Table.HeaderCell textSize={'small'}>Bestilt dato</Table.HeaderCell>
          <Table.HeaderCell textSize={'small'}>Behandler</Table.HeaderCell>
          <Table.HeaderCell textSize={'small'}>Handling</Table.HeaderCell>
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
