import { hentBrevmalPreview } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_: NextRequest, props: { params: Promise<{ brevbestillingReferanse: string }> }) {
  const params = await props.params;
  const res = await hentBrevmalPreview(params.brevbestillingReferanse);
  return NextResponse.json(res, { status: res.status });
}
