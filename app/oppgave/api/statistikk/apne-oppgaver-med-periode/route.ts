import { NextRequest } from 'next/server';
import { hentStatistikkQueryParams } from 'lib/utils/request';
import { hentOppgaverInnUt } from 'lib/services/statistikkservice/statistikkService';
import { logError } from 'lib/serverutlis/logger';

export async function GET(req: NextRequest) {
  const { behandlingstyper, enheter, oppslagsPeriode } = hentStatistikkQueryParams(req);

  try {
    const result = await hentOppgaverInnUt(behandlingstyper, enheter, oppslagsPeriode);
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    logError(`/api/apne-oppgaver-med-periode`, error);
    return new Response(JSON.stringify({ message: JSON.stringify(error), status: 500 }), { status: 500 });
  }
}
