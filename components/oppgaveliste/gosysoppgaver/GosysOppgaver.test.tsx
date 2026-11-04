import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useLagreAktiveEnheter } from 'hooks/oppgave/aktiveEnheterHook';
import { useGosysOppgaver } from 'hooks/oppgave/GosysOppgaverHook';
import { GosysOppgave } from 'lib/types/gosysTypes';
import { Enhet } from 'lib/types/oppgaveTypes';
import { GosysOppgaver } from './GosysOppgaver';

vi.mock('hooks/oppgave/GosysOppgaverHook', () => ({ useGosysOppgaver: vi.fn() }));
vi.mock('hooks/oppgave/aktiveEnheterHook', () => ({ useLagreAktiveEnheter: vi.fn() }));

const enheter: Enhet[] = [{ enhetNr: '0300', navn: 'Enhet A' }];

const tildeltOppgave: GosysOppgave = {
  id: 1,
  tema: 'AAP',
  oppgavetype: 'JFR',
  tildeltEnhetsnr: '0300',
  status: 'OPPRETTET',
  versjon: 1,
  prioritet: 'NORM',
  aktivDato: '2026-10-29',
  tilordnetRessurs: 'Z000001',
  beskrivelse: 'Tildelt oppgave',
};

const lastInnFlere = vi.fn(async () => undefined);
let hookResultat: ReturnType<typeof useGosysOppgaver>;

describe('GosysOppgaver', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(useLagreAktiveEnheter).mockReturnValue({
      hentLagredeAktiveEnheter: vi.fn(),
      lagreAktiveEnheter: vi.fn(),
    });
    hookResultat = {
      oppgaver: [
        tildeltOppgave,
        { ...tildeltOppgave, id: 2, tilordnetRessurs: undefined, beskrivelse: 'Utildelt oppgave' },
      ],
      antallTreff: 2,
      kanLasteFlere: true,
      isLoading: false,
      isValidating: false,
      error: undefined,
      harLastetOppgaver: true,
      lastInnFlere,
    };
    vi.mocked(useGosysOppgaver).mockReturnValue(hookResultat);
  });

  it.each([
    ['ae0292', 'ae0292', undefined],
    ['ae0294', 'ae0294', undefined],
    ['ab0269', 'ae0292', 'ab0269'],
    ['ab0570', 'ae0292', 'ab0570'],
  ])('sender riktig behandlingstype og behandlingstema for %s', async (valg, behandlingstype, behandlingstema) => {
    const user = userEvent.setup();
    render(<GosysOppgaver enheter={enheter} />);

    await user.selectOptions(screen.getByRole('combobox', { name: 'Gjelder' }), valg);

    expect(useGosysOppgaver).toHaveBeenLastCalledWith('0300', behandlingstype, behandlingstema);
  });

  it('fjerner behandlingstema når brukeren bytter tilbake til en vanlig behandlingstype', async () => {
    const user = userEvent.setup();
    render(<GosysOppgaver enheter={enheter} />);
    const select = screen.getByRole('combobox', { name: 'Gjelder' });

    await user.selectOptions(select, 'ab0269');
    expect(useGosysOppgaver).toHaveBeenLastCalledWith('0300', 'ae0292', 'ab0269');

    await user.selectOptions(select, 'ae0294');
    expect(useGosysOppgaver).toHaveBeenLastCalledWith('0300', 'ae0294', undefined);
  });

  it('viser kun ledige oppgaver som standard og alle oppgaver når bryteren slås av', async () => {
    const user = userEvent.setup();
    render(<GosysOppgaver enheter={enheter} />);
    const filter = screen.getByRole('checkbox', { name: 'Vis kun ledige oppgaver' });

    expect(filter).toBeChecked();
    expect(screen.getByText('Utildelt oppgave')).toBeVisible();
    expect(screen.queryByText('Tildelt oppgave')).not.toBeInTheDocument();

    await user.click(filter);

    expect(filter).not.toBeChecked();
    expect(screen.getByText('Tildelt oppgave')).toBeVisible();
    expect(screen.getByText('Utildelt oppgave')).toBeVisible();

    await user.click(filter);

    expect(filter).toBeChecked();
    expect(screen.queryByText('Tildelt oppgave')).not.toBeInTheDocument();
    expect(screen.getByText('Utildelt oppgave')).toBeVisible();
  });

  it('skiller antall ledige blant innlastede oppgaver fra totalt antall treff', async () => {
    const user = userEvent.setup();
    vi.mocked(useGosysOppgaver).mockReturnValue({ ...hookResultat, antallTreff: 100 });
    render(<GosysOppgaver enheter={enheter} />);

    expect(screen.getByText('Viser 1 ledige blant 2 innlastede oppgaver')).toBeVisible();

    await user.click(screen.getByRole('checkbox', { name: 'Vis kun ledige oppgaver' }));

    expect(screen.getByText('Viser 2 av 100 oppgaver')).toBeVisible();
  });

  it('laster flere oppgaver når brukeren trykker på knappen', async () => {
    const user = userEvent.setup();
    render(<GosysOppgaver enheter={enheter} />);

    await user.click(screen.getByRole('button', { name: 'Last inn flere oppgaver' }));

    expect(lastInnFlere).toHaveBeenCalledOnce();
  });

  it('skjuler last inn flere-knappen når alle oppgavene er lastet inn', () => {
    vi.mocked(useGosysOppgaver).mockReturnValue({ ...hookResultat, kanLasteFlere: false });
    render(<GosysOppgaver enheter={enheter} />);

    expect(screen.queryByRole('button', { name: 'Last inn flere oppgaver' })).not.toBeInTheDocument();
  });
});
