import { NextRequest } from 'next/server';
import { isError } from 'lib/utils/api';
import { logError, logWarning } from 'lib/serverutlis/logger';
import { getErrorMessage } from 'lib/utils/errorUtil';
import { fjernMarkering } from 'lib/services/oppgaveservice/oppgaveservice';

export async function POST(req: NextRequest, props: { params: Promise<{ referanse: string }> }) {
  const body = await req.json();
  const params = await props.params;

  try {
    const nyMarkeringRes = await fjernMarkering(params.referanse, body);

    if (isError(nyMarkeringRes)) {
      logError(`/markering/fjern, behandlingref: ${params.referanse}, message: ${nyMarkeringRes.apiException.message}`);
    }
    return new Response(JSON.stringify(nyMarkeringRes), { status: nyMarkeringRes.status });
  } catch (error) {
    logWarning(`/markering/fjern ${body.markeringType}`, error);
    return new Response(JSON.stringify({ message: getErrorMessage(error) }), { status: 500 });
  }
}
