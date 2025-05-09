import { describe, expect, it } from 'vitest';
import { render, screen } from '../../../../../lib/test/CustomRender';
import { PåklagetBehandling } from './PåklagetBehandling';

describe('Klage', () => {
  it('Skal ha en overskrift', () => {
    render(<PåklagetBehandling erAktivtSteg={true} readOnly={false} behandlingVersjon={0} typeBehandling={'Klage'} />);

    const heading = screen.getByText('Påklaget behandling');
    expect(heading).toBeVisible();
  });
});
