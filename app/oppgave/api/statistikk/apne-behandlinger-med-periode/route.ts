import { NextRequest, NextResponse } from 'next/server';
import { hentStatistikkQueryParams } from 'lib/utils/request';
import { hentAntallÅpneBehandlingerPerBehandlingstypeMedPeriode } from 'lib/services/statistikkservice/statistikkService';
import { logError } from 'lib/serverutlis/logger';

export async function GET(req: NextRequest) {
  const { behandlingstyper, enheter, oppslagsPeriode } = hentStatistikkQueryParams(req);

  try {
    const result = await hentAntallÅpneBehandlingerPerBehandlingstypeMedPeriode(
      behandlingstyper,
      enheter,
      oppslagsPeriode
    );
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    logError(`/api/åpne-behandlinger-med-periode`, error);
    return NextResponse.json({ message: JSON.stringify(error), status: 500 }, { status: 500 });
  }
}
