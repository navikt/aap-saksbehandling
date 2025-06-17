import { describe, expect, it } from 'vitest';
import { render, screen } from '../../../../../lib/test/CustomRender';
import { KlagebehandlingVurderingKontor } from './KlagebehandlingVurderingKontor';

describe('Klage - vurdering kontor', () => {
  it('Skal ha en overskrift', () => {
    render(<KlagebehandlingVurderingKontor readOnly={false} behandlingVersjon={0} typeBehandling={'Klage'} />);

    const heading = screen.getByTestId('vilkår-heading');
    expect(heading).toBeVisible();
    expect(heading).toHaveTextContent('Vurder klage');
  });

  it('Skal ha felt for vurdering', () => {
    render(
      <KlagebehandlingVurderingKontor
        readOnly={false}
        behandlingVersjon={0}
        typeBehandling={'Klage'}
        grunnlag={{
          vurdering: {
            begrunnelse: 'Min begrunnelse',
            notat: 'Test notat',
            innstilling: 'OMGJØR',
            vilkårSomOmgjøres: ['FOLKETRYGDLOVEN_11_5'],
            vilkårSomOpprettholdes: [],
            vurdertAv: 'Ine',
            opprettet: '2023-10-01T12:00:00Z',
          },
        }}
      />
    );
    const begrunnelse = screen.getByRole('textbox', { name: 'Vurder klage' });
    expect(begrunnelse).toBeVisible();
    expect(begrunnelse).toHaveValue('Min begrunnelse');
  });
});
