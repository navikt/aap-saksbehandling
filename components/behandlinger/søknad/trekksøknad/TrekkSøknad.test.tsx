import { describe, expect, it } from 'vitest';
import { render, screen } from 'lib/test/CustomRender';
import { userEvent } from '@testing-library/user-event';
import { TrekkSøknad } from 'components/behandlinger/søknad/trekksøknad/TrekkSøknad';

const user = userEvent.setup();

describe('Trekk søknad', () => {
  it('har en overskrift', () => {
    render(<TrekkSøknad grunnlag={{ vurderinger: [] }} readOnly={false} behandlingVersjon={1} />);
    expect(screen.getByRole('heading', { name: 'Trekk søknad', level: 3 })).toBeVisible();
  });

  it('har et felt for å begrunne hvorfor søknaden skal trekkes', () => {
    render(<TrekkSøknad grunnlag={{ vurderinger: [] }} readOnly={false} behandlingVersjon={1} />);
    expect(screen.getByRole('textbox', { name: 'Begrunnelse' })).toBeVisible();
  });

  it('viser en feilmelding dersom man forsøker å bekrefte uten å ha skrevet en begrunnelse', async () => {
    render(<TrekkSøknad grunnlag={{ vurderinger: [] }} readOnly={false} behandlingVersjon={1} />);
    await user.click(screen.getByRole('button', { name: 'Bekreft' }));
    expect(await screen.findByText('Du må begrunne hvorfor søknaden skal trekkes')).toBeVisible();
  });
});
