import { NextRequest, NextResponse } from 'next/server';
import { logError } from 'lib/serverutlis/logger';
import { hentSakPersoninfo } from 'lib/services/saksbehandlingservice/saksbehandlingService';

const aInntektBaseUrl = process.env.A_INNTEKT_URL;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const saksnummer = body?.saksnummer;
  if (!saksnummer) {
    return NextResponse.json({ message: 'saksnummer mangler' }, { status: 400 });
  }

  const personinfo = await hentSakPersoninfo(saksnummer);
  const personident = personinfo.fnr;
  if (!personident || personident === 'Ukjent') {
    return NextResponse.json({ message: 'Kunne ikke slå opp personident for saksnummer' }, { status: 404 });
  }

  const url = `${aInntektBaseUrl}/api/v2/redirect/sok/a-inntekt`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: '*/*',
        'Nav-Personident': personident,
      },
    });

    if (!response.ok) {
      logError(`Feil ved kall til a-inntekt redirect: ${response.status}`);
      return NextResponse.json({ message: 'Feil ved oppslag mot a-inntekt' }, { status: response.status });
    }

    const redirectUrl = await response.text();

    return NextResponse.json({ type: 'SUCCESS', data: { redirectUrl } }, { status: 200 });
  } catch (error) {
    logError('Nettverksfeil mot a-inntekt', error);
    return NextResponse.json({ message: 'Kunne ikke nå a-inntekt' }, { status: 503 });
  }
}
