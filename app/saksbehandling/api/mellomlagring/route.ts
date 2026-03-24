import { NextRequest, NextResponse } from 'next/server';
import { Behovstype } from 'lib/utils/form';
import { MellomlagretVurderingRequest } from 'lib/types/types';
import { lagreMellomlagring, slettMellomlagring } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError, isSuccess } from 'lib/utils/api';
import { logError } from 'lib/serverutlis/logger';

export interface MellomLagringIdentifikator {
  behandlingsreferanse: string;
  behovstype: Behovstype;
}

export async function POST(request: NextRequest) {
  const payload: MellomlagretVurderingRequest = await request.json();

  const res = await lagreMellomlagring(payload);

  if (isError(res)) {
    logError(
      `Feil ved lagring av mellomlagring for behandling ${payload.behandlingsReferanse}`,
      res.apiException.message
    );
  }

  return NextResponse.json(res, { status: res.status });
}

export async function DELETE(request: NextRequest) {
  const payload: MellomLagringIdentifikator = await request.json();

  const res = await slettMellomlagring(payload.behandlingsreferanse, payload.behovstype);

  if (isSuccess(res)) {
    return NextResponse.json(res, {
      status: 200,
    });
  } else {
    logError(
      `Feil ved sletting av mellomlagring for behandling ${payload.behandlingsreferanse}`,
      res.apiException.message
    );
  }
}
