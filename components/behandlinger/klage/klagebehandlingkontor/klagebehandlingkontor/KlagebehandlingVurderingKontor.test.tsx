import { describe, expect, it } from 'vitest';
import { render, screen } from '../../../../../lib/test/CustomRender';
import { KlagebehandlingVurderingKontor } from './KlagebehandlingVurderingKontor';
import { userEvent } from '@testing-library/user-event';

const user = userEvent.setup();

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
            vurdertAv: {
              ident: 'ident',
              dato: '2025-01-01',
              ansattnavn: 'Ine',
              enhetsnavn: 'kontor',
            },
          },
        }}
      />
    );
    const begrunnelse = screen.getByRole('textbox', { name: 'Vurder klage' });
    expect(begrunnelse).toBeVisible();
    expect(begrunnelse).toHaveValue('Min begrunnelse');
  });

  it('Skal vise valideringsfeil når man velger en ikke-implementert hjemmel', async () => {
    render(<KlagebehandlingVurderingKontor readOnly={false} behandlingVersjon={0} typeBehandling={'Klage'} />);

    // Fyll ut obligatoriske felt og velg 11-3 (som ike er implementert) i dropdown
    const begrunnelse = screen.getByRole('textbox', { name: 'Vurder klage' });
    await user.type(begrunnelse, 'Test begrunnelse');

    const omgjørRadio = screen.getByRole('radio', { name: 'Vedtak omgjøres' });
    await user.click(omgjørRadio);

    const combobox = screen.getByRole('combobox', { name: 'Hvilke vilkår skal omgjøres?' });
    await user.click(combobox);

    const option = screen.getByRole('option', { name: '§ 11-3' });
    await user.click(option);

    const bekreftKnapp = screen.getByRole('button', { name: 'Bekreft' });
    await user.click(bekreftKnapp);

    expect(screen.getByText(/Det er ikke mulig å opprette revurdering på/)).toBeVisible();
    expect(combobox).toHaveAttribute('aria-invalid');
  });

  it('Skal ikke vise valideringsfeil når man velger en implementert hjemmel', async () => {
    render(<KlagebehandlingVurderingKontor readOnly={false} behandlingVersjon={0} typeBehandling={'Klage'} />);

    // Fyll ut obligatoriske felt og velg 11-5 i dropdown (som er implementert)
    const begrunnelse = screen.getByRole('textbox', { name: 'Vurder klage' });
    await user.type(begrunnelse, 'Test begrunnelse');

    const omgjørRadio = screen.getByRole('radio', { name: 'Vedtak omgjøres' });
    await user.click(omgjørRadio);

    const combobox = screen.getByRole('combobox', { name: 'Hvilke vilkår skal omgjøres?' });
    await user.click(combobox);

    const option = screen.getByRole('option', { name: '§ 11-5' });
    await user.click(option);

    const bekreftKnapp = screen.getByRole('button', { name: 'Bekreft' });
    await user.click(bekreftKnapp);

    expect(screen.queryByText(/Det er ikke mulig å opprette revurdering på/)).not.toBeInTheDocument();
    expect(combobox).not.toHaveAttribute('aria-invalid');
  });
});
