export const INGEN_TILGANG_DIGEST = 'INGEN_TILGANG';

/**
 * Kaster en feil som error-grensen (error.tsx) gjenkjenner som en 403-tilgangsfeil.
 * Siden error.digest bevares fra server til klient, kan grensen vise forbudt-innhold
 * uten å endre URL-en – noe som gir bedre kontekst for feilsøking og logging.
 *
 * Tiltenkt brukt i stedet for redirect('/forbidden') frem til Next.js sin
 * experimental forbidden()-funksjon er stabil:
 * https://nextjs.org/docs/app/api-reference/functions/forbidden
 */
export function ingenTilgang(): never {
  const error = new Error('Ingen tilgang');
  (error as Error & { digest: string }).digest = INGEN_TILGANG_DIGEST;
  throw error;
}

export const erIngenTilgangError = (error: Error & { digest?: string }): boolean =>
  error.digest === INGEN_TILGANG_DIGEST;
