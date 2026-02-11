import { NextRequest } from 'next/server';
import { BehandlingsTyperOption } from 'lib/utils/behandlingstyper';
import { FilterTidsEnhet, MineOppgaverQueryParams, Oppgave, OppgavelisteRequest } from 'lib/types/oppgaveTypes';
import { BehandlingstyperRequestQuery, OppslagsPeriode } from 'lib/types/statistikkTypes';
import { SortState } from '@navikt/ds-react';
import {
  NoNavAapOppgaveListeOppgaveSorteringSortBy,
  NoNavAapOppgaveListeOppgaveSorteringSortOrder,
  PathsMineOppgaverGetParametersQuerySortby,
  PathsMineOppgaverGetParametersQuerySortorder,
} from '@navikt/aap-oppgave-typescript-types';
import { exhaustiveCheck } from 'lib/utils/typescript';

export function queryParamsArray(key: string, values: (string | number)[]) {
  const filtered = values.filter((value) => value !== undefined && value !== null && value !== '');
  if (!filtered.length) {
    return '';
  }
  return values.map((e) => `${key}=${e}`).join('&');
}

export type StatistikkQueryParams = {
  behandlingstyper?: Array<BehandlingsTyperOption>;
  antallDager?: number;
  antallBøtter?: number;
  bøtteStørrelse?: number;
  enhet?: FilterTidsEnhet;
  enheter?: string[];
  oppslagsPeriode?: string;
  oppgaveTyper?: string[];
};
export function statistikkQueryparams({
  behandlingstyper,
  antallDager,
  antallBøtter,
  bøtteStørrelse,
  enhet,
  enheter,
  oppslagsPeriode,
  oppgaveTyper,
}: StatistikkQueryParams) {
  const behandlingstyperString = behandlingstyper ? queryParamsArray('behandlingstyper', behandlingstyper) : '';
  const antallDagerString = !antallDager && antallDager !== 0 ? '' : `antallDager=${antallDager}`;
  const antallBøtterString = !antallBøtter && antallBøtter !== 0 ? '' : `antallBøtter=${antallBøtter}`;
  const bøtteStørrelseString = !bøtteStørrelse && bøtteStørrelse !== 0 ? '' : `bøtteStørrelse=${bøtteStørrelse}`;
  const enhetString = enhet ? `enhet=${enhet}` : '';
  const enheterString = enheter ? queryParamsArray('enheter', enheter) : '';
  const oppslagsPeriodeString = oppslagsPeriode ? `oppslagsPeriode=${oppslagsPeriode}` : '';
  const oppgaveTyperString = oppgaveTyper ? queryParamsArray('oppgaveTyper', oppgaveTyper) : '';
  const string = [
    behandlingstyperString,
    antallDagerString,
    antallBøtterString,
    bøtteStørrelseString,
    enhetString,
    enheterString,
    oppslagsPeriodeString,
    oppgaveTyperString,
  ]
    .filter((value) => value)
    .join('&');
  return encodeURI(string);
}

