import { describe, expect, it } from 'vitest';
import { formaterBeregnetGrunnlag } from './grunnlagsberegning';

describe('formaterBeregnetGrunnlag', () => {
  it('skal returnere formatert beløp med angitt dato og riktig avrunding', () => {
    expect(formaterBeregnetGrunnlag(2.123, { grunnbeløp: 124345, dato: '2024-01-01' })).toBe(
      '263 984\xa0kr pr 01.01.2024'
    );
  });
});
