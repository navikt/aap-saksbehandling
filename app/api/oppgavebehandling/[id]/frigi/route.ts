import { NextRequest } from 'next/server';
import { fetchProxy } from 'lib/services/fetchProxy';
import { isLocal } from 'lib/utils/environment';

const oppgavestyringApiBaseUrl = process.env.OPPGAVESTYRING_API_BASE_URL;
const oppgavestyringApiScope = process.env.OPPGAVESTYRING_API_SCOPE ?? '';

interface Params {
  params: { id: string };
}

export async function PATCH(req: NextRequest, { params }: Params) {
  if (isLocal()) {
    return new Response(JSON.stringify({ message: 'Oppgave frigitt', status: 200 }), { status: 200 });
  }

  const body = await req.json();
  try {
    await fetchProxy<void>(
      `${oppgavestyringApiBaseUrl}/oppgaver/${params.id}/frigi`,
      oppgavestyringApiScope,
      'PATCH',
      body
    );
    return new Response(JSON.stringify({ message: 'Oppgave frigitt', status: 200 }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: JSON.stringify(error) }), { status: 500 });
  }
}
