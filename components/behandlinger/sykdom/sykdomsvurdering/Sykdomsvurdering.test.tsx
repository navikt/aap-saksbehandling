import { render, screen, within } from '@testing-library/react';
import { Sykdomsvurdering } from 'components/behandlinger/sykdom/sykdomsvurdering/Sykdomsvurdering';
import userEvent from '@testing-library/user-event';
import { SykdomsGrunnlag } from 'lib/types/types';

describe('sykdomsvurdering uten yrkesskade', () => {
  const user = userEvent.setup();
  const grunnlag: SykdomsGrunnlag = {
    skalVurdereYrkesskade: false,
    opplysninger: { innhentedeYrkesskader: [], oppgittYrkesskadeISøknad: false },
  };

  it('Skal ha korrekt heading', () => {
    render(<Sykdomsvurdering behandlingsReferanse={'123'} grunnlag={grunnlag} />);
    const heading = screen.getByText('Nedsatt arbeidsevne - § 11-5');
    expect(heading).toBeVisible();
  });
  it('skal ha en liste over tilknyttede dokumenter til vilkåret ', () => {
    render(<Sykdomsvurdering behandlingsReferanse={'123'} grunnlag={grunnlag} />);
    const tilknyttedeDokumenterListe = screen.getByRole('list', { name: /tilknyttede dokumenter/i });
    expect(tilknyttedeDokumenterListe).toBeVisible();
  });

  it('Skal ha et begrunnelsefelt', () => {
    render(<Sykdomsvurdering behandlingsReferanse={'123'} grunnlag={grunnlag} />);
    const textbox = screen.getByRole('textbox', { name: /vurder den nedsatte arbeidsevnen/i });
    expect(textbox).toBeVisible();
  });

  it('Skal ha et felt for om arbeidsevnen er nedsatt', () => {
    render(<Sykdomsvurdering behandlingsReferanse={'123'} grunnlag={grunnlag} />);
    const textbox = screen.getByRole('group', { name: /er arbeidsevnen nedsatt\?/i });
    expect(textbox).toBeVisible();
  });

  it('Skal ha et felt for om sykdom, skade eller lyte er årsaken til nedsatt arbeidsevne', async () => {
    render(<Sykdomsvurdering behandlingsReferanse={'123'} grunnlag={grunnlag} />);
    await VelgAtArbeidsevneErNedsatt();
    const radioGroup = screen.getByRole('group', {
      name: /er det sykdom, skade eller lyte som er vesentlig medvirkende til nedsatt arbeidsevne\? \(§ 11-5\)/i,
    });
    expect(radioGroup).toBeVisible();
  });

  it('Skal ha et felt for om arbeidsevnen er nedsatt med minst 50 prosent', async () => {
    render(<Sykdomsvurdering behandlingsReferanse={'123'} grunnlag={grunnlag} />);
    await VelgAtArbeidsevneErNedsatt();
    const radioGroup = screen.getByRole('group', { name: /er arbeidsevnen nedsatt med minst 50%\?/i });
    expect(radioGroup).toBeVisible();
  });

  it('Skal vise feilmelding dersom begrunnelse felt ikke er besvart', async () => {
    render(<Sykdomsvurdering behandlingsReferanse={'123'} grunnlag={grunnlag} />);
    const button = screen.getByRole('button', { name: /bekreft/i });
    await user.click(button);

    expect(await screen.findByText('Du må begrunne')).toBeVisible();
  });

  it('Skal vise feilmelding dersom felt for om sykdom, skade eller lyte er årsaken til nedsatt arbeidsevne ikke er besvart', async () => {
    render(<Sykdomsvurdering behandlingsReferanse={'123'} grunnlag={grunnlag} />);
    await VelgAtArbeidsevneErNedsatt();
    const button = screen.getByRole('button', { name: /bekreft/i });
    await user.click(button);

    expect(await screen.findByText('Du må svare på om vilkåret er oppfyllt')).toBeVisible();
  });

  it('Skal vise feilmelding dersom felt for om arbeidsevnen er nedsatt med minst 50% ikke er besvart', async () => {
    render(<Sykdomsvurdering behandlingsReferanse={'123'} grunnlag={grunnlag} />);
    await VelgAtArbeidsevneErNedsatt();
    const button = screen.getByRole('button', { name: /bekreft/i });
    await user.click(button);

    expect(await screen.findByText('Du må svare på om arbeidsevnen er nedsatt med minst 50%')).toBeVisible();
  });

  it('Skal vise korrekt label på begrunnelsesfelt', async () => {
    render(<Sykdomsvurdering behandlingsReferanse={'123'} grunnlag={grunnlag} />);

    const label = screen.getByText(
      /hvilken sykdom \/ skade \/ lyte\. hva er det mest vesentlige\. hvorfor vurderes nedsatt arbeidsevne med minst 50%\?/i
    );

    expect(label).toBeVisible();
  });

  async function VelgAtArbeidsevneErNedsatt() {
    const group = screen.getByRole('group', { name: /er arbeidsevnen nedsatt\?/i });
    const jaValg = within(group).getByRole('radio', { name: /ja/i });
    await user.click(jaValg);
  }
});
