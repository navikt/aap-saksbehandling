import { NextRequest } from 'next/server';
import { hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { logError } from 'lib/serverutlis/logger';
import { isError } from 'lib/utils/api';

export async function GET(req: NextRequest, props: { params: Promise<{ referanse: string }> }) {
  const params = await props.params;
  const res = await hentFlyt(params.referanse);
  if (isError(res)) {
    logError(
      `api/behandling/${params.referanse}/flyt ${res.status} - ${res.apiException.code}: ${res.apiException.code}`
    );
  }
  return new Response(JSON.stringify(res), { status: res.status });
}
export const dynamic = 'force-dynamic';
