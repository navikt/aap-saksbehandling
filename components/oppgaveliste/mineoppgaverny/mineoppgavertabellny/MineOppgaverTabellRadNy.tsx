import { Oppgave } from 'lib/types/oppgaveTypes';
import { BodyShort, CopyButton, Table, Tooltip } from '@navikt/ds-react';
import Link from 'next/link';
import { storForbokstavIHvertOrd } from 'lib/utils/string';
import {
  mapBehovskodeTilBehovstype,
  mapTilOppgaveBehandlingstypeTekst,
  mapTilÅrsakTilOpprettelseTilTekst,
} from 'lib/utils/oversettelser';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { formaterVurderingsbehov } from 'lib/utils/vurderingsbehov';
import { OppgaveInformasjon } from 'components/oppgaveliste/oppgaveinformasjon/OppgaveInformasjon';
import { MineOppgaverMenyNy } from 'components/oppgaveliste/mineoppgaverny/mineoppgavermeny/MineOppgaverMenyNy';
import { VurderingsbehovIntern, ÅrsakTilOpprettelse } from 'lib/types/types';
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
      <Table.DataCell textSize={'small'}>
        {oppgave.årsakTilOpprettelse != null
          ? mapTilÅrsakTilOpprettelseTilTekst(oppgave.årsakTilOpprettelse as ÅrsakTilOpprettelse)
          : ''}
      </Table.DataCell>
      <Table.DataCell style={{ maxWidth: '150px' }} textSize={'small'}>
        <Tooltip
          content={oppgave.vurderingsbehov
            .map((årsak) => formaterVurderingsbehov(årsak as VurderingsbehovIntern))
            .join(', ')}
        >
          <BodyShort truncate size={'small'}>
            {oppgave.vurderingsbehov.map((årsak) => formaterVurderingsbehov(årsak as VurderingsbehovIntern)).join(', ')}
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
      <Table.DataCell textSize={'small'}>{formaterDatoForFrontend(oppgave.opprettetTidspunkt)}</Table.DataCell>
      <Table.DataCell textSize={'small'}>
        <OppgaveInformasjon oppgave={oppgave} />
      </Table.DataCell>
      <Table.DataCell textSize={'small'} align={'right'}>
        <MineOppgaverMenyNy
          oppgave={oppgave}
          setFeilmelding={setFeilmelding}
          revalidateFunction={revalidateFunction}
          setÅpenModal={setIsModalOpen}
        />
      </Table.DataCell>
    </Table.Row>
  );
};

export const MineOppgaverTabellRadNy = memo(OppgaveRad);
MineOppgaverTabellRadNy.displayName = 'MineOppgaverTabellRad';
