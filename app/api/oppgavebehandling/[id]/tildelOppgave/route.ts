import { NextRequest } from 'next/server';
import { fetchProxy } from 'lib/services/fetchProxy';
import { isLocal } from 'lib/utils/environment';
import { hentBrukerInformasjon, logError } from '@navikt/aap-felles-utils';

const oppgavestyringApiBaseUrl = process.env.OPPGAVESTYRING_API_BASE_URL;
const oppgavestyringApiScope = process.env.OPPGAVESTYRING_API_SCOPE ?? '';

interface Params {
  params: { id: string };
}

export async function PATCH(req: NextRequest, { params }: Params) {
  if (isLocal()) {
    return new Response(JSON.stringify({ message: 'Oppgave fordelt', status: 200 }), { status: 200 });
  }

  const { NAVident } = await hentBrukerInformasjon();
  if (!NAVident) {
    return new Response(JSON.stringify({ message: JSON.stringify('Fant ikke NAVIdent'), status: 500 }), {
      status: 500,
    });
  }
  const reqBody = await req.json();
  const body = { navIdent: NAVident, versjon: reqBody.versjon };

  try {
    await fetchProxy(
      `${oppgavestyringApiBaseUrl}/oppgaver/${params.id}/tildelRessurs`,
      oppgavestyringApiScope,
      'PATCH',
      body
    );
    return new Response(JSON.stringify({ message: 'Oppgave fordelt', status: 200 }), { status: 200 });
  } catch (error) {
    logError('Feil ved tildeling av oppgave', error);
    return new Response(JSON.stringify({ message: JSON.stringify(error), status: 500 }), { status: 500 });
  }
}
