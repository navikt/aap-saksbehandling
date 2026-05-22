import { describe, expect, it } from 'vitest';
import { hentStegDataForOppgittYrkesskadeInfo } from 'components/behandlinger/sykdom/Sykdom';

describe('hentStegDataForOppgittYrkesskadeInfo', () => {
  it('skal vise steg når oppgittYrkesskadeISøknad er true og ingen yrkesskadeVurdering finnes', () => {
    const result = hentStegDataForOppgittYrkesskadeInfo({
      opplysninger: { oppgittYrkesskadeISøknad: true },
    });
    expect(result.skalViseSteg).toBe(true);
    expect(result.readOnly).toBe(true);
  });

  it('skal ikke vise steg når oppgittYrkesskadeISøknad er false', () => {
    const result = hentStegDataForOppgittYrkesskadeInfo({
      opplysninger: { oppgittYrkesskadeISøknad: false },
    });
    expect(result.skalViseSteg).toBe(false);
  });

  it('skal ikke vise steg når oppgittYrkesskadeISøknad er null', () => {
    const result = hentStegDataForOppgittYrkesskadeInfo({
      opplysninger: { oppgittYrkesskadeISøknad: null },
    });
    expect(result.skalViseSteg).toBe(false);
  });

  it('skal ikke vise steg når oppgittYrkesskadeISøknad er undefined', () => {
    const result = hentStegDataForOppgittYrkesskadeInfo({
      opplysninger: {},
    });
    expect(result.skalViseSteg).toBe(false);
  });

  it('skal ikke vise steg når yrkesskadeVurdering allerede finnes', () => {
    const result = hentStegDataForOppgittYrkesskadeInfo({
      opplysninger: { oppgittYrkesskadeISøknad: true },
      yrkesskadeVurdering: { erÅrsakssammenheng: true },
    });
    expect(result.skalViseSteg).toBe(false);
  });

  it('skal alltid returnere readOnly true', () => {
    const result = hentStegDataForOppgittYrkesskadeInfo({
      opplysninger: { oppgittYrkesskadeISøknad: true },
    });
    expect(result.readOnly).toBe(true);
  });
});