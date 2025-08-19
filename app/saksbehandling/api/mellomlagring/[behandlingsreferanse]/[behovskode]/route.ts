import { NextRequest, NextResponse } from 'next/server';
import { hentMellomlagring } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isSuccess } from 'lib/utils/api';

export async function GET(
  _: NextRequest,
  props: { params: Promise<{ behandlingsreferanse: string; behovskode: string }> }
) {
  const params = await props.params;
  const res = await hentMellomlagring(params.behandlingsreferanse, params.behovskode);

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
