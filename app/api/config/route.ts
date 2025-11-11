import { ClientConfig } from 'lib/types/clientConfig';
import { FetchResponse } from 'lib/utils/api';
import { NextResponse } from 'next/server';

export async function GET() {
  const config: ClientConfig = {
    gosysUrl: process.env.GOSYS_URL!!,
    modiaPersonoversiktUrl: process.env.MODIA_PERSONOVERSIKT_URL!!,
  };

  const res: FetchResponse<ClientConfig> = {
    status: 200,
    type: 'SUCCESS',
    data: config,
  };

  return NextResponse.json(res, { status: 200 });
}
