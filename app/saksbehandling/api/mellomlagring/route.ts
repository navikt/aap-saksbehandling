import { NextRequest, NextResponse } from 'next/server';
import { Behovstype } from 'lib/utils/form';

export interface MellomlagringRequest {
  behandlingsreferanse: string;
  behovstype: Behovstype;
  vurdering: Object;
  vurdertAv?: string;
}

export interface SlettMellomlagringRequest {
  behandlingsreferanse: string;
  behovstype: Behovstype;
}

export async function POST(request: NextRequest) {
  const payload: MellomlagringRequest = await request.json();

  console.log('Nå oppretter jeg mellomlagring!', payload);
  // Gjør kall mot behandlingsflyt

  return NextResponse.json(null, {
    status: 200,
  });
}

export async function DELETE(request: NextRequest) {
  const payload: SlettMellomlagringRequest = await request.json();
  console.log('Nå sletter jeg mellomlagring!', payload);
  // Gjør kall mot behandlingsflyt

  return NextResponse.json(null, {
    status: 200,
  });
}

export async function PATCH(request: NextRequest) {
  const payload: MellomlagringRequest = await request.json();
  console.log('Nå oppdaterer jeg mellomlagring', payload);
  // Gjør kall mot behandlingsflyt

  return NextResponse.json(null, {
    status: 200,
  });
}
