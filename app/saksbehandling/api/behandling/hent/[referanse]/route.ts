import { hentBehandling } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_: NextRequest, props: { params: Promise<{ referanse: string }> }) {
  const params = await props.params;
  const data = await hentBehandling(params.referanse);

  if (data !== undefined) {
    return NextResponse.json(data, { status: 200 });
  } else {
    return NextResponse.json({ message: 'Ingen sak funnet.' }, { status: 500 });
  }
}
