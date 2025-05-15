import { describe, expect, it } from 'vitest';
import { render, screen } from '../../../../../lib/test/CustomRender';
import { KlagebehandlingVurderingKontor } from './KlagebehandlingVurderingKontor';

describe('Klage - vurdering kontor', () => {
  it('Skal ha en overskrift', () => {
    render(
      <KlagebehandlingVurderingKontor
        erAktivtSteg={true}
        readOnly={false}
        behandlingVersjon={0}
        typeBehandling={'Klage'}
      />
    );

    const heading = screen.getByText('Behandle klage - Nav-kontor');
    expect(heading).toBeVisible();
  });

  it('Skal ha felt for vurdering', () => {
    render(
      <KlagebehandlingVurderingKontor
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
