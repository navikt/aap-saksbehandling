import umami, { UmamiEventData } from '@umami/node';
import { UmamiKelvinEvent } from 'lib/types/types';
import { logWarning } from 'lib/serverutlis/logger';
import { NextResponse } from 'next/server';

const umamiSporingskode = 'ebb233f3-6c6d-4b9f-b84d-9a11a3c2f16f';
umami.init({
  websiteId: umamiSporingskode,
  hostUrl: process.env.UMAMI_HOST_URL,
});

export async function POST(req: Request) {
  const payload: UmamiKelvinEvent = await req.json();
  const eventData: UmamiKelvinEvent = {
    name: payload.name,
    hendelse: payload.hendelse,
    hendelser_serie: payload.hendelser_serie,
    hendelser_serie_id: payload.hendelser_serie_id,
    tidsstempel: payload.tidsstempel,
    varighet_sekunder: payload.varighet_sekunder,
    varighet_sekunder_siden_forrige: payload.varighet_sekunder_siden_forrige,
    brevtype: payload.brevtype,
  };
  const filtrertEventData: UmamiEventData = {
    ...(eventData.hendelse ? { hendelse: eventData.hendelse } : {}),
    ...(eventData.hendelser_serie ? { hendelser_serie: eventData.hendelser_serie } : {}),
    ...(eventData.hendelser_serie_id ? { hendelser_serie_id: eventData.hendelser_serie_id } : {}),
    ...(eventData.tidsstempel ? { tidsstempel: eventData.tidsstempel } : {}),
    ...(eventData.varighet_sekunder ? { varighet_sekunder: eventData.varighet_sekunder } : {}),
    ...(eventData.varighet_sekunder_siden_forrige
      ? { varighet_sekunder_siden_forrige: eventData.varighet_sekunder_siden_forrige }
      : {}),
    ...(eventData.brevtype ? { brevtype: eventData.brevtype } : {}),
  };
  try {
    await umami.track(eventData.name, filtrertEventData);
  } catch {
    logWarning(`umami-event feilet: ${eventData.name}`);
  }
  return NextResponse.json('OK', { status: 200 });
}
