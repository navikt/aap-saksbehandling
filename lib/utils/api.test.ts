/* eslint-disable @typescript-eslint/no-explicit-any */
import { isError, isServerError, isSuccess, type FetchResponse } from 'lib/utils/api';
import { describe, expect, test } from 'vitest';

const suksessRespons = (data: any): FetchResponse<string[]> => ({
  type: 'SUCCESS',
  status: 200,
  data,
});

const suksessResponsUtenStatus = (data: any): FetchResponse<string[]> => ({
  type: 'SUCCESS',
  data,
});

const feilRespons: FetchResponse<never> = {
  type: 'ERROR',
  status: 400,
  apiException: { message: 'Ugyldig forespørsel' },
};

const serverFeilRespons: FetchResponse<never> = {
  type: 'ERROR',
  status: 500,
  apiException: { message: 'Intern serverfeil' },
};

describe('isSuccess', () => {
  test('returnerer true for vellykket respons', () => {
    expect(isSuccess(suksessRespons(['verdi']))).toBe(true);
  });

  test('returnerer true med null data', () => {
    expect(isSuccess(suksessRespons(null))).toBe(true);
  });

  test('returnerer true med undefined data', () => {
    expect(isSuccess(suksessRespons(undefined))).toBe(true);
  });

  test('returnerer true når status mangler', () => {
    expect(isSuccess(suksessResponsUtenStatus('verdi'))).toBe(true);
  });

  test('returnerer false for feilrespons', () => {
    expect(isSuccess(feilRespons)).toBe(false);
  });

  test('returnerer false for undefined', () => {
    expect(isSuccess(undefined)).toBe(false);
  });

  test('returnerer false for null', () => {
    expect(isSuccess(null)).toBe(false);
  });
});

describe('isError', () => {
  test('returnerer true for feilrespons', () => {
    expect(isError(feilRespons)).toBe(true);
  });

  test('returnerer true for serverfeil', () => {
    expect(isError(serverFeilRespons)).toBe(true);
  });

  test('returnerer false for vellykket respons', () => {
    expect(isError(suksessRespons(['verdi']))).toBe(false);
  });

  test('returnerer false for undefined', () => {
    expect(isError(undefined)).toBe(false);
  });

  test('returnerer false for null', () => {
    expect(isError(null)).toBe(false);
  });
});

describe('isServerError', () => {
  test('returnerer true for 500-feil', () => {
    expect(isServerError(serverFeilRespons)).toBe(true);
  });

  test('returnerer false for 4xx-feil', () => {
    expect(isServerError(feilRespons)).toBe(false);
  });

  test('returnerer false for vellykket respons', () => {
    expect(isServerError(suksessRespons(['verdi']))).toBe(false);
  });

  test('returnerer false for undefined', () => {
    expect(isServerError(undefined)).toBe(false);
  });

  test('returnerer true for 503-feil', () => {
    const feil: FetchResponse<never> = {
      type: 'ERROR',
      status: 503,
      apiException: { message: 'Tjenesten utilgjengelig' },
    };
    expect(isServerError(feil)).toBe(true);
  });
});
