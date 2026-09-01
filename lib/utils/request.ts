import { SortState } from '@navikt/ds-react';
import { ScopedBackendSortState } from 'hooks/oppgave/BackendSorteringHook';
import {
  BehandlingskontekstForOppgave,
  MineOppgaverQueryParams,
  MineOppgaverSortOrder,
  OppgavelisteRequest,
  SortBy,
  SortOrder,
} from 'lib/types/oppgaveTypes';

export function queryParamsArray(key: string, values: (string | number)[]) {
  const filtered = values.filter((value) => value !== undefined && value !== null && value !== '');
  if (!filtered.length) {
    return '';
  }
  return values.map((e) => `${key}=${e}`).join('&');
}

const validSortKeys: Set<SortBy> = new Set([
  'AVKLARINGSBEHOV_KODE',
  'BEHANDLINGSTYPE',
  'BEHANDLING_OPPRETTET',
  'OPPRETTET_TIDSPUNKT',
  'PERSONIDENT',
  'RESERVERT_AV',
  'SAKSNUMMER',
  'TILBAKEKREVINGS_BELOP',
  'ÅRSAK_TIL_OPPRETTELSE',
]);

/**
 * Type guard for SortBy
 *
 * @param value Verdi som skal sjekkes mot SortBy.
 * @returns boolean
 */
export function isOppgavelisteOppgaveSorteringSortBy(value: string | undefined): value is SortBy {
  return !!value && validSortKeys.has(value as SortBy);
}

export function mapSortStateTilOppgaveSortering(
  sortState: ScopedBackendSortState<SortBy>
): OppgavelisteRequest['sortering'] {
  const sortBy = sortState.orderBy;
  return sortBy
    ? {
        sortBy,
        sortOrder: mapSortStateDirectionTilBackendEnum(sortState.direction),
      }
    : undefined;
}

function mapSortStateDirectionTilBackendEnum(direction: SortState['direction']): SortOrder {
  switch (direction) {
    case 'ascending':
      return 'ASC';
    case 'descending':
      return 'DESC';
  }
  console.error(`Finner ikke mapping til backend enum for sortstatedirection: ${direction}, bruker descending`);
  return 'DESC';
}

export function mapSortStateDirectionTilQueryParamEnum(
  direction: SortState['direction']
): MineOppgaverSortOrder | undefined {
  switch (direction) {
    case 'ascending':
      return 'ASC';
    case 'descending':
      return 'DESC';
    default:
      return undefined;
  }
}

export function mineOppgaverQueryParams(params: MineOppgaverQueryParams) {
  const kunpaavent = params?.kunPaaVent ? `kunPaaVent=${params.kunPaaVent}` : '';
  const sortBy = params?.sortby ? `sortby=${params.sortby}` : '';
  const sortOrder = params?.sortorder ? `sortorder=${params.sortorder}` : '';
  const string = [kunpaavent, sortBy, sortOrder].filter((value) => value).join('&');
  return encodeURI(string);
}

function buildSaksbehandlingsURL(saksnummer: string, behandlingsreferanse: string): string {
  return `/saksbehandling/sak/${saksnummer}/${behandlingsreferanse}`;
}
function buildPostmottakURL(behandlingsreferanse: string): string {
  return `/postmottak/${behandlingsreferanse}`;
}
export function byggKelvinURL(oppgaveInfo: BehandlingskontekstForOppgave): string {
  if (oppgaveInfo.journalpostId) {
    return buildPostmottakURL(oppgaveInfo.behandlingsreferanse);
  } else if (oppgaveInfo.behandlingstype === 'TILBAKEKREVING') {
    if (!oppgaveInfo.tilbakekrevingUrl) {
      throw new Error('Mangler tilbakekrevingsURL for plukket tilbakekreving-oppgave');
    }
    return oppgaveInfo.tilbakekrevingUrl;
  } else {
    if (!oppgaveInfo.saksnummer) {
      throw new Error('Mangler saksnummer for plukket oppgave');
    }
    return buildSaksbehandlingsURL(oppgaveInfo.saksnummer, oppgaveInfo.behandlingsreferanse);
  }
}
