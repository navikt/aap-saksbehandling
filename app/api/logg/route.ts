import { NextRequest } from 'next/server';
import { logWarning } from 'lib/serverutlis/logger';
import { ClientError } from 'lib/types/clientTypes';

/*
 * Endepunkt for å støtte logging av client-side errors i serverloggene.
 * Primært for bruk i [error.tsx]
 */
export async function POST(req: NextRequest) {
  const error: ClientError = await req.json();

  try {
    logWarning(`/api/logg`, error);
  } catch (error) {
    logWarning('Uhåndtert feil ved forsøkt logging av error: ', error);
  }
  return new Response('OK', { status: 200 });
}
