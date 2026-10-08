import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor, act } from '@testing-library/react';
import { AvklarTema } from './AvklarTema';
import { AvklarTemaGrunnlag } from 'lib/types/postmottakTypes';
import { render } from 'lib/test/CustomRender';
import { FeatureFlagProvider } from 'context/UnleashContext';
import { mockedFlags } from 'lib/services/unleash/unleashToggles';

const { løsBehov, gosysBehov } = vi.hoisted(() => ({ løsBehov: vi.fn(), gosysBehov: vi.fn() }));
vi.mock('hooks/postmottak/PostmottakLøsBehovOgGåTilNesteStegHook', () => ({
  usePostmottakLøsBehovOgGåTilNesteSteg: () => ({ løsBehovOgGåTilNesteSteg: løsBehov, isLoading: false }),
}));
vi.mock('lib/postmottakClientApi', () => ({ postmottakLøsBehovClient: gosysBehov }));
vi.mock('hooks/postmottak/PostmottakFlytHook', () => ({
  usePostmottakRequiredFlyt: () => ({ flyt: { aktivtSteg: 'AVKLAR_TEMA' } }),
}));
vi.mock('lib/clientApi', () => ({
  clientConfig: vi.fn().mockResolvedValue({ type: 'SUCCESS', data: { gosysUrl: '/gosys' } }),
}));

describe('AvklarTema', () => {
  const grunnlag: AvklarTemaGrunnlag = {
    vurdering: { skalTilAap: true },
    dokumenter: [],
    journalpostMetadata: {
      brevkode: 'NAV 11-13.05',
      journalfoerendeEnhet: null,
    },
  };
  beforeEach(() => {
    vi.clearAllMocks();
    gosysBehov.mockResolvedValue({ type: 'SUCCESS' });
  });
  const visTema = (enabled: boolean, data = grunnlag, readOnly = false) =>
    render(
      <FeatureFlagProvider flags={{ ...mockedFlags, PostmottakVelgTema: enabled }}>
        <AvklarTema behandlingsVersjon={1} behandlingsreferanse="123" grunnlag={data} readOnly={readOnly} />
      </FeatureFlagProvider>
    );
  it('Skal ha en tittel', async () => {
    await act(async () => {
      render(<AvklarTema behandlingsVersjon={1} behandlingsreferanse={'123'} grunnlag={grunnlag} readOnly={false} />);
    });
    const heading = screen.getByText('Avklar tema');
    expect(heading).toBeVisible();
  });
  it('Har et valg for om dokumentet hører til tema AAP eller ikke', async () => {
    await act(async () => {
      render(<AvklarTema behandlingsVersjon={1} behandlingsreferanse={'123'} grunnlag={grunnlag} readOnly={false} />);
    });
    expect(screen.getByText('Hører dette dokumentet til tema AAP?')).toBeVisible();
  });

  it('beholder Gosys-flyten uten temafelt når toggle er av', async () => {
    visTema(false);
    fireEvent.click(screen.getByRole('radio', { name: 'Nei' }));
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
    fireEvent.submit(screen.getByRole('radio', { name: 'Nei' }).closest('form')!);
    await waitFor(() =>
      expect(gosysBehov).toHaveBeenCalledWith({
        behandlingVersjon: 1,
        referanse: '123',
        behov: { behovstype: '1339', skalTilAap: false },
      })
    );
    expect(løsBehov).not.toHaveBeenCalled();
  });

  it('krever tema for Nei og sender valgt kode uten Gosys-modal', async () => {
    visTema(true);
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('radio', { name: 'Nei' }));
    expect(screen.queryByText(/Tema endres på journalposten/)).not.toBeInTheDocument();
    const select = screen.getByRole('combobox', { name: 'Velg tema' });
    expect(select.querySelectorAll('option')).toHaveLength(27);
    const form = select.closest('form')!;
    fireEvent.submit(form);
    expect(await screen.findByText('Du må velge tema')).toBeVisible();
    expect(løsBehov).not.toHaveBeenCalled();
    fireEvent.change(select, { target: { value: 'BAR' } });
    expect(screen.getByText(/Tema endres på journalposten/)).toBeVisible();
    fireEvent.submit(form);
    await waitFor(() =>
      expect(løsBehov).toHaveBeenCalledWith({
        behandlingVersjon: 1,
        referanse: '123',
        behov: { behovstype: '1339', skalTilAap: false, tema: 'BAR' },
      })
    );
    expect(gosysBehov).not.toHaveBeenCalled();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('viser lagret tema og sender UKJENT som fallback', async () => {
    visTema(true, { ...grunnlag, vurdering: { skalTilAap: false, tema: 'UKJENT' } });
    const select = screen.getByRole('combobox', { name: 'Velg tema' });
    expect(select).toHaveValue('UKJENT');
    expect(screen.getByText(/Dokumentet sendes til Gosys for avklaring/)).toBeVisible();
    fireEvent.submit(select.closest('form')!);
    await waitFor(() =>
      expect(løsBehov).toHaveBeenCalledWith(
        expect.objectContaining({ behov: { behovstype: '1339', skalTilAap: false, tema: 'UKJENT' } })
      )
    );
  });

  it('sender ikke tidligere valgt tema når svaret endres til Ja', async () => {
    visTema(true, { ...grunnlag, vurdering: { skalTilAap: false, tema: 'BAR' } });
    fireEvent.click(screen.getByRole('radio', { name: 'Ja' }));
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
    fireEvent.submit(screen.getByRole('radio', { name: 'Ja' }).closest('form')!);
    await waitFor(() =>
      expect(løsBehov).toHaveBeenCalledWith(
        expect.objectContaining({ behov: { behovstype: '1339', skalTilAap: true } })
      )
    );
  });

  it('viser lagret OPP i lesemodus med informasjon om dagens journalføringsflyt', async () => {
    await act(async () => {
      visTema(true, { ...grunnlag, vurdering: { skalTilAap: false, tema: 'OPP' } }, true);
    });
    expect(screen.getByText('Oppfølging')).toBeVisible();
    expect(screen.getByRole('combobox', { name: 'Skrivebeskyttet Velg tema' })).toHaveValue('OPP');
    expect(screen.getByText('Dokumentet journalføres på generell sak med tema Oppfølging.')).toBeVisible();
  });
});
