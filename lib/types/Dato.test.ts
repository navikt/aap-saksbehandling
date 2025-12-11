import { Dato } from 'lib/types/Dato';
import { describe, expect, test } from 'vitest';

describe('dato', () => {
  test('kan lage ny dato med dato', () => {
    const refDato = new Date();
    const datoen = new Dato(refDato);
    expect(datoen.dato).toEqual(refDato);
  });

  test('kan lage en ny dato fra en string med format dd.MM.yyyy', () => {
    const refDato = '17.03.2025';
    const datoen = new Dato(refDato);
    expect(datoen.dato.getFullYear()).toEqual(2025);
    expect(datoen.dato.getMonth()).toEqual(2);
    expect(datoen.dato.getDate()).toEqual(17);
  });

  test('kan lage en ny dato fra en string med format yyyy-MM-dd', () => {
    const refDato = '2025-03-17';
    const datoen = new Dato(refDato);
    expect(datoen.dato.getFullYear()).toEqual(2025);
    expect(datoen.dato.getMonth()).toEqual(2);
    expect(datoen.dato.getDate()).toEqual(17);
  });

  test('kan formatere dato for frontend', () => {
    const refDato = new Date('2025-03-17');
    const datoen = new Dato(refDato);
    expect(datoen.formaterForFrontend()).toEqual('17.03.2025');
  });
  test('kan formatere dato for backend', () => {
    const refDato = new Date('2025-03-17');
    const datoen = new Dato(refDato);
    expect(datoen.formaterForBackend()).toEqual('2025-03-17');
  });

  test('kaster en exception når datoen er ugyldig', () => {
    expect(() => new Dato('34.34.2025')).toThrowError('Ugyldig dato');
  });

  test('kaster en exception når input har et ugyldig format', () => {
    expect(() => new Dato('2025/01/02')).toThrowError('Ugyldig datoformat');
    expect(() => new Dato('120225')).toThrowError('Ugyldig datoformat');
    expect(() => new Dato('12-02-2025')).toThrowError('Ugyldig datoformat');
  });
});
