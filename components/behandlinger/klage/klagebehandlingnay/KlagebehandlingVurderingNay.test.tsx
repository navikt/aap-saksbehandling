import { describe, expect, it } from 'vitest';
import { KlagebehandlingVurderingNay } from './KlagebehandlingVurderingNay';
import { screen, render } from '../../../../lib/test/CustomRender';

describe('Klage - vurdering nay', () => {
  it('Skal ha en overskrift', () => {
    render(
      <KlagebehandlingVurderingNay
        erAktivtSteg={true}
        readOnly={false}
        behandlingVersjon={0}
        typeBehandling={'Klage'}
      />
    );

    const heading = screen.getByText('Behandle klage');
    expect(heading).toBeVisible();
  });

  it('Skal ha felt for vurdering', () => {
    render(
      <KlagebehandlingVurderingNay
        erAktivtSteg={true}
        readOnly={false}
        behandlingVersjon={0}
        typeBehandling={'Klage'}
      />
    );
    const begrunnelse = screen.getByRole('textbox', { name: 'Vurder klage' });
    expect(begrunnelse).toBeVisible();
  });
});
