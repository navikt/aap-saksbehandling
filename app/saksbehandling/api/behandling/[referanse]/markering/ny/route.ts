import { NextRequest, NextResponse } from 'next/server';
import { isError } from 'lib/utils/api';
import { logError, logWarning } from 'lib/serverutlis/logger';
import { getErrorMessage } from 'lib/utils/errorUtil';
import { settMarkeringForBehandling } from 'lib/services/oppgaveservice/oppgaveservice';

export async function POST(req: NextRequest, props: { params: Promise<{ referanse: string }> }) {
  const body = await req.json();
  const params = await props.params;

  try {
    const nyMarkeringRes = await settMarkeringForBehandling(params.referanse, body);

    if (isError(nyMarkeringRes)) {
      logError(`/markering/ny, behandlingref: ${params.referanse}, message: ${nyMarkeringRes.apiException.message}`);
    }
    return NextResponse.json(nyMarkeringRes, { status: nyMarkeringRes.status });
  } catch (error) {
    logWarning(`/markering/ny ${body.markeringType}`, error);
    return NextResponse.json({ message: getErrorMessage(error) }, { status: 500 });
  }
}
