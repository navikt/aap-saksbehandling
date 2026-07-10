import { describe, test, expect, vi, beforeEach } from 'vitest';
import { harUnderkjentVurdering, skalViseIngenFlereOppgaverModal } from './skalViseIngenFlereOppgaverModal';
import { Behovstype } from 'lib/utils/form';
import { ServerSentEventData } from 'app/saksbehandling/api/behandling/hent/[referanse]/[gruppe]/[steg]/nesteSteg/route';
import { LøsAvklaringsbehovPåBehandling } from 'lib/types/types';

const mockClientHentTilgangForKvalitetssikring = vi.fn();
const mockClientSjekkTilgang = vi.fn();

vi.mock('lib/clientApi', () => ({
  clientHentTilgangForKvalitetssikring: (...args: unknown[]) => mockClientHentTilgangForKvalitetssikring(...args),
  clientSjekkTilgang: (...args: unknown[]) => mockClientSjekkTilgang(...args),
}));

vi.mock('lib/utils/api', () => ({
  isSuccess: (res: { ok: boolean }) => res.ok,
}));

describe('ved godkjent / underkjent vurdering', () => {
  const lagBehov = (behov: LøsAvklaringsbehovPåBehandling['behov']): LøsAvklaringsbehovPåBehandling => ({
    behandlingVersjon: 1,
    behov,
    referanse: 'test-ref',
  });

  test('skal returnere false for vanlig behovstype', () => {
    const behov = lagBehov({ behovstype: '5001' });
    expect(harUnderkjentVurdering(behov)).toBe(false);
  });

  test('skal returnere false for kvalitetssikring der alle er godkjent', () => {
    const behov = lagBehov({
      behovstype: Behovstype.KVALITETSSIKRING_KODE,
      vurderinger: [
        { godkjent: true, definisjon: '5001' },
        { godkjent: true, definisjon: '5002' },
      ],
    });
    expect(harUnderkjentVurdering(behov)).toBe(false);
  });

  test('skal returnere true for kvalitetssikring med underkjent vurdering', () => {
    const behov = lagBehov({
      behovstype: Behovstype.KVALITETSSIKRING_KODE,
      vurderinger: [
        { godkjent: true, definisjon: '5001' },
        { godkjent: false, definisjon: '5002' },
      ],
    });
    expect(harUnderkjentVurdering(behov)).toBe(true);
  });

  test('skal returnere false for beslutning der alle er godkjent', () => {
    const behov = lagBehov({
      behovstype: Behovstype.FATTE_VEDTAK_KODE,
      vurderinger: [{ godkjent: true, definisjon: '5001' }],
    });
    expect(harUnderkjentVurdering(behov)).toBe(false);
  });

  test('skal returnere true for beslutning med underkjent vurdering', () => {
    const behov = lagBehov({
      behovstype: Behovstype.FATTE_VEDTAK_KODE,
      vurderinger: [{ godkjent: false, definisjon: '5001' }],
    });
    expect(harUnderkjentVurdering(behov)).toBe(true);
  });
});

describe('skal vise ingen flere oppgaver modal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const lagEventData = (overrides: Partial<ServerSentEventData> = {}): ServerSentEventData => ({
    status: 'DONE',
    gjeldendeSteg: undefined,
    skalBytteGruppe: false,
    skalBytteSteg: false,
    aktivVisningGruppe: undefined,
    aktivtVisningSteg: undefined,
    aktivtStegBehovsKode: undefined,
    ...overrides,
  });

  test('skal returnere true når saksbehandler ikke har tilgang til neste steg', async () => {
    mockClientSjekkTilgang.mockResolvedValue({ ok: true, data: { tilgang: false } });

    const result = await skalViseIngenFlereOppgaverModal(
      lagEventData({ aktivtStegBehovsKode: ['5001'] }),
      'ref-123',
      false
    );

    expect(result).toBe(true);
  });

  test('skal returnere false når saksbehandler har tilgang til neste steg', async () => {
    mockClientSjekkTilgang.mockResolvedValue({ ok: true, data: { tilgang: true } });

    const result = await skalViseIngenFlereOppgaverModal(
      lagEventData({ aktivtStegBehovsKode: ['5001'] }),
      'ref-123',
      false
    );

    expect(result).toBe(false);
  });

  test('skal returnere true ved underkjennelse selv om saksbehandler har tilgang', async () => {
    mockClientSjekkTilgang.mockResolvedValue({ ok: true, data: { tilgang: true } });

    const result = await skalViseIngenFlereOppgaverModal(
      lagEventData({ aktivtStegBehovsKode: ['5001'] }),
      'ref-123',
      true
    );

    expect(result).toBe(true);
  });

  test('skal returnere true når saksbehandler har sendt til beslutter', async () => {
    const result = await skalViseIngenFlereOppgaverModal(
      lagEventData({ gjeldendeSteg: 'FATTE_VEDTAK', skalBytteGruppe: true }),
      'ref-123',
      false
    );

    expect(result).toBe(true);
  });

  test('skal sjekke kvalitetssikringstilgang når gjeldende steg er KVALITETSSIKRING', async () => {
    mockClientHentTilgangForKvalitetssikring.mockResolvedValue({
      ok: true,
      data: { harTilgangTilÅKvalitetssikre: true },
    });

    const result = await skalViseIngenFlereOppgaverModal(
      lagEventData({ gjeldendeSteg: 'KVALITETSSIKRING' }),
      'ref-123',
      false
    );

    expect(result).toBe(false);
    expect(mockClientHentTilgangForKvalitetssikring).toHaveBeenCalledWith('ref-123');
  });

  test('skal returnere true når saksbehandler ikke har kvalitetssikringstilgang', async () => {
    mockClientHentTilgangForKvalitetssikring.mockResolvedValue({
      ok: true,
      data: { harTilgangTilÅKvalitetssikre: false },
    });

    const result = await skalViseIngenFlereOppgaverModal(
      lagEventData({ gjeldendeSteg: 'KVALITETSSIKRING' }),
      'ref-123',
      false
    );

    expect(result).toBe(true);
  });

  test('skal sjekke tilgang for alle behovskoder', async () => {
    mockClientSjekkTilgang
      .mockResolvedValueOnce({ ok: true, data: { tilgang: false } })
      .mockResolvedValueOnce({ ok: true, data: { tilgang: true } });

    const result = await skalViseIngenFlereOppgaverModal(
      lagEventData({ aktivtStegBehovsKode: ['5001', '5002'] }),
      'ref-123',
      false
    );

    expect(result).toBe(false);
    expect(mockClientSjekkTilgang).toHaveBeenCalledTimes(2);
  });
});
