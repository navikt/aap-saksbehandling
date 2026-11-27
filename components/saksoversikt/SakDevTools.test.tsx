import { render, screen } from 'lib/test/CustomRender';
import userEvent from '@testing-library/user-event';
import { within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { SakDevTools } from 'components/saksoversikt/SakDevTools';

const user = userEvent.setup();

describe('SakDevTools', () => {
  it('viser meldekort- og journalpostfanene, med meldekort valgt som standard', async () => {
    render(<SakDevTools saksnummer="12345" ident="12345678910" behandlinger={[]} />);

    expect(screen.getByRole('tab', { name: 'Send et meldekort for inneværende mnd' })).toHaveAttribute(
      'aria-selected',
      'true'
    );
    expect(screen.getByRole('tab', { name: 'Simuler journalpost-hendelse' })).toHaveAttribute('aria-selected', 'false');

    await user.click(
      within(screen.getByRole('region', { name: 'Meldekort' })).getByRole('button', { name: 'Vis mer' })
    );
    await user.click(
      within(screen.getByRole('region', { name: 'Enkel søknad' })).getByRole('button', { name: 'Vis mer' })
    );

    expect(screen.getByRole('button', { name: 'Send inn meldekortet' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Resend en enkel søknad' })).toBeInTheDocument();
  });

  it('viser kun Simuler journalpost-hendelse-skjemaet når den fanen er valgt', async () => {
    render(<SakDevTools saksnummer="12345" ident="12345678910" behandlinger={[]} />);

    await user.click(
      within(screen.getByRole('region', { name: 'Meldekort' })).getByRole('button', { name: 'Vis mer' })
    );
    await user.click(
      within(screen.getByRole('region', { name: 'Enkel søknad' })).getByRole('button', { name: 'Vis mer' })
    );

    await user.click(screen.getByRole('tab', { name: 'Simuler journalpost-hendelse' }));

    const fnrFelt = screen.getByRole('textbox', {
      name: /Fødselsnummer/,
    });
    expect(fnrFelt).toHaveValue('12345678910');

    expect(screen.queryByRole('button', { name: 'Send inn meldekortet' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Resend en enkel søknad' })).not.toBeInTheDocument();
  });
});
