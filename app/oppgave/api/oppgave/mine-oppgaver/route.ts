import { hentMineOppgaver } from 'lib/services/oppgaveservice/oppgaveservice';
import { logError } from 'lib/serverutlis/logger';
import { isError } from 'lib/utils/api';

export async function GET() {
  try {
    const res = await hentMineOppgaver();
    if (isError(res)) {
      logError(`/api/oppgave/mine-oppgaver`, res.apiException);
    }
    return new Response(JSON.stringify(res), { status: res.status });
  } catch (error) {
    logError(`/api/oppgave/mine-oppgaver`, error);
    return new Response(JSON.stringify({ message: JSON.stringify(error), status: 500 }), { status: 500 });
  }
}
