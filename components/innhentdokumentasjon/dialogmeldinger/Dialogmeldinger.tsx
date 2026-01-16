import { Alert, BodyShort, Button, HStack, Table } from '@navikt/ds-react';
import { LegeerklæringStatus } from 'lib/types/types';
import { ReactNode, useState } from 'react';

import styles from './Dialogmeldinger.module.css';
import { PaperplaneIcon } from '@navikt/aksel-icons';
import { formaterDatoForFrontend, sorterEtterNyesteDato } from 'lib/utils/date';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { isBefore, subDays } from 'date-fns';
import { usePurrPåDialogmelding } from 'hooks/FetchHook';

type Props = {
  dialogmeldinger?: LegeerklæringStatus[];
};

const mapStatusTilTekst = (status?: 'BESTILT' | 'SENDT' | 'OK' | 'AVVIST' | null): ReactNode => {
  switch (status) {
    case 'BESTILT':
    case 'SENDT':
    case 'OK':
      return (
        <Alert size={'small'} variant="success" inline>
          Bestilt
        </Alert>
      );
    case 'AVVIST':
      return (
        <Alert size={'small'} variant="error" inline>
          Feilet
        </Alert>
      );
    default:
      return '';
  }
};

const grenseForPurring = subDays(new Date(), 21);
const kanSendePurring = (opprettet: string) => isBefore(new Date(opprettet), grenseForPurring);

const Dialogmelding = ({ melding }: { melding: LegeerklæringStatus }) => {
  const [purringSent, setPurringSent] = useState(false);

  const handlePurringClick = async () => {
    if (!purringSent) {
      setPurringSent(true);
      await purrPåDialogmelding(melding.dialogmeldingUuid, behandlingsreferanse);
    }
  };

  const behandlingsreferanse = useBehandlingsReferanse();
  const { purrPåDialogmelding, isLoading, error } = usePurrPåDialogmelding();

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
      <Table.DataCell textSize={'small'} align="right">
        <HStack gap={'2'} justify="end">
          {kanSendePurring(melding.opprettet) && !purringSent && (
            <Button
              variant="secondary"
              type="button"
              size="small"
              icon={<PaperplaneIcon title="Send purring" />}
              loading={isLoading}
              onClick={handlePurringClick}
            >
              Send purring
            </Button>
          )}

          {purringSent && !error && (
            <Alert variant="success" size="small">
              Purring sendt
            </Alert>
          )}

          {error && (
            <Alert variant="error" size="small">
              {error}
            </Alert>
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
          <Table.HeaderCell textSize={'small'}>Bestilt</Table.HeaderCell>
          <Table.HeaderCell textSize={'small'}>Behandler</Table.HeaderCell>
          <Table.HeaderCell textSize={'small'} align="right">
            Handling
          </Table.HeaderCell>
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
