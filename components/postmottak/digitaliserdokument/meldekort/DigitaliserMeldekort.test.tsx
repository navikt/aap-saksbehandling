import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { clientHentHarRegistrertTimerIMeldeperioden } from 'lib/clientApi';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  DigitaliserMeldekort,
  ukestartSisteHalvår,
} from 'components/postmottak/digitaliserdokument/meldekort/DigitaliserMeldekort';

vi.mock('lib/clientApi', () => ({
  clientHentHarRegistrertTimerIMeldeperioden: vi.fn(),
}));

const user = userEvent.setup();

const ukestarterSisteHalvår = ukestartSisteHalvår();

describe('Validering av mottatt dato på digitalisert meldekort', () => {
  beforeEach(() => {
    vi.mocked(clientHentHarRegistrertTimerIMeldeperioden).mockResolvedValue({
      type: 'SUCCESS' as const,
      data: { harRegistrertTimerForMeldeperioden: false },
    });
    render(<DigitaliserMeldekort submit={() => {}} isLoading={false} readOnly={false} saksnummer={'123456'} />);
  });

  async function velgToPåfølgendeUker() {
    const combobox = screen.getByRole('combobox', { name: 'Hvilke uker gjelder meldekortet for?' });
    await user.click(combobox);
    const option1 = screen.getByRole('option', { name: ukestarterSisteHalvår[0].label });
    await user.click(option1);

    await user.click(combobox);
    const option2 = screen.getByRole('option', { name: ukestarterSisteHalvår[1].label });
    await user.click(option2);
  }

  async function trykkPåNeste() {
    await user.click(screen.getByRole('button', { name: 'Neste' }));
  }

  it('viser feilmelding når mottatt dato er satt til før siste dag i valgt meldeperiode', async () => {
    await velgToPåfølgendeUker();

    const innsendtDatoInput = screen.getByRole('textbox', { name: 'Dato bruker oppga opplysninger' });
    await user.type(innsendtDatoInput, '01.01.2020');

    await trykkPåNeste();

    expect(await screen.findByText('Mottatt dato kan ikke være før dagen etter valgt meldeperiode.')).toBeVisible();
  });

  it('viser ikke feilmelding når mottatt dato er satt til langt etter valgt meldeperiode', async () => {
    await velgToPåfølgendeUker();

    const innsendtDatoInput = screen.getByRole('textbox', { name: 'Dato bruker oppga opplysninger' });
    await user.type(innsendtDatoInput, '01.01.2999');

    await trykkPåNeste();

    expect(
      screen.queryByText('Mottatt dato kan ikke være før dagen etter valgt meldeperiode.')
    ).not.toBeInTheDocument();
  });

  it('validerer ikke mottatt dato mot meldeperiode når ingen uker er valgt', async () => {
    const innsendtDatoInput = screen.getByRole('textbox', { name: 'Dato bruker oppga opplysninger' });
    await user.type(innsendtDatoInput, '01.01.2020');

    await trykkPåNeste();

    expect(
      screen.queryByText('Mottatt dato kan ikke være før dagen etter valgt meldeperiode.')
    ).not.toBeInTheDocument();
  });
});

