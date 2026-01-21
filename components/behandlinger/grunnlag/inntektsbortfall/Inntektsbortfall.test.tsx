import { beforeEach, describe, expect, it, vi } from 'vitest';
import { defaultFlytResponse, setMockFlytResponse } from 'vitestSetup';
import { InntektsbortfallMedDataFetching } from './InntektsbortfallMedDataFetching';
import * as saksbehandlingService from 'lib/services/saksbehandlingservice/saksbehandlingService';

beforeEach(() => {
  setMockFlytResponse({ ...defaultFlytResponse, aktivtSteg: 'MANGLENDE_LIGNING' });
});

describe('InntektsbortfallMedDataFetching', () => {
  it('skal ikke vise Inntektsbortfall når bruker er under 62 år', async () => {
    vi.spyOn(saksbehandlingService, 'hentInntektsBortfallGrunnlag').mockResolvedValue({
      type: 'SUCCESS',
      data: {
        harTilgangTilÅSaksbehandle: true,
        grunnlag: {
          kanBehandlesAutomatisk: true,
          inntektSiste3ÅrOver3G: { resultat: true, gverdi: 4 },
          inntektSisteÅrOver1G: { resultat: true, gverdi: 3 },
          under62ÅrVedSøknadstidspunkt: { resultat: true, alder: 60 },
        },
        vurdering: undefined,
      },
    });
    vi.spyOn(saksbehandlingService, 'hentMellomlagring').mockResolvedValue(undefined);

    const result = await InntektsbortfallMedDataFetching({
      behandlingsReferanse: 'test-ref',
      stegData: {
        readOnly: false,
        behandlingVersjon: 1,
        typeBehandling: 'Førstegangsbehandling',
        avklaringsbehov: [],
        skalViseSteg: true,
      },
    });

    expect(result).toBeNull();
  });

  it('skal vise Inntektsbortfall når bruker er over 62 år', async () => {
    vi.spyOn(saksbehandlingService, 'hentInntektsBortfallGrunnlag').mockResolvedValue({
      type: 'SUCCESS',
      data: {
        harTilgangTilÅSaksbehandle: true,
        grunnlag: {
          kanBehandlesAutomatisk: true,
          inntektSiste3ÅrOver3G: { resultat: true, gverdi: 4 },
          inntektSisteÅrOver1G: { resultat: true, gverdi: 3 },
          under62ÅrVedSøknadstidspunkt: { resultat: false, alder: 63 },
        },
        vurdering: undefined,
      },
    });
    vi.spyOn(saksbehandlingService, 'hentMellomlagring').mockResolvedValue(undefined);

    const result = await InntektsbortfallMedDataFetching({
      behandlingsReferanse: 'test-ref',
      stegData: {
        readOnly: false,
        behandlingVersjon: 1,
        typeBehandling: 'Førstegangsbehandling',
        avklaringsbehov: [],
        skalViseSteg: true,
      },
    });

    expect(result).not.toBeNull();
  });
});
