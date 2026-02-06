import { describe, expect, it } from 'vitest';
import { DetaljertBehandling } from 'lib/types/types';
import { visÅrsakTilVurdering } from './visÅrsakTilVurdering';

// Bekrefter oppførsel fra her: https://app.mural.co/t/navdesign3580/m/navdesign3580/1691741508416/fd5f7a66bff6d60858a803726f0485840d12fdac?wid=0-1770286073815
describe('visÅrsakTilVurdering', () => {
  it('returnerer true når behandlingstype er Revurdering', () => {
    const behandling: Partial<DetaljertBehandling> = {
      type: 'Revurdering',
      vurderingsbehovOgÅrsaker: [],
    };
    expect(visÅrsakTilVurdering(behandling as DetaljertBehandling)).toBe(true);
  });

  it('returnerer true når behandlingstype er Aktivitetsplikt', () => {
    const behandling: Partial<DetaljertBehandling> = {
      type: 'Aktivitetsplikt',
      vurderingsbehovOgÅrsaker: [],
    };
    expect(visÅrsakTilVurdering(behandling as DetaljertBehandling)).toBe(true);
  });

  it('returnerer false når behandlingstype er Førstegangsbehandling og ingen årsaker', () => {
    const behandling: Partial<DetaljertBehandling> = {
      type: 'Førstegangsbehandling',
      vurderingsbehovOgÅrsaker: [],
    };
    expect(visÅrsakTilVurdering(behandling as DetaljertBehandling)).toBe(false);
  });

  it('returnerer false når behandlingstype er Førstegangsbehandling og ingen årsaker har begrunnelse', () => {
    const behandling: Partial<DetaljertBehandling> = {
      type: 'Førstegangsbehandling',
      vurderingsbehovOgÅrsaker: [
        {
          årsak: 'SØKNAD',
          opprettet: '2026-01-01',
          vurderingsbehov: [],
          beskrivelse: undefined,
        },
        {
          årsak: 'MELDEKORT',
          opprettet: '2026-01-01',
          vurderingsbehov: [],
          beskrivelse: undefined,
        },
      ],
    };
    expect(visÅrsakTilVurdering(behandling as DetaljertBehandling)).toBe(false);
  });

  it('returnerer true når behandlingstype er Førstegangsbehandling og kun noen årsaker har begrunnelse', () => {
    const behandling: Partial<DetaljertBehandling> = {
      type: 'Førstegangsbehandling',
      vurderingsbehovOgÅrsaker: [
        {
          årsak: 'SØKNAD',
          opprettet: '2026-01-01',
          vurderingsbehov: [],
          beskrivelse: 'Dette er en begrunnelse',
        },
        {
          årsak: 'MELDEKORT',
          opprettet: '2026-01-01',
          vurderingsbehov: [],
          beskrivelse: undefined,
        },
      ],
    };
    expect(visÅrsakTilVurdering(behandling as DetaljertBehandling)).toBe(true);
  });

  it('returnerer true når behandlingstype er Førstegangsbehandling og alle årsaker har begrunnelse', () => {
    const behandling: Partial<DetaljertBehandling> = {
      type: 'Førstegangsbehandling',
      vurderingsbehovOgÅrsaker: [
        {
          årsak: 'SØKNAD',
          opprettet: '2026-01-01',
          vurderingsbehov: [],
          beskrivelse: 'Dette er en begrunnelse',
        },
        {
          årsak: 'MELDEKORT',
          opprettet: '2026-01-01',
          vurderingsbehov: [],
          beskrivelse: 'En annen begrunnelse',
        },
      ],
    };
    expect(visÅrsakTilVurdering(behandling as DetaljertBehandling)).toBe(true);
  });

  it('returnerer true når behandlingstype er Førstegangsbehandling med én årsak som har begrunnelse', () => {
    const behandling: Partial<DetaljertBehandling> = {
      type: 'Førstegangsbehandling',
      vurderingsbehovOgÅrsaker: [
        {
          årsak: 'SØKNAD',
          opprettet: '2026-01-01',
          vurderingsbehov: [],
          beskrivelse: 'Dette er en begrunnelse',
        },
      ],
    };
    expect(visÅrsakTilVurdering(behandling as DetaljertBehandling)).toBe(true);
  });
});
