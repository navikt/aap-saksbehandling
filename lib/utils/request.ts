import {
  NoNavAapOppgaveListeOppgaveSorteringSortBy,
  NoNavAapOppgaveListeOppgaveSorteringSortOrder,
  PathsMineOppgaverGetParametersQuerySortorder,
} from '@navikt/aap-oppgave-typescript-types';
import { SortState } from '@navikt/ds-react';
import { ScopedBackendSortState } from 'hooks/oppgave/BackendSorteringHook';
import { BehandlingskontekstForOppgave, MineOppgaverQueryParams, OppgavelisteRequest } from 'lib/types/oppgaveTypes';
import { Oppgave } from 'lib/types/types';

export function queryParamsArray(key: string, values: (string | number)[]) {
  const filtered = values.filter((value) => value !== undefined && value !== null && value !== '');
  if (!filtered.length) {
    return '';
  }
  return values.map((e) => `${key}=${e}`).join('&');
}

const validSortKeys = new Set<string>(Object.values(NoNavAapOppgaveListeOppgaveSorteringSortBy));

/**
 * Type guard for enum NoNavAapOppgaveListeOppgaveSorteringSortBy
 *
 * @param value Verdi som skal sjekkes mot enum.
 * @returns boolean
 */
export function isOppgavelisteOppgaveSorteringSortBy(
  value: string | undefined
): value is NoNavAapOppgaveListeOppgaveSorteringSortBy {
  return !!value && validSortKeys.has(value);
}

export function mapSortStateTilOppgaveSortering(
  sortState: ScopedBackendSortState<NoNavAapOppgaveListeOppgaveSorteringSortBy>
): OppgavelisteRequest['sortering'] {
  const sortBy = sortState.orderBy;
  return sortBy
    ? {
        sortBy,
        sortOrder: mapSortStateDirectionTilBackendEnum(sortState.direction),
      }
    : undefined;
}

export function mapSortStateDirectionTilBackendEnum(
  direction: SortState['direction']
): NoNavAapOppgaveListeOppgaveSorteringSortOrder {
  switch (direction) {
    case 'ascending':
      return NoNavAapOppgaveListeOppgaveSorteringSortOrder.ASC;
    case 'descending':
      return NoNavAapOppgaveListeOppgaveSorteringSortOrder.DESC;
  }
  console.error(`Finner ikke mapping til backend enum for sortstatedirection: ${direction}, bruker descending`);
  return NoNavAapOppgaveListeOppgaveSorteringSortOrder.DESC;
}

export function mapSortStateDirectionTilQueryParamEnum(direction: SortState['direction']) {
  switch (direction) {
    case 'ascending':
      return PathsMineOppgaverGetParametersQuerySortorder.ASC;
    case 'descending':
      return PathsMineOppgaverGetParametersQuerySortorder.DESC;
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

// TODO: skal fjernes når frontend ikke lenger bruker Oppgave-typen
export function byggKelvinURLFraOppgave(oppgave: Oppgave): string {
  if (oppgave.journalpostId) {
    return buildPostmottakURL(oppgave.behandlingRef);
  } else if (oppgave.behandlingstype === 'TILBAKEKREVING') {
    if (!oppgave.tilbakekrevingsVarsDto?.tilbakekrevings_URL) {
      throw new Error('Mangler tilbakekrevingsURL for tilbakekreving-oppgave');
    }
    return oppgave.tilbakekrevingsVarsDto.tilbakekrevings_URL;
  } else {
    if (!oppgave.saksnummer) {
      throw new Error('Mangler saksnummer for oppgave');
    }
    return buildSaksbehandlingsURL(oppgave.saksnummer, oppgave.behandlingRef);
  }
}
