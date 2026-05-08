import { hentInnloggetBrukerInformasjon } from 'lib/services/azure/azureUserService';

export const CACHE_1_TIME = 3600;

/**
 * Legger på prefix med navIdent for å gjøre den unik for hver innlogget bruker.
 */
export async function genererTagMedNavIdent(tag: string): Promise<string> {
  const brukerInformasjon = await hentInnloggetBrukerInformasjon();
  return `${brukerInformasjon.NAVident}-${tag}`;
}
