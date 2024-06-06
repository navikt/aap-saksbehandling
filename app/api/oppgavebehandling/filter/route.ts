import { isLocal } from 'lib/utils/environment';
import { fetchProxy } from 'lib/services/fetchProxy';
import { FilterDTO } from 'lib/types/oppgavebehandling';
import { mockFilter } from 'mocks/mockFilter';

const oppgavestyringApiBaseUrl = process.env.OPPGAVESTYRING_API_BASE_URL;
const oppgavestyringApiScope = process.env.OPPGAVESTYRING_API_SCOPE ?? '';

export async function GET() {
  if (isLocal()) {
    return new Response(JSON.stringify(mockFilter), { status: 200 });
  }

  try {
    const res = await fetchProxy<FilterDTO>(`${oppgavestyringApiBaseUrl}/filter`, oppgavestyringApiScope, 'GET');
    return new Response(JSON.stringify(res), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: JSON.stringify(error), status: 500 }), { status: 500 });
  }
}
