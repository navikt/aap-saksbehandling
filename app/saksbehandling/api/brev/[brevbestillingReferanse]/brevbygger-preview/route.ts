import { hentBrevmalPreview } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { NextRequest } from 'next/server';

export async function GET(_: NextRequest, props: { params: Promise<{ brevbestillingReferanse: string }> }) {
  const params = await props.params;
  return await hentBrevmalPreview(params.brevbestillingReferanse);
}
