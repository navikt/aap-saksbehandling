import { formaterDatoForBackend, parseDatoFraDatePicker, sorterEtterNyesteDato, stringToDate } from 'lib/utils/date';

describe('formaterDatoForBackend', () => {
  it('skal returnere dato på korrekt format', () => {
    const date = new Date('March 21, 2024');
    const formatertDato = formaterDatoForBackend(date);
    expect(formatertDato).toEqual('2024-03-21');
  });

  it('skal returnere dato på korrekt format med tidspunkt', () => {
    const date = new Date('March 21, 2024 12:23:00');
    const formatertDato = formaterDatoForBackend(date);
    expect(formatertDato).toEqual('2024-03-21');
  });
});

describe('sorterEtterNyesteDato', () => {
  const datoer = ['2024-04-30', '2024-05-02', '2024-05-03'];
  it('skal sortere korrekt', () => {
    const sorterteDatoer = datoer.sort(sorterEtterNyesteDato);
    expect(sorterteDatoer).toEqual(['2024-05-03', '2024-05-02', '2024-04-30']);
  });
});

describe('stringToDate', () => {
  it('konverterer en string på formatet yyyy-MM-dd til en dato', () => {
    const resultat = stringToDate('2024-02-02');
    expect(resultat).toBeInstanceOf(Date);
    expect(resultat?.getFullYear()).toEqual(2024);
    expect(resultat?.getMonth()).toEqual(1);
    expect(resultat?.getDate()).toEqual(2);
  });

  it('returnerer undefined hvis det er en ugyldig dato', () => {
    const resultat = stringToDate('20204-02');
    expect(resultat).toBeUndefined();
  });

  it('konverterer en string med gitt format til en dato', () => {
    const resultat = stringToDate('02.02.2024', 'dd.MM.yyyy');
    expect(resultat).toBeInstanceOf(Date);
    expect(resultat?.getFullYear()).toEqual(2024);
    expect(resultat?.getMonth()).toEqual(1);
    expect(resultat?.getDate()).toEqual(2);
  });
});

describe('parseDateFraDatePicker', () => {
  it('gir en dato tilbake når den får en dato inn', () => {
    const result = parseDatoFraDatePicker(new Date());
    expect(result).toBeInstanceOf(Date);
  });

  it('gir en dato tilbake når input-string er en gyldig dato', () => {
    const result = parseDatoFraDatePicker('12.02.2022');
    expect(result).toBeInstanceOf(Date);
  });

  it('gir undefined tilbake når input er undefined', () => {
    const result = parseDatoFraDatePicker(undefined);
    expect(result).toBeUndefined();
  });

  it('gir undefined tilbake når string-input ikke er en gyldig dato', () => {
    const result = parseDatoFraDatePicker('20238-92');
    expect(result).toBeUndefined();
  });
});
