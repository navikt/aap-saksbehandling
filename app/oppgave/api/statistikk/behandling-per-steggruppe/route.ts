import { NextRequest, NextResponse } from 'next/server';
import { hentStatistikkQueryParams } from 'lib/utils/request';
import { hentAntallBehandlingerPerSteggruppe } from 'lib/services/statistikkservice/statistikkService';
import { logError } from 'lib/serverutlis/logger';

export async function GET(req: NextRequest) {
  const { behandlingstyper, enheter, oppgaveTyper } = hentStatistikkQueryParams(req);

  try {
    const result = await hentAntallBehandlingerPerSteggruppe(behandlingstyper, enheter, oppgaveTyper);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    logError(`/api/behandling-per-steggruppe`, error);
    return NextResponse.json({ message: JSON.stringify(error), status: 500 }, { status: 500 });
  }
}
