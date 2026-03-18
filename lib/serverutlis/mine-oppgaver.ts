import 'server-only';

import { NextRequest } from 'next/server';
import { MineOppgaverQueryParams } from 'lib/types/oppgaveTypes';
import {
  PathsMineOppgaverGetParametersQuerySortby,
  PathsMineOppgaverGetParametersQuerySortorder,
} from '@navikt/aap-oppgave-typescript-types';
import { logError } from 'lib/serverutlis/logger';

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

function validerSortByQueryParamEnum(str: string): PathsMineOppgaverGetParametersQuerySortby | null {
  switch (str) {
    case 'BEHANDLINGSTYPE':
      return PathsMineOppgaverGetParametersQuerySortby.BEHANDLINGSTYPE;
    case 'BEHANDLING_OPPRETTET':
      return PathsMineOppgaverGetParametersQuerySortby.BEHANDLING_OPPRETTET;
    case 'ÅRSAK_TIL_OPPRETTELSE':
      return PathsMineOppgaverGetParametersQuerySortby._RSAK_TIL_OPPRETTELSE;
    case 'AVKLARINGSBEHOV_KODE':
      return PathsMineOppgaverGetParametersQuerySortby.AVKLARINGSBEHOV_KODE;
    case 'PERSONIDENT':
      return PathsMineOppgaverGetParametersQuerySortby.PERSONIDENT;
    case 'OPPRETTET_TIDSPUNKT':
      return PathsMineOppgaverGetParametersQuerySortby.OPPRETTET_TIDSPUNKT;
    case 'SAKSNUMMER':
      return PathsMineOppgaverGetParametersQuerySortby.SAKSNUMMER;
  }
  logError(`Mapping feilet for sortby queryparam ${str}`);
  return null;
}

function validerSortOrderQueryParamEnum(str: string): PathsMineOppgaverGetParametersQuerySortorder | null {
  switch (str) {
    case 'DESC':
      return PathsMineOppgaverGetParametersQuerySortorder.DESC;
    case 'ASC':
      return PathsMineOppgaverGetParametersQuerySortorder.ASC;
  }
  logError(`Mapping feilet for sortorder queryparam ${str}`);
  return null;
}
