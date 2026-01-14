import { forhåndsvisDialogmelding } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();

  const res = await forhåndsvisDialogmelding(body);

  return NextResponse.json(res, { status: res.status });
}
