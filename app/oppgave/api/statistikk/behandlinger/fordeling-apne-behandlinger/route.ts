import { NextRequest } from 'next/server';
import { hentStatistikkQueryParams } from 'lib/utils/request';
import { hentFordelingÅpneBehandlinger } from 'lib/services/statistikkservice/statistikkService';
import { FilterTidsEnhet } from 'lib/types/oppgaveTypes';
import { logError } from 'lib/serverutlis/logger';

export async function GET(req: NextRequest) {
  const { enhet, antallBøtter, bøtteStørrelse, behandlingstyper, enheter } = hentStatistikkQueryParams(req);

  try {
    const result = await hentFordelingÅpneBehandlinger(
      behandlingstyper,
      enheter,
      enhet as FilterTidsEnhet,
      antallBøtter,
      bøtteStørrelse
    );
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    logError(`/api/behandlinger/fordeling-åpne-behandlinger`, error);
    return new Response(JSON.stringify({ message: JSON.stringify(error), status: 500 }), { status: 500 });
  }
}
