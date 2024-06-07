import { isLocal } from 'lib/utils/environment';
import { fetchProxy } from 'lib/services/fetchProxy';
import { FilterDTO } from 'lib/types/oppgavebehandling';
import { mockFilter } from 'mocks/mockFilter';
import { NextRequest } from 'next/server';

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

export async function POST(req: NextRequest) {
  if (isLocal()) {
    return new Response(JSON.stringify({ message: 'Filter lagret', status: 200 }), { status: 200 });
  }
  try {
    const body = await req.json();
    fetchProxy<void>(`${oppgavestyringApiBaseUrl}/filter`, oppgavestyringApiScope, 'POST', body);
    return new Response(JSON.stringify({ message: 'Filter lagret' }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: JSON.stringify(error), status: 500 }), { status: 500 });
  }
}
