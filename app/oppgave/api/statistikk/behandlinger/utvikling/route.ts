import { NextRequest, NextResponse } from 'next/server';
import { hentStatistikkQueryParams } from 'lib/utils/request';
import { hentBehandlingerUtvikling } from 'lib/services/statistikkservice/statistikkService';
import { logError } from 'lib/serverutlis/logger';

export async function GET(req: NextRequest) {
  const { antallDager, behandlingstyper, enheter } = hentStatistikkQueryParams(req);

  try {
    const result = await hentBehandlingerUtvikling(behandlingstyper, enheter, antallDager);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    logError(`/api/behandlinger/utvikling`, error);
    return NextResponse.json({ message: JSON.stringify(error), status: 500 }, { status: 500 });
  }
}
