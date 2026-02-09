import { NextRequest, NextResponse } from 'next/server';
import { Behovstype } from 'lib/utils/form';
import { MellomlagretVurderingRequest } from 'lib/types/types';
import { lagreMellomlagring, slettMellomlagring } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isSuccess } from 'lib/utils/api';

export interface MellomLagringIdentifikator {
  behandlingsreferanse: string;
  behovstype: Behovstype;
}

export async function POST(request: NextRequest) {
  const payload: MellomlagretVurderingRequest = await request.json();

  const res = await lagreMellomlagring(payload);

  return NextResponse.json(res, { status: res.status });
}

export async function DELETE(request: NextRequest) {
  const payload: MellomLagringIdentifikator = await request.json();

  const res = await slettMellomlagring(payload.behandlingsreferanse, payload.behovstype);

  if (isSuccess(res)) {
    return NextResponse.json(res, {
      status: 200,
    });
  }
}
