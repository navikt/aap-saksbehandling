import { render, screen, within } from '@testing-library/react';
import { Yrkesskade } from './Yrkesskade';
import userEvent from '@testing-library/user-event';
import { YrkesskadeGrunnlag } from 'lib/types/types';

const grunnlag: YrkesskadeGrunnlag = {
  opplysninger: { innhentedeYrkesskader: [], oppgittYrkesskadeISøknad: false },
};
beforeEach(() => {
  render(<Yrkesskade behandlingsReferanse={'123'} grunnlag={grunnlag} />);
});

describe('yrkesskade', () => {
  const user = userEvent.setup();
  it('Skal ha riktig heading', () => {
    const heading = screen.getByText('Yrkesskade - § 11-22');
    expect(heading).toBeVisible();
  });

  it('Skal ha et begrunnelsesfelt', async () => {
    const textbox = screen.getByRole('textbox', {
      name: /vurder om yrkesskaden er medvirkende årsak til den nedsatte arbeidsevnen/i,
    });

    expect(textbox).toBeVisible();
  });

  it('Skal ha radio group for årsakssammenheng ', async () => {
    const radiogroup = screen.getByRole('group', {
      name: /er vilkåret \(årssakssammenheng\) i § 11-22 oppfylt\?/i,
    });

    expect(radiogroup).toBeVisible();
  });

  it('Skal vise dato felt for skadetidspunkt dersom vilkåret i § 11-22 er oppfylt', async () => {
    const group = screen.getByRole('group', { name: /er vilkåret \(årssakssammenheng\) i § 11-22 oppfylt\?/i });
    const jaValg = within(group).getByRole('radio', { name: /ja/i });

    expect(
      await screen.queryByRole('textbox', { name: /dato for skadetidspunkt for yrkesskaden/i })
    ).not.toBeInTheDocument();

    await user.click(jaValg);

    expect(await screen.findByRole('textbox', { name: /dato for skadetidspunkt for yrkesskaden/i })).toBeVisible();
  });

  it('Skal ikke vise dato felt for skadetidspunkt dersom vilkåret i § 11-22 ikke er oppfylt', async () => {
    const group = screen.getByRole('group', { name: /er vilkåret \(årssakssammenheng\) i § 11-22 oppfylt\?/i });
    const neiValg = within(group).getByRole('radio', { name: /nei/i });

    await user.click(neiValg);

    expect(
      await screen.queryByRole('textbox', { name: /dato for skadetidspunkt for yrkesskaden/i })
    ).not.toBeInTheDocument();
  });

  it('Skal vise feilmelding dersom begrunnelse felt ikke har blitt besvart', async () => {
    const button = screen.getByRole('button', { name: /bekreft/i });
    await user.click(button);

    expect(await screen.findByText('Du må begrunne')).toBeVisible();
  });

  it('Skal vise feilmelding dersom årsakssammenheng felt ikke har blitt besvart', async () => {
    const button = screen.getByRole('button', { name: /bekreft/i });
    await user.click(button);

    expect(await screen.findByText('Du må svare på om vilkåret er oppfyllt')).toBeVisible();
  });

  it('Skal vise feilmelding dersom vilkåret i § 11-22 er oppfylt og dato for skadetidspunkt ikke har blitt besvart', async () => {
    const group = screen.getByRole('group', { name: /er vilkåret \(årssakssammenheng\) i § 11-22 oppfylt\?/i });
    const jaValg = within(group).getByRole('radio', { name: /ja/i });

    await user.click(jaValg);

    const button = screen.getByRole('button', { name: /bekreft/i });
    await user.click(button);

    expect(await screen.findByText('Du må sette en dato for skadetidspunktet')).toBeVisible();
  });
});
