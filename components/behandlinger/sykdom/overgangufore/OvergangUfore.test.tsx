import { describe, expect, it } from 'vitest';
import { render, screen } from 'lib/test/CustomRender';
import { OvergangUfore } from 'components/behandlinger/sykdom/overgangufore/OvergangUfore';
import { within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const user = userEvent.setup();

describe('Førstegangsbehandling', () => {
  it('Skal ha en overskrift', () => {
    render(<OvergangUfore readOnly={false} behandlingVersjon={0} typeBehandling={'Førstegangsbehandling'} />);

    const heading = screen.getByText('§ 11-18 AAP under behandling av krav om uføretrygd');
    expect(heading).toBeVisible();
  });

  it('Skal ha felt for begrunnelse', () => {
    render(<OvergangUfore readOnly={false} behandlingVersjon={0} typeBehandling={'Førstegangsbehandling'} />);
    const begrunnelse = screen.getByRole('textbox', { name: 'Vilkårsvurdering' });
    expect(begrunnelse).toBeVisible();
  });

  it('Skal ha felt for om brukeren har søkt om uføretrygd', () => {
    render(<OvergangUfore readOnly={false} behandlingVersjon={0} typeBehandling={'Førstegangsbehandling'} />);
    const felt = screen.getByRole('group', {
      name: 'Har brukeren søkt om uføretrygd?',
    });
    expect(felt).toBeVisible();
  });

  it('Viser felt om brukeren har fått vedtak om uføretrygd, dersom brukeren ikke har søkt', async () => {
    render(<OvergangUfore readOnly={false} behandlingVersjon={0} typeBehandling={'Førstegangsbehandling'} />);

    expect(finnGruppeForSoktOmUforetrygd()).toBeVisible();

    await velgJa(finnGruppeForSoktOmUforetrygd());
    expect(finnGruppeForVedtakOmUforetrygd()).toBeVisible();
  });

  it('Har brukeren rett på AAP under behandling av krav om uføretrygd etter § 11-18?', async () => {
    render(<OvergangUfore readOnly={false} behandlingVersjon={0} typeBehandling={'Førstegangsbehandling'} />);

    expect(finnGruppeForRettPåAAP()).toBeVisible();
  });

  const finnGruppeForSoktOmUforetrygd = () => screen.getByRole('group', { name: 'Har brukeren søkt om uføretrygd?' });
  const finnGruppeForVedtakOmUforetrygd = () =>
    screen.getByRole('group', { name: 'Har brukeren fått vedtak på søknaden om uføretrygd?' });
  const finnGruppeForRettPåAAP = () =>
    screen.getByRole('group', {
      name: 'Har brukeren rett på AAP under behandling av krav om uføretrygd etter § 11-18?',
    });

  const velgJa = async (group: HTMLElement) => {
    await user.click(within(group).getByRole('radio', { name: 'Ja' }));
  };
});
