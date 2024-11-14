import { describe, expect, it } from 'vitest';
import { erProsent } from 'lib/utils/validering';

describe('erProsent', () => {
  it('skal returnere true hvis value er 50', () => {
    expect(erProsent(50)).toBeTruthy();
  });

  it('skal returnere true hvis value er 77', () => {
    expect(erProsent(77)).toBeTruthy();
  });

  it('skal returnere true hvis value er 0', () => {
    expect(erProsent(0)).toBeTruthy();
  });

  it('skal returnere true hvis value er 100', () => {
    expect(erProsent(100)).toBeTruthy();
  });

  it('skal returnere false hvis value er negativ', () => {
    expect(erProsent(-1)).toBeFalsy();
  });

  it('skal returnere false hvis value er over 100', () => {
    expect(erProsent(101)).toBeFalsy();
  });
});
