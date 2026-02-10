import { NextRequest } from 'next/server';
import { BehandlingsTyperOption } from 'lib/utils/behandlingstyper';
import { FilterTidsEnhet, Oppgave } from 'lib/types/oppgaveTypes';
import { BehandlingstyperRequestQuery, OppslagsPeriode } from 'lib/types/statistikkTypes';
import { SortState } from '@navikt/ds-react';

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
// TODO: hent denne fra backend
export type MineOppgaverQueryParams = {
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
};
export function mineOppgaverQueryParams(sortering: SortState) {
  const sortBy = sortering?.orderBy ? `sortby=${sortering.orderBy}` : '';
  const sortOrder = sortering?.direction ? `sortorder=${sortering.direction}` : '';
  const string = [sortBy, sortOrder].filter((value) => value).join('&');
  return encodeURI(string);
}
export function hentMineOppgaverQueryParams(req: NextRequest): MineOppgaverQueryParams {
  const params = req.nextUrl.searchParams;
  const sortBy = params.get('sortBy');
  const sortOrder = params.get('sortOrder') as MineOppgaverQueryParams['sortOrder'];
  return {
    ...(sortBy ? { sortBy } : {}),
    ...(sortOrder ? { sortOrder } : {}),
  };
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
