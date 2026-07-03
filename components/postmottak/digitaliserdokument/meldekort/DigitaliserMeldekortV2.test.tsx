import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  DigitaliserMeldekortV2,
  ukestartSisteHalvår,
} from 'components/postmottak/digitaliserdokument/meldekort/DigitaliserMeldekortV2';
import userEvent from '@testing-library/user-event';

const user = userEvent.setup();

const ukestarterSisteHalvår = ukestartSisteHalvår();

describe('Digitaliser meldekort v2', () => {
  beforeEach(() => {
    render(<DigitaliserMeldekortV2 submit={() => {}} isLoading={false} readOnly={false} />);
  });

  it('innsendtdato vises', () => {
    expect(screen.getByRole('textbox', { name: /Dato for innsendt meldekort/i })).toBeVisible();
  });

  it('har et input-felt for å velge hvilke uker meldekortet gjelder for', () => {
    expect(screen.getByRole('combobox', { name: /Hvilke uker gjelder meldekortet for?/ })).toBeVisible();
  });

  it('felt for ukenummer er påkrevd', async () => {
    await trykkPåNeste();
    expect(await screen.findByText('Du må velge hvilke uker meldekortet gjelder for')).toBeVisible();
  });

  it('felt for når meldekortet ble mottatt er påkrevd', async () => {
    await trykkPåNeste();
    expect(await screen.findByText('Du må registrere når meldekortet ble innsendt')).toBeVisible();
  });

  it('må ha minst to perioder for å få sendt inn et digitalisert meldekort', async () => {
    const combobox = screen.getByRole('combobox', { name: 'Hvilke uker gjelder meldekortet for?' });
    await user.click(combobox);

    const option = screen.getByRole('option', { name: ukestarterSisteHalvår[0].label });
    await user.click(option);

    await user.type(screen.getByRole('textbox', { name: 'Dato for innsendt meldekort' }), '12.01.2025');
    await trykkPåNeste();
    expect(await screen.findByText('En meldeperiode består av to uker')).toBeVisible();
  });

  it('antall perioder må være et partall', async () => {
    const combobox = screen.getByRole('combobox', { name: 'Hvilke uker gjelder meldekortet for?' });
    await user.click(combobox);

    const option1 = screen.getByRole('option', { name: ukestarterSisteHalvår[0].label });
    await user.click(option1);
    const option2 = screen.getByRole('option', { name: ukestarterSisteHalvår[1].label });
    await user.click(option2);
    const option3 = screen.getByRole('option', { name: ukestarterSisteHalvår[2].label });
    await user.click(option3);

    await user.type(screen.getByRole('textbox', { name: 'Dato for innsendt meldekort' }), '12.01.2025');
    await trykkPåNeste();
    expect(await screen.findByText('Ugyldig antall meldeperioder')).toBeVisible();
  });

  it('må velge påfølgende uke', async () => {
    const combobox = screen.getByRole('combobox', { name: 'Hvilke uker gjelder meldekortet for?' });
    await user.click(combobox);

    const option1 = screen.getByRole('option', { name: ukestarterSisteHalvår[0].label });
    await user.click(option1);
    const option3 = screen.getByRole('option', { name: ukestarterSisteHalvår[2].label });
    await user.click(option3);

    await user.type(screen.getByRole('textbox', { name: 'Dato for innsendt meldekort' }), '12.01.2025');
    await trykkPåNeste();
    expect(await screen.findByText('Det er ikke valgt korrekte meldeperioder')).toBeVisible();
  });
});

async function trykkPåNeste() {
  await user.click(screen.getByRole('button', { name: 'Neste' }));
}
