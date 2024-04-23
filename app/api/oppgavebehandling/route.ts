import { fetchProxy } from 'lib/services/fetchProxy';
import { isLocal } from 'lib/utils/environment';
import { mockOppgaver } from 'mocks/mockOppgaver';

const oppgavestyringApiBaseUrl = process.env.OPPGAVESTYRING_API_BASE_URL;
const oppgavestyringApiScope = process.env.OPPGAVESTYRING_API_SCOPE ?? '';

export async function GET() {
  if (isLocal()) {
    return new Response(JSON.stringify(mockOppgaver), { status: 200 });
  }

  try {
    await fetchProxy<void>(`${oppgavestyringApiBaseUrl}/oppgaver`, oppgavestyringApiScope, 'GET');
    return new Response(JSON.stringify({ message: 'Oppgave fordelt', status: 200 }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: JSON.stringify(error), status: 500 }), { status: 500 });
  }
}
