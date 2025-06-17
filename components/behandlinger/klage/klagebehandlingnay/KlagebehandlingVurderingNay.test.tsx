import { describe, expect, it } from 'vitest';
import { KlagebehandlingVurderingNay } from './KlagebehandlingVurderingNay';
import { render, screen } from '../../../../lib/test/CustomRender';

describe('Klage - vurdering nay', () => {
  it('Skal ha en overskrift', () => {
    render(<KlagebehandlingVurderingNay readOnly={false} behandlingVersjon={0} typeBehandling={'Klage'} />);

    const heading = screen.getByText('Behandle klage');
    expect(heading).toBeVisible();
  });

  it('Skal ha felt for vurdering', () => {
    render(
      <KlagebehandlingVurderingNay
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
        readOnly={false}
        behandlingVersjon={0}
        typeBehandling={'Klage'}
      />
    );
    const begrunnelse = screen.getByRole('textbox', { name: 'Vurder klage' });
    expect(begrunnelse).toBeVisible();
    expect(begrunnelse).toHaveValue('Min begrunnelse');
  });
});