export type StatistikkQueryParamsOutput = {
  behandlingstyper: Array<BehandlingsTyperOption>;
  antallDager?: number;
  antallBøtter?: number;
  bøtteStørrelse?: number;
  enhet?: FilterTidsEnhet;
  enheter: string[];
  oppslagsPeriode?: OppslagsPeriode;
  oppgaveTyper: string[];
};
export function hentStatistikkQueryParams(req: NextRequest): StatistikkQueryParamsOutput {
  const params = req.nextUrl.searchParams;
  const antallDager = params.get('antallDager');
  const enhet = params.get('enhet') as FilterTidsEnhet;
  const antallBøtter = params.get('antallBøtter');
  const bøtteStørrelse = params.get('bøtteStørrelse');
  const behandlingstyper = params.getAll('behandlingstyper').map((e) => e as BehandlingstyperRequestQuery);
  const enheter = params.getAll('enheter');
  const oppslagsPeriode = params.get('oppslagsPeriode') as OppslagsPeriode;
  const oppgaveTyper = params.getAll('oppgaveTyper');
  return {
    ...(enhet ? { enhet } : {}),
    ...(antallBøtter ? { antallBøtter: parseInt(antallBøtter) } : {}),
    ...(bøtteStørrelse ? { bøtteStørrelse: parseInt(bøtteStørrelse) } : {}),
    behandlingstyper,
    enheter,
    antallDager: parseInt(antallDager ?? '0'),
    oppslagsPeriode: oppslagsPeriode ?? '',
    oppgaveTyper,
  };
}
export function mapSortStateTilOppgaveSortering(sortState: SortState): OppgavelisteRequest['sortering'] {
  return {
    sortBy: mapSortStateSortByTilBackendEnum(sortState.orderBy),
    sortOrder: mapSortStateDirectionTilBackendEnum(sortState.direction),
  };
}
export function mapSortStateSortByTilBackendEnum(orderBy: string): NoNavAapOppgaveListeOppgaveSorteringSortBy {
  switch (orderBy) {
    case 'BEHANDLING_OPPRETTET':
      return NoNavAapOppgaveListeOppgaveSorteringSortBy.BEHANDLING_OPPRETTET;
    case 'SAKSNUMMER':
      return NoNavAapOppgaveListeOppgaveSorteringSortBy.SAKSNUMMER;
    case 'BEHANDLINGSTYPE':
      return NoNavAapOppgaveListeOppgaveSorteringSortBy.BEHANDLINGSTYPE;
    case 'ÅRSAK_TIL_OPPRETTELSE':
      return NoNavAapOppgaveListeOppgaveSorteringSortBy._RSAK_TIL_OPPRETTELSE;
    case 'AVKLARINGSBEHOV_KODE':
      return NoNavAapOppgaveListeOppgaveSorteringSortBy.AVKLARINGSBEHOV_KODE;
    case 'OPPRETTET_TIDSPUNKT':
      return NoNavAapOppgaveListeOppgaveSorteringSortBy.OPPRETTET_TIDSPUNKT;
    case 'PERSONIDENT':
      return NoNavAapOppgaveListeOppgaveSorteringSortBy.PERSONIDENT;
  }
  console.error(`Finner ikke mapping til backend enum for sortering: ${orderBy}`);
  throw new Error(`Finner ikke mapping til backend enum for sortering: ${orderBy}`);
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
  throw new Error(`Finner ikke mapping til query param sort order enum for: ${direction}`);
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
  const sortBy = params?.sortby ? `sortby=${params.sortby}` : '';
  const sortOrder = params?.sortorder ? `sortorder=${params.sortorder}` : '';
  const string = [sortBy, sortOrder].filter((value) => value).join('&');
  return encodeURI(string);
}

export function hentMineOppgaverQueryParams(req: NextRequest): MineOppgaverQueryParams {
  const params = req.nextUrl.searchParams;
  const kunPåVent = params.get('kunPaaVent');
  const sortByStr = params.get('sortby');
  const sortBy = sortByStr ? validerSortByQueryParamEnum(sortByStr) : null;
  const sortOrderStr = params.get('sortorder');
  const sortOrder = sortOrderStr ? validerSortOrderQueryParamEnum(sortOrderStr) : null;
  return {
    ...(kunPåVent ? { kunPaaVent: kunPåVent === 'true' } : {}),
    ...(sortBy ? { sortBy } : {}),
    ...(sortOrder ? { sortOrder } : {}),
  };
}
function validerSortByQueryParamEnum(str: string): PathsMineOppgaverGetParametersQuerySortby {
  switch (str) {
    case 'PERSONIDENT':
      return PathsMineOppgaverGetParametersQuerySortby.PERSONIDENT;
    case 'BEHANDLINGSTYPE':
      return PathsMineOppgaverGetParametersQuerySortby.BEHANDLINGSTYPE;
    case 'BEHANDLING_OPPRETTET':
      return PathsMineOppgaverGetParametersQuerySortby.BEHANDLING_OPPRETTET;
    case 'ÅRSAK_TIL_OPPRETTELSE':
      return PathsMineOppgaverGetParametersQuerySortby._RSAK_TIL_OPPRETTELSE;
    case 'AVKLARINGSBEHOV_KODE':
      return PathsMineOppgaverGetParametersQuerySortby.AVKLARINGSBEHOV_KODE;
    case 'OPPRETTET_TIDSPUNKT':
      return PathsMineOppgaverGetParametersQuerySortby.OPPRETTET_TIDSPUNKT;
  }
  throw new Error(`Fant ikke mapping til backend enum for sortby query param: ${str}`);
}

function validerSortOrderQueryParamEnum(str: string) {
  switch (str) {
    case 'DESC':
      return PathsMineOppgaverGetParametersQuerySortorder.DESC;
    case 'ASC':
      return PathsMineOppgaverGetParametersQuerySortorder.ASC;
  }
  throw new Error(`Fant ikke mapping til backend enum for sortorder query param: ${str}`);
}

function buildSaksbehandlingsURL(oppgave: Oppgave): string {
  return `/saksbehandling/sak/${oppgave.saksnummer}/${oppgave?.behandlingRef}`;
}
function buildPostmottakURL(oppgave: Oppgave): string {
  return `/postmottak/${oppgave?.behandlingRef}`;
}
export function byggKelvinURL(oppgave: Oppgave): string {
  if (oppgave.journalpostId) {
    return buildPostmottakURL(oppgave);
  } else {
    return buildSaksbehandlingsURL(oppgave);
  }
}
