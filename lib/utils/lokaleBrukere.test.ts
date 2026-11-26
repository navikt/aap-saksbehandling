import { describe, expect, it } from 'vitest';
import { finnLokalBruker, lokaleBrukere } from './lokaleBrukere';

describe('lokaleBrukere', () => {
  it('kobler hver lokal ident til riktig rolle og gruppe', () => {
    expect(lokaleBrukere).toEqual([
      {
        NAVident: 'X123456',
        tidligereIdent: null,
        rolle: 'SUPERBRUKER',
        grupper: ['veileder-rolle', 'kvalitetssikrer-rolle', 'saksbehandler-rolle', 'beslutter-rolle'],
      },
      { NAVident: 'V123456', tidligereIdent: 'VEILEDER', rolle: 'Veileder', grupper: ['veileder-rolle'] },
      {
        NAVident: 'K123456',
        tidligereIdent: 'KVALITETSSIKRER',
        rolle: 'Kvalitetssikrer',
        grupper: ['kvalitetssikrer-rolle'],
      },
      {
        NAVident: 'S123456',
        tidligereIdent: 'SAKSBEHANDLER',
        rolle: 'Saksbehandler',
        grupper: ['saksbehandler-rolle'],
      },
      { NAVident: 'B123456', tidligereIdent: 'BESLUTTER', rolle: 'Beslutter', grupper: ['beslutter-rolle'] },
    ]);
  });

  it('bruker unike identer med bokstav etterfulgt av seks siffer', () => {
    const identer = lokaleBrukere.map(({ NAVident }) => NAVident);
    expect(new Set(identer).size).toBe(identer.length);
    for (const ident of identer) {
      expect(ident).toMatch(/^[A-Z][0-9]{6}$/);
    }
  });

  it.each([undefined, null, 'ukjent-ident'])(
    'velger superbruker hvis cookie mangler eller ident er ukjent: %s',
    (verdi) => {
      expect(finnLokalBruker(verdi)).toEqual({
        navn: 'X123456 (SUPERBRUKER)',
        NAVident: 'X123456',
        roller: ['Veileder', 'Kvalitetssikrer', 'Saksbehandler', 'Beslutter'],
        grupper: ['veileder-rolle', 'kvalitetssikrer-rolle', 'saksbehandler-rolle', 'beslutter-rolle'],
      });
    }
  );

  it.each([
    ['V123456', 'V123456'],
    ['K123456', 'K123456'],
    ['S123456', 'S123456'],
    ['B123456', 'B123456'],
    ['VEILEDER', 'V123456'],
    ['KVALITETSSIKRER', 'K123456'],
    ['SAKSBEHANDLER', 'S123456'],
    ['BESLUTTER', 'B123456'],
  ])('kobler %s til lokal bruker %s', (verdi, forventetIdent) => {
    expect(finnLokalBruker(verdi).NAVident).toBe(forventetIdent);
  });
});
