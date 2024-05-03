import { formaterDatoForBackend, sorterEtterNyesteDato } from 'lib/utils/date';

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
    console.log(sorterteDatoer);
    expect(sorterteDatoer).toEqual(['2024-05-03', '2024-05-02', '2024-04-30']);
  });
});
