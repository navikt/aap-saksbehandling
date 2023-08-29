import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();

  const res = await fetch('http://localhost:8080/test/opprett', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  if (res.ok) {
    return new Response(JSON.stringify({ message: 'Sak opprettet' }), { status: 200 });
  } else {
    return new Response(JSON.stringify({ message: 'Kunne ikke opprette sak.' }), { status: 500 });
  }
}
