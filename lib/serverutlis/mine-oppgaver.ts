import { logError } from 'lib/serverutlis/logger';
import { MineOppgaverQueryParams, MineOppgaverSortBy, MineOppgaverSortOrder } from 'lib/types/oppgaveTypes';
import { NextRequest } from 'next/server';
import 'server-only';

export function hentMineOppgaverQueryParams(req: NextRequest): MineOppgaverQueryParams {
  const params = req.nextUrl.searchParams;
  const kunPåVent = params.get('kunPaaVent');
  const sortByStr = params.get('sortby');
  const sortby = sortByStr ? validerSortByQueryParamEnum(sortByStr) : null;
  const sortOrderStr = params.get('sortorder');
  const sortorder = sortOrderStr ? validerSortOrderQueryParamEnum(sortOrderStr) : null;
  return {
    ...(kunPåVent ? { kunPaaVent: kunPåVent === 'true' } : {}),
    ...(sortby ? { sortby } : {}),
    ...(sortorder ? { sortorder } : {}),
  };
}

function validerSortByQueryParamEnum(str: string): MineOppgaverSortBy | null {
  switch (str) {
    case 'BEHANDLINGSTYPE':
      return 'BEHANDLINGSTYPE';
    case 'BEHANDLING_OPPRETTET':
      return 'BEHANDLING_OPPRETTET';
    case 'ÅRSAK_TIL_OPPRETTELSE':
      return 'ÅRSAK_TIL_OPPRETTELSE';
    case 'AVKLARINGSBEHOV_KODE':
      return 'AVKLARINGSBEHOV_KODE';
    case 'PERSONIDENT':
      return 'PERSONIDENT';
    case 'OPPRETTET_TIDSPUNKT':
      return 'OPPRETTET_TIDSPUNKT';
    case 'SAKSNUMMER':
      return 'SAKSNUMMER';
  }
  logError(`Mapping feilet for sortby queryparam ${str}`);
  return null;
}

function validerSortOrderQueryParamEnum(str: string): MineOppgaverSortOrder | null {
  switch (str) {
    case 'DESC':
      return 'DESC';
    case 'ASC':
      return 'ASC';
  }
  logError(`Mapping feilet for sortorder queryparam ${str}`);
  return null;
}
