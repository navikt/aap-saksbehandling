import { tildelTilSaksbehandler } from 'lib/services/oppgaveservice/oppgaveservice';
import { isError } from 'lib/utils/api';
import { logError } from 'lib/serverutlis/logger';
import { TildelOppgaveRequest } from 'lib/types/oppgaveTypes';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body: TildelOppgaveRequest = await req.json();

  const saksbehandlerResponse = await tildelTilSaksbehandler(body);
  if (isError(saksbehandlerResponse)) {
    logError(
      `/api/saksbehandler/tildel-oppgave ${saksbehandlerResponse.status}, ${saksbehandlerResponse.apiException.code}: ${saksbehandlerResponse.apiException.message}`
    );
  }
  return NextResponse.json(saksbehandlerResponse, { status: saksbehandlerResponse.status });
}
