import { describe, expect, it } from 'vitest';
import { KlagebehandlingVurderingNay } from './KlagebehandlingVurderingNay';
import { render, screen } from '../../../../lib/test/CustomRender';
import { userEvent } from '@testing-library/user-event';

const user = userEvent.setup();

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
            vurdertAv: {
              ident: 'ident',
              dato: '2025-01-01',
              ansattnavn: 'Ine',
              enhetsnavn: 'Kontor',
            },
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

  it('Skal vise valideringsfeil når man velger en ikke-implementert hjemmel', async () => {
    render(<KlagebehandlingVurderingNay readOnly={false} behandlingVersjon={0} typeBehandling={'Klage'} />);

    // Fyll ut obligatoriske felt og velg hjemme 11-3 i dropdown, denne er ikke implementert enda
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
    render(<KlagebehandlingVurderingNay readOnly={false} behandlingVersjon={0} typeBehandling={'Klage'} />);

    // Fyll ut obligatoriske felt og velg en hjemme som er implementert i dropdownen (11-5)
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
