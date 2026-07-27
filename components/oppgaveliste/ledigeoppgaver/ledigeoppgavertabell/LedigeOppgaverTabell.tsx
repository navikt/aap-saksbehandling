import { NoNavAapOppgaveListeOppgaveSorteringSortBy } from '@navikt/aap-oppgave-typescript-types';
import { Link as AkselLink, BodyShort, CopyButton, Table, Tooltip } from '@navikt/ds-react';
import { ScopedBackendSortState } from 'hooks/oppgave/BackendSorteringHook';
import { AktivKø } from 'hooks/oppgave/aktivkøHook';
import { Køtype, OppgaveMedKontekst } from 'lib/types/oppgaveTypes';
import { VurderingsbehovIntern, ÅrsakTilOpprettelse } from 'lib/types/types';
import { formaterDatoForFrontend } from 'lib/utils/date';
import {
  mapBehovskodeTilBehovstype,
  mapTilOppgaveBehandlingstypeTekst,
  mapTilÅrsakTilOpprettelseTilTekst,
} from 'lib/utils/oversettelser';
import { isOppgavelisteOppgaveSorteringSortBy } from 'lib/utils/request';
import { formaterTilNok, storForbokstavIHvertOrd } from 'lib/utils/string';
import { formaterVurderingsbehov } from 'lib/utils/vurderingsbehov';
import Link from 'next/link';
import { useState } from 'react';

import { Alert } from 'components/alert/Alert';
import { LedigeOppgaverMeny } from 'components/oppgaveliste/ledigeoppgaver/ledigeoppgavermeny/LedigeOppgaverMeny';
import { ManglerTilgangModal } from 'components/oppgaveliste/manglertilgangmodal/ManglerTilgangModal';
import { OppgaveIkkeLedigModal } from 'components/oppgaveliste/oppgaveikkeledigmodal/OppgaveIkkeLedigModal';
import { OppgaveInformasjon } from 'components/oppgaveliste/oppgaveinformasjon/OppgaveInformasjon';
import { SynkroniserEnhetModal } from 'components/oppgaveliste/synkroniserenhetmodal/SynkroniserEnhetModal';
import { TableStyled } from 'components/tablestyled/TableStyled';
import { TildelOppgaveModal } from 'components/tildeloppgavemodal/TildelOppgaveModal';

interface Props {
  oppgaver: OppgaveMedKontekst[];
  revalidateFunction: () => void;
  setSortBy: (orderBy: NoNavAapOppgaveListeOppgaveSorteringSortBy) => void;
  sort: ScopedBackendSortState<NoNavAapOppgaveListeOppgaveSorteringSortBy> | undefined;
  aktivKø: AktivKø | undefined;
  visBeløpKolonne: boolean;
}

