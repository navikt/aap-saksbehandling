import { describe, expect, it } from 'vitest';
import { MellomlagretVurdering } from 'lib/types/types';
import { Behovstype } from 'lib/utils/form';
import { hentVisning } from 'lib/utils/visning';
import { VisningModus } from 'lib/types/visningTypes';

const mellomlagring: MellomlagretVurdering = {
  avklaringsbehovkode: Behovstype.AVKLAR_SYKDOM_KODE,
  behandlingId: { id: 0 },
  data: 'hello pello',
  vurdertAv: '',
  vurdertDato: '',
};

describe('Visning av vilkårskort', () => {
  it('skal være LÅST_MED_ENDRE hvis readOnly=false, erAktivtSteg=false, mellomlagring=undefined', () => {
    const verdi = hentVisning(false, false, undefined);
    expect(verdi).toBe(VisningModus.LÅST_MED_ENDRE);
  });

  it('skal være AKTIV_MED_AVBRYT hvis readOnly=false, erAktivtSteg=false, mellomlagring=definert', () => {
    const verdi = hentVisning(false, false, mellomlagring);
    expect(verdi).toBe(VisningModus.AKTIV_MED_AVBRYT);
  });

  it('skal være AKTIV_UTEN_AVBRYT hvis readOnly=false, erAktivtSteg=true, mellomlagring=undefined', () => {
    const verdi = hentVisning(false, true, undefined);
    expect(verdi).toBe(VisningModus.AKTIV_UTEN_AVBRYT);
  });

  it('skal være AKTIV_UTEN_AVBRYT hvis readOnly=false, erAktivtSteg=true, mellomlagring=definert', () => {
    const verdi = hentVisning(false, true, mellomlagring);
    expect(verdi).toBe(VisningModus.AKTIV_UTEN_AVBRYT);
  });

  it('skal være LÅST_UTEN_ENDRE hvis readOnly=true, erAktivtSteg=false, mellomlagring=undefined', () => {
    const verdi = hentVisning(true, false, undefined);
    expect(verdi).toBe(VisningModus.LÅST_UTEN_ENDRE);
  });

  it('skal være LÅST_UTEN_ENDRE hvis readOnly=true, erAktivtSteg=false, mellomlagring=definert', () => {
    const verdi = hentVisning(true, false, mellomlagring);
    expect(verdi).toBe(VisningModus.LÅST_UTEN_ENDRE);
  });

  it('skal være LÅST_UTEN_ENDRE hvis readOnly=true, erAktivtSteg=true, mellomlagring=undefined', () => {
    const verdi = hentVisning(true, true, undefined);
    expect(verdi).toBe(VisningModus.LÅST_UTEN_ENDRE);
  });

  it('skal være LÅST_UTEN_ENDRE hvis readOnly=true, erAktivtSteg=true, mellomlagring=definert', () => {
    const verdi = hentVisning(true, true, mellomlagring);
    expect(verdi).toBe(VisningModus.LÅST_UTEN_ENDRE);
  });
});
