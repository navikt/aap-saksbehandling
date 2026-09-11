import { describe, expect, it, vi } from 'vitest';
import { YrkesskadeMedDataFetching } from 'components/behandlinger/sykdom/yrkesskade/YrkesskadeMedDataFetching';
import { Yrkesskade } from 'components/behandlinger/sykdom/yrkesskade/Yrkesskade';
import { OppgittYrkesskadeUtenRegistertreffInfo } from 'components/behandlinger/sykdom/yrkesskade/OppgittYrkesskadeUtenRegistertreffInfo';
import * as saksbehandlingService from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { Avklaringsbehov, YrkesskadeVurderingGrunnlag } from 'lib/types/types';
import { StegData } from 'lib/utils/steg';

vi.mock('server-only', () => {
  return {};
});

const lagStegData = (avklaringsbehov: Avklaringsbehov[] = []): StegData => ({
  stegType: 'VURDER_YRKESSKADE',
  skalViseSteg: true,
  readOnly: false,
  behandlingVersjon: 1,
  typeBehandling: 'Førstegangsbehandling',
  avklaringsbehov,
  erIkkePåVent: true,
});

const lagGrunnlag = (
  overrides: Partial<{
    oppgittYrkesskadeISøknad: boolean | null;
    innhentedeYrkesskader: unknown[];
    yrkesskadeVurdering: unknown;
  }>
): YrkesskadeVurderingGrunnlag =>
  ({
    harTilgangTilÅSaksbehandle: true,
    opplysninger: {
      oppgittYrkesskadeISøknad: overrides.oppgittYrkesskadeISøknad,
      innhentedeYrkesskader: overrides.innhentedeYrkesskader ?? [],
    },
    yrkesskadeVurdering: overrides.yrkesskadeVurdering,
  }) as unknown as YrkesskadeVurderingGrunnlag;

const mockGrunnlag = (grunnlag: YrkesskadeVurderingGrunnlag) => {
  vi.spyOn(saksbehandlingService, 'hentYrkesskadeVurderingGrunnlag').mockResolvedValue({
    type: 'SUCCESS',
    data: grunnlag,
  });
  vi.spyOn(saksbehandlingService, 'hentMellomlagring').mockResolvedValue(undefined);
};

describe('YrkesskadeMedDataFetching', () => {
  it('viser Yrkesskade når det finnes et åpent avklaringsbehov', async () => {
    mockGrunnlag(lagGrunnlag({}));

    const result = await YrkesskadeMedDataFetching({
      behandlingsreferanse: 'test-ref',
      stegData: lagStegData([{} as Avklaringsbehov]),
    });

    expect(result?.type).toBe(Yrkesskade);
  });

  it('viser Yrkesskade når det finnes en tidligere yrkesskadevurdering', async () => {
    mockGrunnlag(lagGrunnlag({ yrkesskadeVurdering: { erÅrsakssammenheng: true } }));

    const result = await YrkesskadeMedDataFetching({
      behandlingsreferanse: 'test-ref',
      stegData: lagStegData(),
    });

    expect(result?.type).toBe(Yrkesskade);
  });

  it('viser Yrkesskade når det finnes innhentede yrkesskader, selv uten avklaringsbehov eller vurdering', async () => {
    mockGrunnlag(lagGrunnlag({ innhentedeYrkesskader: [{}] }));

    const result = await YrkesskadeMedDataFetching({
      behandlingsreferanse: 'test-ref',
      stegData: lagStegData(),
    });

    expect(result?.type).toBe(Yrkesskade);
  });

  it('viser OppgittYrkesskadeUtenRegistertreffInfo når bruker har oppgitt yrkesskade, men ingenting er funnet', async () => {
    mockGrunnlag(lagGrunnlag({ oppgittYrkesskadeISøknad: true }));

    const result = await YrkesskadeMedDataFetching({
      behandlingsreferanse: 'test-ref',
      stegData: lagStegData(),
    });

    expect(result?.type).toBe(OppgittYrkesskadeUtenRegistertreffInfo);
  });

  it('viser ingenting når bruker ikke har oppgitt yrkesskade og ingenting er funnet', async () => {
    mockGrunnlag(lagGrunnlag({ oppgittYrkesskadeISøknad: false }));

    const result = await YrkesskadeMedDataFetching({
      behandlingsreferanse: 'test-ref',
      stegData: lagStegData(),
    });

    expect(result).toBeNull();
  });
});
