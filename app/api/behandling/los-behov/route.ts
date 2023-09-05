import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();

  const res = await fetch('http://localhost:8080/api/behandling/løs-behov', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  if (res.ok) {
    return new Response(JSON.stringify({ message: 'Behov løst' }), { status: 200 });
  } else {
    return new Response(JSON.stringify({ message: 'Kunne ikke løse behov.' }), { status: 500 });
  }
}
