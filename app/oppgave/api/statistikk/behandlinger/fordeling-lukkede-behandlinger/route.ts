import { NextRequest } from 'next/server';
import { logError } from '@navikt/aap-felles-utils';
import { hentStatistikkQueryParams } from 'lib/utils/request';
import { hentFordelingLukkedeBehandlinger } from 'lib/services/statistikkservice/statistikkService';
import { FilterTidsEnhet } from 'lib/types/oppgaveTypes';

export async function GET(req: NextRequest) {
  const { enhet, bøtteStørrelse, antallBøtter, behandlingstyper, enheter } = hentStatistikkQueryParams(req);

  try {
    const result = await hentFordelingLukkedeBehandlinger(
      behandlingstyper,
      enheter,
      enhet as FilterTidsEnhet,
      antallBøtter,
      bøtteStørrelse
    );
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    logError(`/api/behandlinger/fordeling-lukkede-behandlinger`, error);
    return new Response(JSON.stringify({ message: JSON.stringify(error), status: 500 }), { status: 500 });
  }
}
