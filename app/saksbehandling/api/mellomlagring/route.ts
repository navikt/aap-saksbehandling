import { NextRequest, NextResponse } from 'next/server';
import { Behovstype } from 'lib/utils/form';
import { MellomlagredeVurderingRequest } from 'lib/types/types';
import { lagreMellomlagring, slettMellomlagring } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isSuccess } from 'lib/utils/api';

export interface MellomLagringIdentifikator {
  behandlingsreferanse: string;
  behovstype: Behovstype;
}

export async function POST(request: NextRequest) {
  const payload: MellomlagredeVurderingRequest = await request.json();

  const res = await lagreMellomlagring(payload);

  if (isSuccess(res)) {
    return NextResponse.json(res, {
      status: 200,
    });
  } else {
    return NextResponse.json(
      { message: 'Noe gikk galt av lagring av mellomlagring' },
      {
        status: 500,
      }
    );
  }
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
