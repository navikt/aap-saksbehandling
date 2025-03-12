import { describe, expect, test } from 'vitest';
import { mapShortDateToDateString } from './dateMapper';

describe('dateMapper', () => {
  test('returnerer input dersom verdien inneholder noe annet enn tall', () => {
    const input = 'Hei, dette var da ikke en dato';
    expect(mapShortDateToDateString(input)).toEqual(input);
  });

  test('returnerer input dersom det er en dato på format dd.mm.åååå', () => {
    const input = '19.12.2023';
    expect(mapShortDateToDateString(input)).toEqual(input);
  });

  test('returnerer 19.07.2022 når input er 190722', () => {
    expect(mapShortDateToDateString('190722')).toEqual('19.07.2022');
  });

  test('returnerer 19.07.1987 når input er 190787', () => {
    expect(mapShortDateToDateString('190787')).toEqual('19.07.1987');
  });

  test('returnerer 31.12.1999 når input er 311299', () => {
    expect(mapShortDateToDateString('311299')).toEqual('31.12.1999');
  });

  test('returnerer 01.01.2000 når input er 010100', () => {
    expect(mapShortDateToDateString('010100')).toEqual('01.01.2000');
  });

  test('returnerer 31.03.2006 når input er 310306', () => {
    expect(mapShortDateToDateString('310306')).toEqual('31.03.2006');
  });

  test('returnerer en dato fra år 20xx når  årstallet er for 90 år siden eller mer', () => {
    const nittiÅrSiden = new Date().getFullYear() - 90 - 1900;
    expect(mapShortDateToDateString(`3103${nittiÅrSiden}`)).toEqual(`31.03.20${nittiÅrSiden}`);
  });

  test('returnerer en dato fra 19xx når årstallet er under 90 år siden', () => {
    const åttiniÅrSiden = new Date().getFullYear() - 89 - 1900;
    expect(mapShortDateToDateString(`3103${åttiniÅrSiden}`)).toEqual(`31.03.19${åttiniÅrSiden}`);
  });
});
