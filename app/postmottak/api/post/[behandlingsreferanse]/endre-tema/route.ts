import { NextRequest, NextResponse } from 'next/server';
import { endreTema } from 'lib/services/postmottakservice/postmottakservice';
import { logError } from 'lib/serverutlis/logger';
import { isError } from 'lib/utils/api';

export async function POST(_: NextRequest, props: { params: Promise<{ behandlingsreferanse: string }> }) {
  const params = await props.params;
  try {
    const res = await endreTema(params.behandlingsreferanse);
    if (isError(res)) {
      logError(`postmottak/api/endre-tema ${res.status} - ${res.apiException.code}: ${res.apiException.message}`);
    }
    return NextResponse.json(res, { status: res.status });
  } catch (error) {
    logError('error i route', error);
    return NextResponse.json({ message: JSON.stringify(error) }, { status: 500 });
  }
}
