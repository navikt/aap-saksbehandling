import { isLocal } from 'lib/utils/environment';
import { NextRequest } from 'next/server';
import { fetchProxy } from 'lib/services/fetchProxy';
import { Oppgave } from 'lib/types/oppgavebehandling';
import { ufordeltOppgave } from 'mocks/mockOppgaver';

const oppgavestyringApiBaseUrl = process.env.OPPGAVESTYRING_API_BASE_URL;
const oppgavestyringApiScope = process.env.OPPGAVESTYRING_API_SCOPE ?? '';

export async function GET(req: NextRequest) {
  if (isLocal()) {
    return new Response(JSON.stringify(ufordeltOppgave[0]), { status: 200 });
  }

  const url =
    req.nextUrl.searchParams.size > 0
      ? `${oppgavestyringApiBaseUrl}/nesteOppgave?${req.nextUrl.searchParams}`
      : `${oppgavestyringApiBaseUrl}/nesteOppgave`;

  try {
    const res = await fetchProxy<Oppgave>(url, oppgavestyringApiScope, 'GET');
    return new Response(JSON.stringify(res), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: JSON.stringify(error), status: 500 }), { status: 500 });
  }
}
