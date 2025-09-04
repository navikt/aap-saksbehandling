import { describe, expect, it } from 'vitest';
import { kanViseOverstyrKnapp } from 'lib/utils/overstyring';
import { Avklaringsbehov } from 'lib/types/types';
import { Behovstype } from 'lib/utils/form';

const eksempelAvklaringsbehov: Avklaringsbehov = {
  definisjon: {
    kode: Behovstype.AVKLAR_SYKDOM_KODE,
    kreverToTrinn: false,
    kvalitetssikres: false,
    løsesAv: [],
    løsesISteg: 'AVKLAR_SYKDOM',
    name: '',
    type: 'MANUELT_PÅKREVD',
  },
  endringer: [],
  status: 'OPPRETTET',
};

describe('kanViseOverstyrKnapp', () => {
  it('returnerer true når alle betingelser er oppfylt og ingen avklaringsbehov finnes', () => {
    expect(kanViseOverstyrKnapp(true, false, [])).toBe(true);
  });

  it('returnerer false når automatiskVurdering er false, selv om listen er tom', () => {
    expect(kanViseOverstyrKnapp(false, false, [])).toBe(false);
  });

  it('returnerer false når readOnly er true, selv om listen er tom', () => {
    expect(kanViseOverstyrKnapp(true, true, [])).toBe(false);
  });

  it('returnerer false når det finnes avklaringsbehov', () => {
    expect(kanViseOverstyrKnapp(true, false, [eksempelAvklaringsbehov])).toBe(false);
  });

  it('returnerer false når alle betingelser feiler', () => {
    expect(kanViseOverstyrKnapp(false, true, [eksempelAvklaringsbehov])).toBe(false);
  });

  it('returnerer false når bare automatiskVurdering er true, men andre feiler', () => {
    expect(kanViseOverstyrKnapp(true, true, [eksempelAvklaringsbehov])).toBe(false);
  });

  it('returnerer false når bare readOnly er false, men andre feiler', () => {
    expect(kanViseOverstyrKnapp(false, false, [eksempelAvklaringsbehov])).toBe(false);
  });

  it('returnerer false når bare avklaringsBehov er tom, men andre feiler', () => {
    expect(kanViseOverstyrKnapp(false, true, [])).toBe(false);
  });
});
