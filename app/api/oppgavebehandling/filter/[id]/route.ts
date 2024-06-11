import { isLocal } from 'lib/utils/environment';
import { fetchProxy } from 'lib/services/fetchProxy';
import { logError } from '@navikt/aap-felles-utils';

const oppgavestyringApiBaseUrl = process.env.OPPGAVESTYRING_API_BASE_URL;
const oppgavestyringApiScope = process.env.OPPGAVESTYRING_API_SCOPE ?? '';

interface Params {
  params: { id: string };
}

export async function DELETE({ params }: Params) {
  if (isLocal()) {
    return new Response(JSON.stringify({ message: 'Kø er slettet', status: 200 }), { status: 200 });
  }

  try {
    await fetchProxy(`${oppgavestyringApiBaseUrl}/filter/${params.id}`, oppgavestyringApiScope, 'DELETE');
  } catch (error) {
    logError('Feil ved sletting av kø', error);
    return new Response(JSON.stringify({ message: JSON.stringify(error) }), { status: 500 });
  }
}
