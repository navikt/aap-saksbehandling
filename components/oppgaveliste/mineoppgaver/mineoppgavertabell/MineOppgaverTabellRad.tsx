import { Oppgave } from 'lib/types/oppgaveTypes';
import { BodyShort, CopyButton, Table, Tooltip } from '@navikt/ds-react';
import Link from 'next/link';
import { storForbokstavIHvertOrd } from 'lib/utils/string';
import { mapBehovskodeTilBehovstype, mapTilOppgaveBehandlingstypeTekst } from 'lib/utils/oversettelser';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { formaterÅrsak } from 'lib/utils/årsaker';
import { OppgaveInformasjon } from 'components/oppgaveliste/oppgaveinformasjon/OppgaveInformasjon';
import { MineOppgaverMeny } from 'components/oppgaveliste/mineoppgaver/mineoppgavermeny/MineOppgaverMeny';
import { ÅrsakTilBehandling } from 'lib/types/types';
import { memo } from 'react';

const OppgaveRad = ({
  oppgave,
  setFeilmelding,
  setIsModalOpen,
  revalidateFunction,
}: {
  oppgave: Oppgave;
  setFeilmelding: React.Dispatch<React.SetStateAction<string | undefined>>;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  revalidateFunction: () => void;
}) => {
  return (
    <Table.Row key={oppgave.saksnummer || oppgave.journalpostId}>
      <Table.DataCell textSize={'small'}>
        {oppgave.saksnummer ? (
          <Link href={`/saksbehandling/sak/${oppgave.saksnummer}`}>{storForbokstavIHvertOrd(oppgave.personNavn)}</Link>
        ) : (
          <span>{storForbokstavIHvertOrd(oppgave.personNavn)}</span>
        )}
      </Table.DataCell>
      <Table.DataCell textSize={'small'}>
        {oppgave.personIdent ? (
          <CopyButton copyText={oppgave.personIdent} size="xsmall" text={oppgave.personIdent} iconPosition="right" />
        ) : (
          'Ukjent'
        )}
      </Table.DataCell>
      <Table.DataCell textSize={'small'}>{oppgave.saksnummer || oppgave.journalpostId}</Table.DataCell>
      <Table.DataCell textSize={'small'}>{mapTilOppgaveBehandlingstypeTekst(oppgave.behandlingstype)}</Table.DataCell>
      <Table.DataCell textSize={'small'}>{formaterDatoForFrontend(oppgave.behandlingOpprettet)}</Table.DataCell>
      <Table.DataCell style={{ maxWidth: '150px' }} textSize={'small'}>
        <Tooltip
          content={oppgave.årsakerTilBehandling.map((årsak) => formaterÅrsak(årsak as ÅrsakTilBehandling)).join(', ')}
        >
          <BodyShort truncate size={'small'}>
            {oppgave.årsakerTilBehandling.map((årsak) => formaterÅrsak(årsak as ÅrsakTilBehandling)).join(', ')}
          </BodyShort>
        </Tooltip>
      </Table.DataCell>
      <Table.DataCell style={{ maxWidth: '150px' }} textSize={'small'}>
        <Tooltip content={mapBehovskodeTilBehovstype(oppgave.avklaringsbehovKode)}>
          <BodyShort truncate size={'small'}>
            {mapBehovskodeTilBehovstype(oppgave.avklaringsbehovKode)}
          </BodyShort>
        </Tooltip>
      </Table.DataCell>
      <Table.DataCell textSize={'small'}>
        <OppgaveInformasjon oppgave={oppgave} />
      </Table.DataCell>
      <Table.DataCell textSize={'small'} align={'right'}>
        <MineOppgaverMeny
          oppgave={oppgave}
          setFeilmelding={setFeilmelding}
          revalidateFunction={revalidateFunction}
          setÅpenModal={setIsModalOpen}
        />
      </Table.DataCell>
    </Table.Row>
  );
};

export const MineOppgaverTabellRad = memo(OppgaveRad);
MineOppgaverTabellRad.displayName = 'MineOppgaverTabellRad';
