import { NextRequest } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { brevmalid: string } }) {

  const response = await fetch("http://aap-brev/${params.brevmalid}", {
    method: GET,
    headers: {
      Accept: 'application/json',
    },
  });
  
  if (response.ok) {
    const body = await response.json();
    return new Response(JSON.stringify(body), { status: 200 });
  } 

  return new Response("klarte ikke finne brevmal", { status: 400 })
}
