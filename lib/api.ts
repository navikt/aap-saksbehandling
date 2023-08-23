async function fetcher(url: string, method: 'GET' | 'POST', body?: object) {
  try {
    const res = await fetch(url, {
      method,
      body: body && JSON.stringify(body),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (res.ok) {
      return await res.json();
    } else {
      console.error('Noe gikk galt i try');
    }
  } catch (e) {
    throw new Error('Noe gikk galt i catch');
  }
}

/**
 * Sak
 */

// /api/sak/hent/{saksnummer}
export function hentSak(saksnummer: string) {
  return fetcher(`http://localhost:8080/api/sak/hent/${saksnummer}`, 'GET');
}

// /api/sak/finn
export function finnSak(ident: string) {
  return fetcher('http://localhost:8080/api/sak/finn', 'POST', { ident: ident });
}

// /api/behandling/hent/{referanse}
export function hentBehandling(referanse: string) {
  return fetcher(`http://localhost:8080/api/behandling/hent/${referanse}`, 'GET');
}

/**
 * Test
 */

// /test/opprett
export function opprettSak() {
  const nySak = {
    fødselsdato: '1995-02-19',
    ident: '12345678910',
    yrkesskade: true,
  };
  return fetcher('http://localhost:8080/test/opprett', 'POST', nySak);
}

// /test/opprett/tid
export function opprettSakTid() {
  return fetcher('http://localhost:8080/test/opprett/tid', 'GET');
}
