import { isLocal } from 'lib/utils/environment';
import { fetchProxy } from 'lib/services/fetchProxy';
import { logError } from '@navikt/aap-felles-utils';
import { NextRequest } from 'next/server';

const oppgavestyringApiBaseUrl = process.env.OPPGAVESTYRING_API_BASE_URL;
const oppgavestyringApiScope = process.env.OPPGAVESTYRING_API_SCOPE ?? '';

export async function DELETE(req: NextRequest, { params }: { params: { filterid: string } }) {
  if (isLocal()) {
    return new Response(JSON.stringify({ message: 'Kø er slettet', status: 200 }), { status: 200 });
  }

  try {
    await fetchProxy(`${oppgavestyringApiBaseUrl}/filter/${params.filterid}`, oppgavestyringApiScope, 'DELETE');
  } catch (error) {
    logError('Feil ved sletting av kø', error);
    return new Response(JSON.stringify({ message: JSON.stringify(error) }), { status: 500 });
  }
}
