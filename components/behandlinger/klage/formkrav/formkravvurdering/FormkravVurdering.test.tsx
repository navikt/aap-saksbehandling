import { describe, expect, it } from 'vitest';
import { render, screen } from '../../../../../lib/test/CustomRender';
import { FormkravVurdering } from './FormkravVurdering';

describe('Klage', () => {
  it('Skal ha en overskrift', () => {
    render(<FormkravVurdering erAktivtSteg={true} readOnly={false} behandlingVersjon={0} typeBehandling={'Klage'} />);

    const heading = screen.getByText('Formkrav');
    expect(heading).toBeVisible();
  });

  it('Skal ha felt for begrunnelse', () => {
    render(
      <FormkravVurdering
        erAktivtSteg={true}
        readOnly={false}
        behandlingVersjon={0}
        typeBehandling={'Førstegangsbehandling'}
      />
    );
    const begrunnelse = screen.getByRole('textbox', { name: 'Vurdering' });
    expect(begrunnelse).toBeVisible();
  });
});
