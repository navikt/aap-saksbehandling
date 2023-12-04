import { NextRequest } from 'next/server';
import { hentBrevmalFraSanity } from 'lib/services/sanityservice/sanityservice';

export async function GET(req: NextRequest, { params }: { params: { brevmalid: string } }) {
  const data = await hentBrevmalFraSanity(params.brevmalid);

  return new Response(JSON.stringify(data), { status: 200 });
}
