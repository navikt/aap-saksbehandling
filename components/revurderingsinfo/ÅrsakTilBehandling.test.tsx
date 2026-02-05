import { describe, expect, it } from 'vitest';
import { VurderingsbehovOgÅrsak } from 'lib/types/types';
import { filtrerÅrsakerForBehandlingType } from './ÅrsakTilBehandling';

describe('ÅrsakTilBehandling filtering logic', () => {
  const årsakMedBeskrivelse: VurderingsbehovOgÅrsak = {
    årsak: 'SØKNAD',
    opprettet: '2026-01-01',
    vurderingsbehov: [{ type: 'VURDER_RETTIGHETSPERIODE', oppdatertTid: '2026-01-01' }],
    beskrivelse: 'Dette er en begrunnelse',
  };

  const årsakUtenBeskrivelse: VurderingsbehovOgÅrsak = {
    årsak: 'MELDEKORT',
    opprettet: '2026-01-02',
    vurderingsbehov: [{ type: 'BARNETILLEGG', oppdatertTid: '2026-01-02' }],
    beskrivelse: undefined,
  };

  it('returnerer alle årsaker for Revurdering uavhengig av beskrivelse', () => {
    const årsaker = [årsakMedBeskrivelse, årsakUtenBeskrivelse];
    const filtrert = filtrerÅrsakerForBehandlingType(årsaker, 'Revurdering');
    expect(filtrert).toHaveLength(2);
    expect(filtrert).toEqual(årsaker);
  });

  it('filtrerer bort årsaker uten beskrivelse for Førstegangsbehandling', () => {
    const årsaker = [årsakMedBeskrivelse, årsakUtenBeskrivelse];
    const filtrert = filtrerÅrsakerForBehandlingType(årsaker, 'Førstegangsbehandling');
    expect(filtrert).toHaveLength(1);
    expect(filtrert[0]).toEqual(årsakMedBeskrivelse);
  });

  it('returnerer tom liste når Førstegangsbehandling og ingen årsaker har beskrivelse', () => {
    const årsaker = [årsakUtenBeskrivelse];
    const filtrert = filtrerÅrsakerForBehandlingType(årsaker, 'Førstegangsbehandling');
    expect(filtrert).toHaveLength(0);
  });

  it('returnerer alle årsaker for Førstegangsbehandling når alle har beskrivelse', () => {
    const årsaker = [årsakMedBeskrivelse];
    const filtrert = filtrerÅrsakerForBehandlingType(årsaker, 'Førstegangsbehandling');
    expect(filtrert).toHaveLength(1);
    expect(filtrert[0]).toEqual(årsakMedBeskrivelse);
  });

  it('returnerer alle årsaker for Aktivitetsplikt uavhengig av beskrivelse', () => {
    const årsaker = [årsakMedBeskrivelse, årsakUtenBeskrivelse];
    const filtrert = filtrerÅrsakerForBehandlingType(årsaker, 'Aktivitetsplikt');
    expect(filtrert).toHaveLength(2);
    expect(filtrert).toEqual(årsaker);
  });
});

