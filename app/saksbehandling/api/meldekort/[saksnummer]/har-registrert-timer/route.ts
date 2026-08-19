import { NextRequest, NextResponse } from 'next/server';
import { hentHarRegistrerteTimerIMeldeperioden } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { stringToDate } from 'lib/utils/date';

export async function GET(request: NextRequest, props: { params: Promise<{ saksnummer: string }> }) {
  const params = await props.params;

  const meldeperiodeFom = stringToDate(request.nextUrl.searchParams.get('meldeperiodeFom'));
  const meldeperiodeTom = stringToDate(request.nextUrl.searchParams.get('meldeperiodeTom'));

  if (!meldeperiodeFom || !meldeperiodeTom) {
    return NextResponse.json(
      { message: 'meldeperiodeFom og meldeperiodeTom må oppgis som gyldige datoer (yyyy-MM-dd)' },
      { status: 400 }
    );
  }

  const res = await hentHarRegistrerteTimerIMeldeperioden(params.saksnummer, meldeperiodeFom, meldeperiodeTom);

  return NextResponse.json(res, { status: res.status });
}