export const LedigeOppgaverTabell = ({
  oppgaver,
  revalidateFunction,
  setSortBy,
  sort,
  aktivKø,
  visBeløpKolonne,
}: Props) => {
  const [feilmelding, setFeilmelding] = useState<string>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visSynkroniserEnhetModal, setVisSynkroniserEnhetModal] = useState<boolean>(false);
  const [saksbehandlerNavn, setSaksbehandlerNavn] = useState<string>();
  const [visOppgaveIkkeLedigModal, setVisOppgaveIkkeLedigModal] = useState<boolean>(false);

  return (
    <>
      <ManglerTilgangModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        revalidateFunction={revalidateFunction}
      />
      <TildelOppgaveModal revalidateFunction={revalidateFunction} />
      <SynkroniserEnhetModal
        visSynkroniserEnhetModal={visSynkroniserEnhetModal}
        setVisSynkroniserEnhetModal={setVisSynkroniserEnhetModal}
      />
      <OppgaveIkkeLedigModal
        visOppgaveIkkeLedigModal={visOppgaveIkkeLedigModal}
        setVisOppgaveIkkeLedigModal={setVisOppgaveIkkeLedigModal}
        saksbehandlerNavn={saksbehandlerNavn}
        revaliderOppgaver={revalidateFunction}
      />
      {feilmelding && <Alert variant={'error'}>{feilmelding}</Alert>}
      <TableStyled
        size={'small'}
        zebraStripes
        sort={sort}
        onSortChange={(sortKey) => {
          if (isOppgavelisteOppgaveSorteringSortBy(sortKey)) {
            setSortBy(sortKey);
          }
        }}
      >
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader textSize={'small'}>Navn</Table.ColumnHeader>
            <Table.ColumnHeader
              sortKey={NoNavAapOppgaveListeOppgaveSorteringSortBy.PERSONIDENT}
              sortable={true}
              textSize={'small'}
            >
              Fnr
            </Table.ColumnHeader>
            <Table.ColumnHeader sortKey={NoNavAapOppgaveListeOppgaveSorteringSortBy.SAKSNUMMER} sortable={true}>
              Sak
            </Table.ColumnHeader>
            <Table.ColumnHeader sortKey={NoNavAapOppgaveListeOppgaveSorteringSortBy.BEHANDLINGSTYPE} sortable={true}>
              Behandlingstype
            </Table.ColumnHeader>
            <Table.ColumnHeader
              sortKey={NoNavAapOppgaveListeOppgaveSorteringSortBy.BEHANDLING_OPPRETTET}
              sortable={true}
            >
              Beh. opprettet
            </Table.ColumnHeader>
            <Table.ColumnHeader
              sortKey={NoNavAapOppgaveListeOppgaveSorteringSortBy._RSAK_TIL_OPPRETTELSE}
              sortable={true}
            >
              Årsak
            </Table.ColumnHeader>
            <Table.ColumnHeader>Vurderingsbehov</Table.ColumnHeader>
            <Table.ColumnHeader
              sortKey={NoNavAapOppgaveListeOppgaveSorteringSortBy.AVKLARINGSBEHOV_KODE}
              sortable={aktivKø?.type !== Køtype.KVALITETSSIKRING}
            >
              {aktivKø?.type !== Køtype.KVALITETSSIKRING ? 'Oppgave' : 'Kontor'}
            </Table.ColumnHeader>
            <Table.ColumnHeader
              sortKey={NoNavAapOppgaveListeOppgaveSorteringSortBy.OPPRETTET_TIDSPUNKT}
              sortable={true}
            >
              Oppg. opprettet
            </Table.ColumnHeader>
            {visBeløpKolonne && (
              <Table.ColumnHeader
                sortKey={NoNavAapOppgaveListeOppgaveSorteringSortBy.TILBAKEKREVINGS_BELOP}
                sortable={true}
              >
                Beløp
              </Table.ColumnHeader>
            )}
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {oppgaver.map((oppgave, i) => (
            <Table.Row key={`oppgave-${i}`}>
              <Table.DataCell textSize={'small'}>
                {oppgave.behandlingskontekst.saksnummer ? (
                  <AkselLink
                    as={Link}
                    prefetch={false}
                    href={`/saksbehandling/sak/${oppgave.behandlingskontekst.saksnummer}`}
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
                    {oppgave.vurderingsbehov
                      .map((årsak) => formaterVurderingsbehov(årsak as VurderingsbehovIntern))
                      .join(', ')}
                  </BodyShort>
                </Tooltip>
              </Table.DataCell>
              <Table.DataCell style={{ maxWidth: '150px' }} textSize={'small'}>
                {aktivKø?.type === Køtype.KVALITETSSIKRING ? (
                  (oppgave.personOgEnhet.enhetForrigeOppgave?.navn ?? '-')
                ) : (
                  <Tooltip content={mapBehovskodeTilBehovstype(oppgave.avklaringsbehovKode)}>
                    <BodyShort truncate size={'small'}>
                      {mapBehovskodeTilBehovstype(oppgave.avklaringsbehovKode)}
                    </BodyShort>
                  </Tooltip>
                )}
              </Table.DataCell>
              <Table.DataCell textSize={'small'}>
                {formaterDatoForFrontend(oppgave.oppgaveMetadata.opprettetTidspunkt)}
              </Table.DataCell>

              {visBeløpKolonne && (
                <Table.DataCell textSize={'small'}>
                  {oppgave.behandlingskontekst.behandlingstype === 'TILBAKEKREVING'
                    ? formaterTilNok(oppgave.tilbakekrevingsVars?.tilbakekrevings_beløp)
                    : ''}
                </Table.DataCell>
              )}

              <Table.DataCell textSize={'small'}>
                <OppgaveInformasjon oppgave={oppgave} />
              </Table.DataCell>

              <Table.DataCell textSize={'small'} align={'right'}>
                <LedigeOppgaverMeny
                  oppgave={oppgave}
                  setFeilmelding={setFeilmelding}
                  setÅpenModal={setIsModalOpen}
                  setVisSynkroniserEnhetModal={setVisSynkroniserEnhetModal}
                  revaliderOppgaver={revalidateFunction}
                  setVisOppgaveIkkeLedigModal={setVisOppgaveIkkeLedigModal}
                  setSaksbehandlerNavn={setSaksbehandlerNavn}
                />
              </Table.DataCell>
            </Table.Row>
          ))}
        </Table.Body>
      </TableStyled>
    </>
  );
};
