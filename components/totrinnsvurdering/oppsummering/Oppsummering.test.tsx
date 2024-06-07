import { render, screen } from '@testing-library/react';
import { Oppsummering } from 'components/totrinnsvurdering/oppsummering/Oppsummering';
import { ToTrinnsVurdering } from 'lib/types/types';
import { Behovstype } from 'lib/utils/form';

const vurderingIkkeGodkjent: ToTrinnsVurdering = {
  definisjon: Behovstype.AVKLAR_SYKDOM_KODE,
  begrunnelse: 'Dette er min begrunnelse for at jeg avslo vurderinger av sykdom',
  godkjent: false,
};

const vurderingGodkjent: ToTrinnsVurdering = {
  definisjon: Behovstype.AVKLAR_SYKDOM_KODE,
  godkjent: true,
};

describe('Oppsummering', () => {
  it('skal ha en overskrift', () => {
    render(<Oppsummering vurderinger={[vurderingIkkeGodkjent]} link={''} />);
    const overskrift = screen.getByText('Siste vurderinger fra beslutter');
    expect(overskrift).toBeVisible();
  });

  it('skal vise korrekt vilkår basert på definisjonskode', () => {
    render(<Oppsummering vurderinger={[vurderingIkkeGodkjent]} link={''} />);

    const label = screen.getByText('Vilkår');
    expect(label).toBeVisible();
    const link = screen.getByRole('link', {
      name: 'Avklar sykdom (§ 11-5)',
    });

    expect(link).toBeVisible();
  });

  it('skal vise korrekt verdi på om vilkåret er vurdert ikke godkjent', () => {
    render(<Oppsummering vurderinger={[vurderingIkkeGodkjent]} link={''} />);

    const label = screen.getByText('Godkjent?');
    expect(label).toBeVisible();

    const verdi = screen.getByText('Nei');
    expect(verdi).toBeVisible();
  });

  it('skal vise korrekt verdi på om vilkåret er vurdert godkjent', () => {
    render(<Oppsummering vurderinger={[vurderingGodkjent]} link={''} />);

    const label = screen.getByText('Godkjent?');
    expect(label).toBeVisible();

    const verdi = screen.getByText('Ja');
    expect(verdi).toBeVisible();
  });

  it('skal vise begrunnelse', () => {
    render(<Oppsummering vurderinger={[vurderingIkkeGodkjent]} link={''} />);

    const label = screen.getByText('Begrunnelse');
    expect(label).toBeVisible();

    const begrunnelseVerdi = screen.getByText('Dette er min begrunnelse for at jeg avslo vurderinger av sykdom');
    expect(begrunnelseVerdi).toBeVisible();
  });
});
