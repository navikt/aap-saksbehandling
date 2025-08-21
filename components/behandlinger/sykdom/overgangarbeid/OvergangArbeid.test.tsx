import { describe, expect, it } from 'vitest';
import { render, screen } from 'lib/test/CustomRender';
import { OvergangArbeid } from 'components/behandlinger/sykdom/overgangarbeid/OvergangArbeid';

describe('Førstegangsbehandling', () => {
  it('Skal ha en overskrift', () => {
    render(<OvergangArbeid readOnly={false} behandlingVersjon={0} typeBehandling={'Førstegangsbehandling'} />);

    const heading = screen.getByText('§ 11-17 AAP i perioden som arbeidssøker');
    expect(heading).toBeVisible();
  });

  it('Skal ha felt for begrunnelse', () => {
    render(<OvergangArbeid readOnly={false} behandlingVersjon={0} typeBehandling={'Førstegangsbehandling'} />);
    const begrunnelse = screen.getByRole('textbox', { name: 'Vilkårsvurdering' });
    expect(begrunnelse).toBeVisible();
  });

  it('Skal ha felt for om brukeren har rett på AAP', () => {
    render(<OvergangArbeid readOnly={false} behandlingVersjon={0} typeBehandling={'Førstegangsbehandling'} />);
    const felt = screen.getByRole('group', {
      name: 'Har brukeren rett på AAP i perioden som arbeidssøker etter § 11-17?',
    });
    expect(felt).toBeVisible();
  });

  it('Skal ha felt for virkningsdato', () => {
    render(<OvergangArbeid readOnly={false} behandlingVersjon={0} typeBehandling={'Førstegangsbehandling'} />);
    const felt = screen.queryByRole('textbox', {
      name: 'Virkningsdato for vurderingen',
    });
    expect(felt).toBeVisible();
  });
});