describe('Meldekort allerede registrert i Kelvin', () => {
  async function velgToPåfølgendeUker() {
    const combobox = screen.getByRole('combobox', { name: 'Hvilke uker gjelder meldekortet for?' });
    await user.click(combobox);
    const option1 = screen.getByRole('option', { name: ukestarterSisteHalvår[0].label });
    await user.click(option1);

    await user.click(combobox);
    const option2 = screen.getByRole('option', { name: ukestarterSisteHalvår[1].label });
    await user.click(option2);
  }

  it('viser ikke valg for Kelvin-registrering når det ikke finnes timer for meldeperioden', async () => {
    vi.mocked(clientHentHarRegistrertTimerIMeldeperioden).mockResolvedValue({
      type: 'SUCCESS' as const,
      data: { harRegistrertTimerForMeldeperioden: false },
    });
    render(<DigitaliserMeldekort submit={() => {}} isLoading={false} readOnly={false} saksnummer={'123456'} />);

    await velgToPåfølgendeUker();

    expect(
      screen.queryByRole('radio', { name: 'Nei, meldekortet er allerede registrert i Kelvin' })
    ).not.toBeInTheDocument();
  });

  it('viser valg for Kelvin-registrering når det allerede finnes timer for meldeperioden', async () => {
    vi.mocked(clientHentHarRegistrertTimerIMeldeperioden).mockResolvedValue({
      type: 'SUCCESS' as const,
      data: { harRegistrertTimerForMeldeperioden: true },
    });
    render(<DigitaliserMeldekort submit={() => {}} isLoading={false} readOnly={false} saksnummer={'123456'} />);

    await velgToPåfølgendeUker();

    expect(await screen.findByRole('radio', { name: 'Ja, registrer arbeidstimer for meldeperioden' })).toBeVisible();
    expect(screen.getByRole('radio', { name: 'Nei, meldekortet er allerede registrert i Kelvin' })).toBeVisible();
  });

  it('velger "Ja" som standard slik at meldeperioder vises', async () => {
    vi.mocked(clientHentHarRegistrertTimerIMeldeperioden).mockResolvedValue({
      type: 'SUCCESS' as const,
      data: { harRegistrertTimerForMeldeperioden: true },
    });
    render(<DigitaliserMeldekort submit={() => {}} isLoading={false} readOnly={false} saksnummer={'123456'} />);

    await velgToPåfølgendeUker();

    expect(await screen.findByRole('radio', { name: 'Ja, registrer arbeidstimer for meldeperioden' })).toBeChecked();
    expect((await screen.findAllByRole('spinbutton', { name: 'Arbeidstimer' })).length).toBeGreaterThan(0);
  });

  it('skjuler meldeperioder når "Nei, meldekortet er allerede registrert i Kelvin" velges', async () => {
    vi.mocked(clientHentHarRegistrertTimerIMeldeperioden).mockResolvedValue({
      type: 'SUCCESS' as const,
      data: { harRegistrertTimerForMeldeperioden: true },
    });
    render(<DigitaliserMeldekort submit={() => {}} isLoading={false} readOnly={false} saksnummer={'123456'} />);

    await velgToPåfølgendeUker();

    expect((await screen.findAllByRole('spinbutton', { name: 'Arbeidstimer' })).length).toBeGreaterThan(0);

    const neiRadio = await screen.findByRole('radio', { name: 'Nei, meldekortet er allerede registrert i Kelvin' });
    await user.click(neiRadio);

    expect(screen.queryByRole('spinbutton', { name: 'Arbeidstimer' })).not.toBeInTheDocument();
  });

  it('viser meldeperioder igjen når "Ja" velges etter "Nei"', async () => {
    vi.mocked(clientHentHarRegistrertTimerIMeldeperioden).mockResolvedValue({
      type: 'SUCCESS' as const,
      data: { harRegistrertTimerForMeldeperioden: true },
    });
    render(<DigitaliserMeldekort submit={() => {}} isLoading={false} readOnly={false} saksnummer={'123456'} />);

    await velgToPåfølgendeUker();

    const neiRadio = await screen.findByRole('radio', { name: 'Nei, meldekortet er allerede registrert i Kelvin' });
    await user.click(neiRadio);
    expect(screen.queryByRole('spinbutton', { name: 'Arbeidstimer' })).not.toBeInTheDocument();

    const jaRadio = screen.getByRole('radio', { name: 'Ja, registrer arbeidstimer for meldeperioden' });
    await user.click(jaRadio);
    expect((await screen.findAllByRole('spinbutton', { name: 'Arbeidstimer' })).length).toBeGreaterThan(0);
  });
});
