import { BrukerInformasjon, hentBrukerInformasjon } from 'lib/services/azure/azureUserService';
import { FetchResponse } from 'lib/utils/api';
import { NextResponse } from 'next/server';

export async function GET() {
  const brukerInformasjon = await hentBrukerInformasjon();

  const res: FetchResponse<BrukerInformasjon> = {
    data: brukerInformasjon,
    type: 'SUCCESS',
  };

  return NextResponse.json(res, { status: 200 });
}
