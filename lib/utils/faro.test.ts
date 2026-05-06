import { generateKelvinFaroPageId } from 'lib/utils/faro';
import { describe, expect, it } from 'vitest';

function loc(pathname: string): Location {
  return { pathname } as Location;
}

describe('generateKelvinFaroPageId', () => {
  it('normalizes path with saksid and behandlingsreferanse', () => {
    expect(generateKelvinFaroPageId(loc('/saksbehandling/sak/4VAiPN4/0ec524f4-68f7-4e15-81f2-47fc3bce707c'))).toBe(
      '/saksbehandling/sak/{saksid}/{behandlingsreferanse}'
    );
  });

  it('normalizes path with saksid and behandlingsreferanse and trailing slash', () => {
    expect(generateKelvinFaroPageId(loc('/saksbehandling/sak/4VAiPN4/0ec524f4-68f7-4e15-81f2-47fc3bce707c/'))).toBe(
      '/saksbehandling/sak/{saksid}/{behandlingsreferanse}/'
    );
  });

  it('normalizes path with saksid, behandlingsreferanse and sub-page', () => {
    expect(
      generateKelvinFaroPageId(loc('/saksbehandling/sak/4SSSoS0/47d9342a-98a3-4de3-b33e-2737922851eb/GRUNNLAG/'))
    ).toBe('/saksbehandling/sak/{saksid}/{behandlingsreferanse}/GRUNNLAG/');
  });

  it('normalizes path with saksid, behandlingsreferanse and underscore sub-page', () => {
    expect(
      generateKelvinFaroPageId(
        loc('/saksbehandling/sak/4VJQXio/c4a60238-e4b8-4e0e-b8c6-92b48a0176eb/AKTIVITETSPLIKT_11_7/')
      )
    ).toBe('/saksbehandling/sak/{saksid}/{behandlingsreferanse}/AKTIVITETSPLIKT_11_7/');
  });

  it('normalizes path with only saksid', () => {
    expect(generateKelvinFaroPageId(loc('/saksbehandling/sak/4SKCBZK'))).toBe('/saksbehandling/sak/{saksid}');
  });

  it('normalizes path with only saksid and trailing slash', () => {
    expect(generateKelvinFaroPageId(loc('/saksbehandling/sak/4SKCBZK/'))).toBe('/saksbehandling/sak/{saksid}/');
  });

  it('normalizes postmottak path with uuid referanse and sub-page', () => {
    expect(generateKelvinFaroPageId(loc('/postmottak/720ce045-306b-477a-93d7-32a09e85e9da/DIGITALISER/'))).toBe(
      '/postmottak/{referanse}/DIGITALISER/'
    );
  });

  it('normalizes postmottak path with uuid referanse only', () => {
    expect(generateKelvinFaroPageId(loc('/postmottak/720ce045-306b-477a-93d7-32a09e85e9da'))).toBe(
      '/postmottak/{referanse}'
    );
  });

  it('leaves unrelated paths unchanged', () => {
    expect(generateKelvinFaroPageId(loc('/saksbehandling/oppgaver'))).toBe('/saksbehandling/oppgaver');
  });

  it('leaves root path unchanged', () => {
    expect(generateKelvinFaroPageId(loc('/'))).toBe('/');
  });
});
