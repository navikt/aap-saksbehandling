import { describe, it, expect } from 'vitest';
import { hentVisning, VisningModus } from 'hooks/saksbehandling/visning/VisningHook';

describe('Visning av vilkårskort i førstegangsbehandling', () => {
  it('Skal har riktig visning hvis det ikke er AktivtSteg og readOnly er false', () => {
    const verdi = hentVisning(false, false);
    expect(verdi).toBe(VisningModus.LÅST_MED_ENDRE);
  });

  it('Skal har riktig visning hvis det er readOnly og aktivtSteg er true', () => {
    const verdi = hentVisning(true, true);
    expect(verdi).toBe(VisningModus.LÅST_UTEN_ENDRE);
  });

  it('Skal ha riktig visning hvis det er readOnly og aktivtSteg er false ', () => {
    const verdi = hentVisning(true, false);
    expect(verdi).toBe(VisningModus.LÅST_UTEN_ENDRE);
  });

  it('Skal har riktig visning hvis det erAktivtSteg og readOnly er false', () => {
    const verdi = hentVisning(false, true);
    expect(verdi).toBe(VisningModus.AKTIV_UTEN_AVBRYT);
  });
});
