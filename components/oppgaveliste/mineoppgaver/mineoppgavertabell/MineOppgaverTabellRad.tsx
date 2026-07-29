import { Link as AkselLink, BodyShort, CopyButton, Table, Tooltip } from '@navikt/ds-react';
import { OppgaveMedKontekst } from 'lib/types/oppgaveTypes';
import { VurderingsbehovIntern, ÅrsakTilOpprettelse } from 'lib/types/types';
import { formaterDatoForFrontend } from 'lib/utils/date';
import {
  mapBehovskodeTilBehovstype,
  mapTilOppgaveBehandlingstypeTekst,
  mapTilÅrsakTilOpprettelseTilTekst,
} from 'lib/utils/oversettelser';
import { storForbokstavIHvertOrd } from 'lib/utils/string';
import { formaterVurderingsbehov } from 'lib/utils/vurderingsbehov';
import { loggUmamiGåTilSaksoversikt } from 'lib/utils/umami';
import Link from 'next/link';
import { memo } from 'react';

import { MineOppgaverMeny } from 'components/oppgaveliste/mineoppgaver/mineoppgavermeny/MineOppgaverMeny';
import { OppgaveInformasjon } from 'components/oppgaveliste/oppgaveinformasjon/OppgaveInformasjon';

const OppgaveRad = ({
  oppgave,
  setFeilmelding,
  setIsModalOpen,
  revalidateFunction,
}: {
  oppgave: OppgaveMedKontekst;
  setFeilmelding: React.Dispatch<React.SetStateAction<string | undefined>>;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  revalidateFunction: () => void;
}) => {
  return (
    <Table.Row key={oppgave.behandlingskontekst.saksnummer || oppgave.behandlingskontekst.journalpostId}>
      <Table.DataCell textSize={'small'}>
        {oppgave.behandlingskontekst.saksnummer ? (
          <AkselLink 
            as={Link} 
            prefetch={false} 
            href={`/saksbehandling/sak/${oppgave.behandlingskontekst.saksnummer}`}
            onClick={() => loggUmamiGåTilSaksoversikt('MINE_OPPGAVER')}
          >
            {storForbokstavIHvertOrd(oppgave.personOgEnhet.personNavn)}
          </AkselLink>
        ) : (
          <span>{storForbokstavIHvertOrd(oppgave.personOgEnhet.personNavn)}</span>
        )}
      </Table.DataCell>
      <Table.DataCell textSize={'small'}>
        <CopyButton
          copyText={oppgave.personOgEnhet.personIdent}
          size="xsmall"
          text={oppgave.personOgEnhet.personIdent}
          iconPosition="right"
        />
      </Table.DataCell>
      <Table.DataCell textSize={'small'}>
        {oppgave.behandlingskontekst.saksnummer || oppgave.behandlingskontekst.journalpostId}
      </Table.DataCell>
      <Table.DataCell textSize={'small'}>
        {mapTilOppgaveBehandlingstypeTekst(oppgave.behandlingskontekst.behandlingstype)}
      </Table.DataCell>
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
      <Table.DataCell textSize={'small'}>
        {formaterDatoForFrontend(oppgave.oppgaveMetadata.opprettetTidspunkt)}
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
