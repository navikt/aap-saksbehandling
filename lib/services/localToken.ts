import { cookies } from 'next/headers';
import { finnLokalBruker } from 'lib/utils/lokaleBrukere';

export async function hentLocalToken(scope: string) {
  const cookieStore = await cookies();
  const bruker = finnLokalBruker(cookieStore.get('bruker')?.value);

  const params = new URLSearchParams({
    aud: scope,
    NAVident: bruker.NAVident,
    groups: [bruker.grupper].join(','),
  });

  const url = new URL('https://fakedings.intern.dev.nav.no/fake/aad?' + params.toString());
  const response = await fetch(url, { method: 'POST', next: { revalidate: 0 } });
  if (!response.ok) {
    throw new Error(`Kunne ikke hente lokalt token (status ${response.status}).`);
  }

  return response.text();
}
