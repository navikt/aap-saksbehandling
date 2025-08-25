import { describe, expect, it } from 'vitest';
import { render, screen } from '../../../../../lib/test/CustomRender';
import { Vurder11_7 } from './Vurder11_7';
import { userEvent } from '@testing-library/user-event';

const user = userEvent.setup();

describe('Vurder 11-7', () => {
  it('Skal ha en overskrift', () => {
    render(<Vurder11_7 readOnly={false} behandlingVersjon={0} />);

    const heading = screen.getByText('§ 11-7 Medlemmets aktivitetsplikt');
    expect(heading).toBeVisible();
  });

  it('Skal ha valg for stans eller opphør dersom plikten ikke er oppfylt', async () => {
    render(<Vurder11_7 readOnly={false} behandlingVersjon={0} />);

    expect(screen.queryByText(/stanses eller opphøres/)).not.toBeInTheDocument();

    const erOppfyltOption = screen.getByRole('radio', { name: 'Nei' });
    await user.click(erOppfyltOption);

    expect(screen.queryByText(/stanses eller opphøres/)).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Stans' })).toBeVisible();
    expect(screen.getByRole('radio', { name: 'Opphør' })).toBeVisible();
  });
});
