import { describe, expect, it } from 'vitest';
import {
  getJaNeiEllerUndefined,
  getStringEllerUndefined,
  getTrueFalseEllerUndefined,
  JaEllerNei,
} from 'lib/utils/form';

describe('getTrueFalseEllerUndefined', () => {
  it('skal returnere true hvis det blir sendt inn JA', () => {
    expect(getTrueFalseEllerUndefined(JaEllerNei.Ja)).toBeTruthy();
  });

  it('skal returnere false hvis det blir sendt inn NEI', () => {
    expect(getTrueFalseEllerUndefined(JaEllerNei.Nei)).toBeFalsy();
  });

  it('skal returnere undefined hvis det blir sendt inn undefined', () => {
    expect(getTrueFalseEllerUndefined(undefined)).toBeUndefined();
  });
});

describe('getJaNeiEllerUndefined', () => {
  it('skal returnere Ja hvis det blir sendt inn true', () => {
    expect(getJaNeiEllerUndefined(true)).toBe(JaEllerNei.Ja);
  });

  it('skal returnere Nei hvis det blir sendt inn false', () => {
    expect(getJaNeiEllerUndefined(false)).toBe(JaEllerNei.Nei);
  });

  it('skal returnere undefined hvis det blir sendt inn undefined', () => {
    expect(getJaNeiEllerUndefined(undefined)).toBeUndefined;
  });

  it('skal returnere undefined hvis det blir sendt inn null', () => {
    expect(getJaNeiEllerUndefined(null)).toBeUndefined();
  });
});

describe('getStringEllerUndefined', () => {
  it('skal returnere verdien som string hvis det blir sendt inn som number', () => {
    expect(getStringEllerUndefined(1)).toBe('1');
  });

  it('skal returnere verdien som string hvis det blir sendt inn som string', () => {
    expect(getStringEllerUndefined('1')).toBe('1');
  });

  it('skal returnere undefined hvis det blir sendt inn undefined', () => {
    expect(getStringEllerUndefined(undefined)).toBeUndefined();
  });

  it('skal returnere undefined hvis det blir sendt inn null', () => {
    expect(getStringEllerUndefined(undefined)).toBeUndefined();
  });
});
