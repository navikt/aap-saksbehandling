import { hentArenaSakMedVedtak } from 'lib/services/apiinternservice/apiInternService';
import { NextResponse } from 'next/server';

export async function GET(_req: Request, { params }: { params: Promise<{ sakId: string }> }) {
  const { sakId } = await params;
  const res = await hentArenaSakMedVedtak(sakId);

  if (res.type === 'ERROR') {
    return NextResponse.json(res.apiException, { status: res.status });
  }

  return NextResponse.json(res.data, { status: res.status ?? 200 });
}
