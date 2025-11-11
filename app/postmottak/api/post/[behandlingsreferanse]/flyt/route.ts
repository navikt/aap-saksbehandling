import { NextRequest, NextResponse } from 'next/server';
import { hentFlyt } from 'lib/services/postmottakservice/postmottakservice';
import { logError } from 'lib/serverutlis/logger';
import { isError } from 'lib/utils/api';

export async function GET(_: NextRequest, props: { params: Promise<{ behandlingsreferanse: string }> }) {
  const params = await props.params;
  try {
    const res = await hentFlyt(params.behandlingsreferanse);
    if (isError(res)) {
      logError(`/postmottak/api/flyt ${res.status} - ${res.apiException.code}: ${res.apiException.message}`);
    }
    return NextResponse.json(res, { status: res.status });
  } catch (error) {
    logError('error i route', error);
    return NextResponse.json({ message: JSON.stringify(error) }, { status: 500 });
  }
}
