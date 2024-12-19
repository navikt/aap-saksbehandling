import { describe, expect, it } from 'vitest';
import { formaterPerioder } from 'components/aktivitetsplikt/util/AktivitetspliktUtil';

describe('formaterPerioder', () => {
  it('skal returnere et array med et objekt som inneholder tom og fom dersom det er av type periode', () => {
    const result = formaterPerioder(
      [{ type: 'periode', fom: '2024-01-01', tom: '2024-01-02' }],
      'IKKE_MØTT_TIL_BEHANDLING_ELLER_UTREDNING'
    );

    expect(result).toStrictEqual([{ fom: '2024-01-01', tom: '2024-01-02' }]);
  });

  it('skal returnere et array med et objekt som inneholder tom og fom med samme dato dersom det er av type enkeltdato og det ikke er "ikke bidratt til egen avklaring" som brudd ', () => {
    const result = formaterPerioder(
      [{ type: 'enkeltdag', dato: '2024-01-01' }],
      'IKKE_MØTT_TIL_BEHANDLING_ELLER_UTREDNING'
    );

    expect(result).toStrictEqual([{ fom: '2024-01-01', tom: '2024-01-01' }]);
  });

  it('skal returnere et array med et objekt som inneholder fom og tom der tom er undefined dersom det er av type enkeltdato og bruddet er "ikke bidratt til egen avklaring" ', () => {
    const result = formaterPerioder([{ type: 'enkeltdag', dato: '2024-01-01' }], 'IKKE_AKTIVT_BIDRAG');

    expect(result).toStrictEqual([{ fom: '2024-01-01', tom: undefined }]);
  });
});
