import { logError } from 'lib/serverutlis/logger';
import { endreTema } from 'lib/services/postmottakservice/postmottakservice';
import { isServerError } from 'lib/utils/api';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(_: NextRequest, props: { params: Promise<{ behandlingsreferanse: string }> }) {
  const params = await props.params;
  try {
    const res = await endreTema(params.behandlingsreferanse);
    if (isServerError(res)) {
      logError(`postmottak/api/endre-tema ${res.status} - ${res.apiException.code}: ${res.apiException.message}`);
    }
    return NextResponse.json(res, { status: res.status });
  } catch (error) {
    logError('error i route', error);
    return NextResponse.json({ message: JSON.stringify(error) }, { status: 500 });
  }
}
