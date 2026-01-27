import { describe, expect, it } from 'vitest';
import { VisningModus } from 'lib/types/visningTypes';
import { hentVisning } from 'lib/utils/visning';

describe('Visning av vilkårskort i postmottak', () => {
  it('skal være LÅST_MED_ENDRE hvis readOnly=false, erAktivtSteg=false, mellomlagring=undefined', () => {
    const verdi = hentVisning(false, false, undefined);
    expect(verdi).toBe(VisningModus.LÅST_MED_ENDRE);
  });

  it('skal være AKTIV_UTEN_AVBRYT hvis readOnly=false, erAktivtSteg=true, mellomlagring=undefined', () => {
    const verdi = hentVisning(false, true, undefined);
    expect(verdi).toBe(VisningModus.AKTIV_UTEN_AVBRYT);
  });

  it('skal være LÅST_UTEN_ENDRE hvis readOnly=true, erAktivtSteg=false, mellomlagring=undefined', () => {
    const verdi = hentVisning(true, false, undefined);
    expect(verdi).toBe(VisningModus.LÅST_UTEN_ENDRE);
  });

  it('skal være LÅST_UTEN_ENDRE hvis readOnly=true, erAktivtSteg=true, mellomlagring=undefined', () => {
    const verdi = hentVisning(true, true, undefined);
    expect(verdi).toBe(VisningModus.LÅST_UTEN_ENDRE);
  });
});
