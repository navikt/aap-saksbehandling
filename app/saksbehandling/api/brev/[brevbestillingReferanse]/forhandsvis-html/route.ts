import { NextRequest } from 'next/server';
import { hentForhåndsvisningBrevHtml } from 'lib/services/saksbehandlingservice/saksbehandlingService';

export async function GET(_: NextRequest, props: { params: Promise<{ brevbestillingReferanse: string }> }) {
  const params = await props.params;

  return await hentForhåndsvisningBrevHtml(params.brevbestillingReferanse);
}
