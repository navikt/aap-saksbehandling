import { NextRequest } from 'next/server';
import { BehandlingsTyperOption } from 'lib/utils/behandlingstyper';
import { AvklaringsbehovReferanse, FilterTidsEnhet, Oppgave } from 'lib/types/oppgaveTypes';
import { BehandlingstyperRequestQuery } from 'lib/types/statistikkTypes';

export function queryParamsArray(key: string, values: (string | number)[]) {
  const filtered = values.filter((value) => value !== undefined && value !== null && value !== '');
  if (!filtered.length) {
    return '';
  }
  return values.map((e) => `${key}=${e}`).join('&');
}

export type StatistikkQueryParams = {
  behandlingstyper: Array<BehandlingsTyperOption>;
  antallDager?: number;
  antallBøtter?: number;
  bøtteStørrelse?: number;
  enhet?: FilterTidsEnhet;
  enheter?: string[];
};
export function statistikkQueryparams({
  behandlingstyper,
  antallDager,
  antallBøtter,
  bøtteStørrelse,
  enhet,
  enheter,
}: StatistikkQueryParams) {
  const behandlingstyperString = queryParamsArray('behandlingstyper', behandlingstyper);
  const antallDagerString = !antallDager && antallDager !== 0 ? '' : `antallDager=${antallDager}`;
  const antallBøtterString = !antallBøtter && antallBøtter !== 0 ? '' : `antallBøtter=${antallBøtter}`;
  const bøtteStørrelseString = !bøtteStørrelse && bøtteStørrelse !== 0 ? '' : `bøtteStørrelse=${bøtteStørrelse}`;
  const enhetString = enhet ? `enhet=${enhet}` : '';
  const enheterString = enheter ? queryParamsArray('enheter', enheter) : '';
  const string = [
    behandlingstyperString,
    antallDagerString,
    antallBøtterString,
    bøtteStørrelseString,
    enhetString,
    enheterString,
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
};
export function hentStatistikkQueryParams(req: NextRequest): StatistikkQueryParamsOutput {
  const params = req.nextUrl.searchParams;
  const antallDager = params.get('antallDager');
  const enhet = params.get('enhet') as FilterTidsEnhet;
  const antallBøtter = params.get('antallBøtter');
  const bøtteStørrelse = params.get('bøtteStørrelse');
  const behandlingstyper = params.getAll('behandlingstyper').map((e) => e as BehandlingstyperRequestQuery);
  const enheter = params.getAll('enheter');
  return {
    ...(enhet ? { enhet } : {}),
    ...(antallBøtter ? { antallBøtter: parseInt(antallBøtter) } : {}),
    ...(bøtteStørrelse ? { bøtteStørrelse: parseInt(bøtteStørrelse) } : {}),
    behandlingstyper,
    enheter,
    antallDager: parseInt(antallDager ?? '0'),
  };
}

function buildSaksbehandlingsURL(oppgave: Oppgave | AvklaringsbehovReferanse): string {
  // @ts-ignore
  return `/saksbehandling/sak/${oppgave.saksnummer}/${oppgave?.behandlingRef ?? oppgave?.referanse}`;
}
function buildPostmottakURL(oppgave: Oppgave | AvklaringsbehovReferanse): string {
  // @ts-ignore
  return `/postmottak/${oppgave?.behandlingRef ?? oppgave?.referanse}`;
}
export function byggKelvinURL(oppgave: Oppgave | AvklaringsbehovReferanse): string {
  if (oppgave.journalpostId) {
    return buildPostmottakURL(oppgave);
  } else {
    return buildSaksbehandlingsURL(oppgave);
  }
}
