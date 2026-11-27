import { NextRequest, NextResponse } from 'next/server';
import { hentJournalposter } from 'lib/services/postmottakservice/postmottakservice';

export async function GET(request: NextRequest, props: { params: Promise<{ behandlingsreferanse: string }> }) {
  const { behandlingsreferanse } = await props.params;
  const res = await hentJournalposter(behandlingsreferanse, request.nextUrl.searchParams.get('etter') ?? undefined);
  return NextResponse.json(res, { status: res.status });
}
