import { describe, expect, it } from 'vitest';
import { render, screen } from '../../../../../lib/test/CustomRender';
import { FullmektigVurdering } from './FullmektigVurdering';

describe('Klage', () => {
  it('Skal ha en overskrift', () => {
    render(<FullmektigVurdering readOnly={false} behandlingVersjon={0} typeBehandling={'Klage'} />);

    const heading = screen.getByText('Fullmektig/verge');
    expect(heading).toBeVisible();
  });

  it('Skal ha felt for å velge hvorvidt det finnes verge/fullmektig', () => {
    render(<FullmektigVurdering readOnly={false} behandlingVersjon={0} typeBehandling={'Klage'} />);
    const fullmektig = screen.getByRole('group', { name: 'Finnes det fullmektig eller verge i klagesaken?' });
    expect(fullmektig).toBeVisible();
  });
});
