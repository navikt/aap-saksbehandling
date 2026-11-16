import { Children } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SkriveKlageBrevMedDataFetching } from './SkriveKlageBrevMedDataFetching';
import { BrevOppsummering } from './BrevOppsummering';
import { SkriveBrev } from './SkriveBrev';
import { Brevbygger } from 'components/brevbygger/Brevbygger';
import { hentBrevGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { BrevGrunnlagBrev } from 'lib/types/types';

vi.mock('server-only', () => ({}));
vi.mock('./SkriveBrev', () => ({ SkriveBrev: vi.fn() }));
vi.mock('./BrevOppsummering', () => ({ BrevOppsummering: vi.fn() }));
vi.mock('./KlagesaksopplysningerKolonne', () => ({ KlagesaksopplysningerKolonne: vi.fn() }));
vi.mock('components/brevbygger/Brevbygger', () => ({ Brevbygger: vi.fn() }));
vi.mock('lib/services/saksbehandlingservice/saksbehandlingService', () => ({
  hentBrevGrunnlag: vi.fn(),
  hentKlageresultat: vi.fn().mockResolvedValue({ type: 'SUCCESS', data: {} }),
  hentFormkravGrunnlag: vi.fn().mockResolvedValue({ type: 'SUCCESS', data: {} }),
  hentKlagebehandlingKontorGrunnlag: vi.fn().mockResolvedValue({ type: 'SUCCESS', data: {} }),
  hentKlagebehandlingNayGrunnlag: vi.fn().mockResolvedValue({ type: 'SUCCESS', data: {} }),
  hentFullmektigGrunnlag: vi.fn().mockResolvedValue({ type: 'SUCCESS', data: {} }),
}));

const brev: BrevGrunnlagBrev = {
  avklaringsbehovKode: '5050',
  brevbestillingReferanse: 'brev-ref',
  brevtype: 'KLAGE_OPPRETTHOLDELSE',
  bruker: { ident: '12345678901', navn: 'Test Bruker' },
  mottaker: { ident: '12345678901', navn: 'Test Bruker', identType: 'FNR' },
  harTilgangTilÅSendeBrev: true,
  oppdatert: '2026-11-16T12:00:00',
  opprettet: '2026-11-16T12:00:00',
  signaturer: [],
  språk: 'NB',
  status: 'FORHÅNDSVISNING_KLAR',
};

const brevdata: BrevGrunnlagBrev['brevdata'] = {
  automatiskValgteDelmalIder: [],
  automatiskValgteValg: [],
  betingetTekst: [],
  delmaler: [],
  fritekster: [],
  valg: [],
};

const hentKomponent = async (brevGrunnlag: BrevGrunnlagBrev[]) => {
  vi.mocked(hentBrevGrunnlag).mockResolvedValue({
    type: 'SUCCESS',
    data: { brevGrunnlag },
  });
  return SkriveKlageBrevMedDataFetching({
    behandlingsreferanse: 'behandling-ref',
    behandlingVersjon: 1,
    aktivtSteg: 'BREV',
    behandlingstype: 'Klage',
  });
};

describe('SkriveKlageBrevMedDataFetching', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('viser ny brevbygger med brevmal og brevdata uten gammelt brevgrunnlag', async () => {
    const result = await hentKomponent([{ ...brev, brevmal: '{}', brevdata }]);

    expect(Children.toArray(result.props.children)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: Brevbygger,
          props: expect.objectContaining({ brevmal: '{}', brevdata, brevtype: 'KLAGE_OPPRETTHOLDELSE' }),
        }),
      ])
    );
  });

  it('viser gammel brevbygger når gammelt brevgrunnlag finnes', async () => {
    const grunnlag = { tekstbolker: [] };
    const result = await hentKomponent([{ ...brev, brev: grunnlag }]);

    expect(Children.toArray(result.props.children)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: SkriveBrev, props: expect.objectContaining({ grunnlag }) }),
      ])
    );
  });

  it.each([
    { brevGrunnlag: [] },
    { brevGrunnlag: [brev] },
    { brevGrunnlag: [{ ...brev, brevmal: '{}' }] },
    { brevGrunnlag: [{ ...brev, brevdata }] },
  ])('viser oppsummering uten et redigerbart brev (%#)', async ({ brevGrunnlag }) => {
    const result = await hentKomponent(brevGrunnlag);

    expect(result.type).toBe(BrevOppsummering);
  });
});
