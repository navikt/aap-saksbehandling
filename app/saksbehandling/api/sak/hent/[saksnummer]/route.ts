import { hentSak } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_: NextRequest, props: { params: Promise<{ saksnummer: string }> }) {
  const params = await props.params;
  const data = await hentSak(params.saksnummer);

  if (data !== undefined) {
    return NextResponse.json(data, { status: 200 });
  } else {
    return NextResponse.json({ message: 'Ingen sak funnet.' }, { status: 500 });
  }
}
