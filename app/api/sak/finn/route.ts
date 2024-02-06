import { FinnSakForIdent } from 'lib/types/types';

export async function POST(req: Request) {
  const body: FinnSakForIdent = await req.json();

  const res = await fetch('http://localhost:8080/api/sak/finn', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  const data = await res.json();

  if (res.ok) {
    return new Response(JSON.stringify(data), { status: 200 });
  } else {
    return new Response(JSON.stringify({ message: 'Kunne ikke finne sak.' }), { status: 500 });
  }
}
