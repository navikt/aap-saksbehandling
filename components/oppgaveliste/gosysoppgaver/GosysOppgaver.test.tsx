import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ValuePair } from 'components/form/FormField';
import { useLagreAktiveEnheter } from 'hooks/oppgave/aktiveEnheterHook';
import { useGosysOppgaver } from 'hooks/oppgave/GosysOppgaverHook';
import { GosysOppgave } from 'lib/types/gosysTypes';
import { Enhet } from 'lib/types/oppgaveTypes';
import { GosysOppgaver } from './GosysOppgaver';

vi.mock('hooks/oppgave/GosysOppgaverHook', () => ({ useGosysOppgaver: vi.fn() }));
vi.mock('hooks/oppgave/aktiveEnheterHook', () => ({ useLagreAktiveEnheter: vi.fn() }));

const enheter: Enhet[] = [
  { enhetNr: '0300', navn: 'Enhet A' },
  { enhetNr: '0400', navn: 'Enhet B' },
];

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

const hentLagredeAktiveEnheter = vi.fn<() => ValuePair[] | undefined>();
const lastInnFlere = vi.fn(async () => undefined);
let hookResultat: ReturnType<typeof useGosysOppgaver>;

describe('GosysOppgaver', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(useLagreAktiveEnheter).mockReturnValue({
      hentLagredeAktiveEnheter,
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

  it('velger første enhet som standard og sender endret enhet til hooken', async () => {
    const user = userEvent.setup();
    render(<GosysOppgaver enheter={enheter} />);

    const select = screen.getByRole('combobox', { name: 'Velg enhet' });
    expect(select).toHaveValue('0300');
    expect(useGosysOppgaver).toHaveBeenLastCalledWith('0300', 'ae0292', undefined);

    await user.selectOptions(select, '0400');

    expect(useGosysOppgaver).toHaveBeenLastCalledWith('0400', 'ae0292', undefined);
  });

  it('bruker første lagrede enhet fremfor første enhet i listen', () => {
    hentLagredeAktiveEnheter.mockReturnValue([{ value: '0400', label: 'Enhet B' }]);
    render(<GosysOppgaver enheter={enheter} />);

    expect(screen.getByRole('combobox', { name: 'Velg enhet' })).toHaveValue('0400');
    expect(useGosysOppgaver).toHaveBeenLastCalledWith('0400', 'ae0292', undefined);
  });

  it.each([
    ['ae0292', 'ae0292', undefined],
    ['ae0294', 'ae0294', undefined],
    ['ab0269', 'ae0292', 'ab0269'],
    ['ae0012', 'ae0292', 'ae0012'],
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

  it('viser bare tildelte oppgaver når filteret aktiveres og alle igjen når det deaktiveres', async () => {
    const user = userEvent.setup();
    render(<GosysOppgaver enheter={enheter} />);
    const filter = screen.getByLabelText('Vis kun tildelte oppgaver');

    expect(screen.getByText('Utildelt oppgave')).toBeVisible();
    await user.click(filter);

    expect(screen.getByText('Tildelt oppgave')).toBeVisible();
    expect(screen.queryByText('Utildelt oppgave')).not.toBeInTheDocument();

    await user.click(filter);

    expect(screen.getByText('Tildelt oppgave')).toBeVisible();
    expect(screen.getByText('Utildelt oppgave')).toBeVisible();
  });

  it('viser lasteindikator i stedet for tabellen ved første henting', () => {
    vi.mocked(useGosysOppgaver).mockReturnValue({ ...hookResultat, isLoading: true, harLastetOppgaver: false });
    render(<GosysOppgaver enheter={enheter} />);

    expect(screen.getByText('Henter Gosys-oppgaver')).toBeVisible();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('viser feilmelding i stedet for tabellen når første henting feiler', () => {
    vi.mocked(useGosysOppgaver).mockReturnValue({
      ...hookResultat,
      error: new Error('Henting feilet'),
      harLastetOppgaver: false,
    });
    render(<GosysOppgaver enheter={enheter} />);

    expect(screen.getByText('Kunne ikke hente Gosys-oppgaver.')).toBeVisible();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('beholder innlastede oppgaver og viser feilmelding når henting av flere oppgaver feiler', async () => {
    const user = userEvent.setup();
    vi.mocked(useGosysOppgaver).mockReturnValue({ ...hookResultat, error: new Error('Henting feilet') });
    render(<GosysOppgaver enheter={enheter} />);

    expect(screen.getByRole('table', { name: 'Gosys-oppgaver' })).toBeVisible();
    expect(screen.getByText('Tildelt oppgave')).toBeVisible();
    expect(screen.getByText('Kunne ikke hente flere Gosys-oppgaver. Prøv igjen.')).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Last inn flere oppgaver' }));

    expect(lastInnFlere).toHaveBeenCalledOnce();
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

  it('hindrer flere kall mens nye oppgaver lastes inn', async () => {
    const user = userEvent.setup();
    vi.mocked(useGosysOppgaver).mockReturnValue({ ...hookResultat, isValidating: true });
    render(<GosysOppgaver enheter={enheter} />);

    const button = screen.getByRole('button', { name: 'Last inn flere oppgaver' });
    expect(button).toBeDisabled();
    await user.click(button);

    expect(lastInnFlere).not.toHaveBeenCalled();
    expect(screen.getByRole('table', { name: 'Gosys-oppgaver' })).toBeVisible();
  });
});
