import { NextRequest } from 'next/server';
import { rekjørJobb } from 'lib/services/saksbehandlingservice/saksbehandlingService';

export async function GET(req: NextRequest, { params }: { params: { jobbid: string } }) {
  return await rekjørJobb(params.jobbid);
}
