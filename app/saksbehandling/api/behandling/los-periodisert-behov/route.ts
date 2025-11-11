import { løsPeriodisertAvklaringsbehov } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { NextRequest, NextResponse } from 'next/server';
import { getErrorMessage } from 'lib/utils/errorUtil';
import { logError, logWarning } from 'lib/serverutlis/logger';
import { isError } from 'lib/utils/api';

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const løsbehovRes = await løsPeriodisertAvklaringsbehov(body);

    if (isError(løsbehovRes)) {
      if (løsbehovRes.status >= 500) {
        logError(
          `/løs-periodisert-behov, behovstype: ${body.behov?.behovstype}, message: ${løsbehovRes.apiException.message}`
        );
      } else {
        logWarning(
          `/løs-periodisert-behov, behovstype: ${body.behov?.behovstype}, message: ${løsbehovRes.apiException.message}`
        );
      }
    }
    return NextResponse.json(løsbehovRes, { status: løsbehovRes.status });
  } catch (error) {
    logWarning(`/løs-periodisert-behov ${body.behov?.behovstype}`, error);
    return NextResponse.json({ message: getErrorMessage(error) }, { status: 500 });
  }
}
