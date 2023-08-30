import { NextRequest } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { saksnummer: string } }) {
  const res = await fetch(`http://localhost:8080/api/sak/hent/${params.saksnummer}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  const data = await res.json();

  if (res.ok) {
    return new Response(JSON.stringify(data), { status: 200 });
  } else {
    return new Response(JSON.stringify({ message: 'Ingen sak funnet.' }), { status: 500 });
  }
}
