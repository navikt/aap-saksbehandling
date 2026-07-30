import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  DigitaliserMeldekort,
  ukestartSisteHalvår,
} from 'components/postmottak/digitaliserdokument/meldekort/DigitaliserMeldekort';

vi.mock('lib/clientApi', () => ({
  clientHentHarRegistrertTimerIMeldeperioden: vi.fn().mockResolvedValue({
    data: { harRegistrertTimerForMeldeperioden: false },
  }),
}));

const user = userEvent.setup();

const ukestarterSisteHalvår = ukestartSisteHalvår();

describe('Validering av mottatt dato på digitalisert meldekort', () => {
  beforeEach(() => {
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
