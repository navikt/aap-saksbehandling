import { hentSakPersoninfo } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_: NextRequest, props: { params: Promise<{ saksnummer: string }> }) {
  const params = await props.params;
  const personinfo = await hentSakPersoninfo(params.saksnummer);
  return NextResponse.json({ type: 'SUCCESS', data: personinfo }, { status: 200 });
}
