import { NextRequest } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { referanse: string } }) {
  const res = await fetch(`http://localhost:8080/api/behandling/hent/${params.referanse}`, {
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
