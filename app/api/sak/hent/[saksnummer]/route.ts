import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const url = req.url;

  // TODO Her må det finnes en bedre måte vell? req.query finnes ikke i app route
  const trimmedString = url.replace(/\/$/, '');
  const lastIndex = trimmedString.lastIndexOf('/');
  const saksnummer = lastIndex !== -1 ? trimmedString.slice(lastIndex + 1) : null;

  const res = await fetch(`http://localhost:8080/api/sak/hent/${saksnummer}`, {
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
