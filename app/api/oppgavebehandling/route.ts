import { fetchProxy } from 'lib/services/fetchProxy';
import { isLocal } from 'lib/utils/environment';
import { mockOppgaver } from 'mocks/mockOppgaver';
import { Oppgaver } from 'lib/types/oppgavebehandling';
import { NextRequest } from 'next/server';

const oppgavestyringApiBaseUrl = process.env.OPPGAVESTYRING_API_BASE_URL;
const oppgavestyringApiScope = process.env.OPPGAVESTYRING_API_SCOPE ?? '';

export async function GET(req: NextRequest) {
  if (isLocal()) {
    return new Response(JSON.stringify(mockOppgaver), { status: 200 });
  }

  try {
    const res = await fetchProxy<Oppgaver>(
      `${oppgavestyringApiBaseUrl}/oppgaver/?${req.nextUrl.searchParams}`,
      oppgavestyringApiScope,
      'GET'
    );
    return new Response(JSON.stringify(res), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: JSON.stringify(error), status: 500 }), { status: 500 });
  }
}
