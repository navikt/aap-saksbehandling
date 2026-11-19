import umami from '@umami/node';
import { logWarning } from 'lib/serverutlis/logger';
import { isDev, isProd } from 'lib/utils/environment';
import { NextResponse } from 'next/server';

const umamiSporingskodeDev = 'ebb233f3-6c6d-4b9f-b84d-9a11a3c2f16f';
const umamiSporingskodeProd = 'b2b87dc6-5a1c-4212-ac64-818f80fd12f2';
if (isDev()) {
  umami.init({
    websiteId: umamiSporingskodeDev,
    hostUrl: process.env.UMAMI_HOST_URL,
  });
}
if (isProd()) {
  umami.init({
    websiteId: umamiSporingskodeProd,
    hostUrl: process.env.UMAMI_HOST_URL,
  });
}

export async function POST(req: Request) {
  const payload = await req.json();

  try {
    await umami.track(payload.name, payload.data);
  } catch {
    logWarning(`umami-event feilet: ${payload.name}`);
  }
  return NextResponse.json('OK', { status: 200 });
}
