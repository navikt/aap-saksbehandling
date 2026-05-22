import { hentBrevmalPreview } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_: NextRequest, props: { params: Promise<{ brevbestillingReferanse: string }> }) {
  const params = await props.params;
  return await hentBrevmalPreview(params.brevbestillingReferanse);
}

// export async function GET(_: NextRequest, props: { params: Promise<{ brevbestillingReferanse: string }> }) {
//   const params = await props.params;
//   const preview = await hentBrevmalPreview(params.brevbestillingReferanse);
//
//   return NextResponse.json(preview);
// }
