import { render, screen } from '@testing-library/react';
import { Sykdomsvurdering } from 'components/behandlinger/sykdom/sykdomsvurdering/Sykdomsvurdering';
import userEvent from '@testing-library/user-event';

describe('sykdomsvurdering uten yrkesskade', () => {
  const user = userEvent.setup();
  const grunnlag = {
    opplysninger: { innhentedeYrkesskader: [], oppgittYrkesskadeISøknad: false },
    erÅrsakssammenheng: true,
  };

  it('Skal ha korrekt heading', () => {
    render(<Sykdomsvurdering behandlingsReferanse={'123'} grunnlag={grunnlag} />);
    const heading = screen.getByText('Nedsatt arbeidsevne - § 11-5');
    expect(heading).toBeVisible();
  });

  it('Skal ha et felt for om dokumentasjon mangler', () => {
    render(<Sykdomsvurdering behandlingsReferanse={'123'} grunnlag={grunnlag} />);
    const checkboxGroup = screen.getByRole('group', { name: /dokumentasjon mangler/i });
    expect(checkboxGroup).toBeVisible();
  });

  it('Skal ha et begrunnelsefelt', () => {
    render(<Sykdomsvurdering behandlingsReferanse={'123'} grunnlag={grunnlag} />);
    const textbox = screen.getByRole('textbox', { name: /vurder den nedsatte arbeidsevnen/i });
    expect(textbox).toBeVisible();
  });

  it('Skal ha et felt for om sykdom, skade eller lyte er årsaken til nedsatt arbeidsevne', () => {
    render(<Sykdomsvurdering behandlingsReferanse={'123'} grunnlag={grunnlag} />);
    const radioGroup = screen.getByRole('group', {
      name: /er det sykdom, skade eller lyte som er vesentlig medvirkende til nedsatt arbeidsevne\? \(§ 11-5\)/i,
    });
    expect(radioGroup).toBeVisible();
  });

  it('Skal ha et felt for om arbeidsevnen er nedsatt med minst 50 prosent', () => {
    render(<Sykdomsvurdering behandlingsReferanse={'123'} grunnlag={grunnlag} />);
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
    const button = screen.getByRole('button', { name: /bekreft/i });
    await user.click(button);

    expect(await screen.findByText('Du må svare på om vilkåret er oppfyllt')).toBeVisible();
  });

  it('Skal vise feilmelding dersom felt for om arbeidsevnen er nedsatt med minst 50% ikke er besvart', async () => {
    render(<Sykdomsvurdering behandlingsReferanse={'123'} grunnlag={grunnlag} />);
    const button = screen.getByRole('button', { name: /bekreft/i });
    await user.click(button);

    expect(await screen.findByText('Du må svare på om arbeidsevnen er nedsatt med minst 50%')).toBeVisible();
  });

  it('Skal vise korrekt label på begrunnelsesfelt', async () => {
    render(
      <Sykdomsvurdering
        behandlingsReferanse={'123'}
        grunnlag={{
          opplysninger: { innhentedeYrkesskader: [], oppgittYrkesskadeISøknad: false },
          erÅrsakssammenheng: true,
        }}
      />
    );

    const label = screen.getByText(
      /hvilken sykdom \/ skade \/ lyte\. hva er det mest vesentlige\. hvorfor vurderes nedsatt arbeidsevne med minst 50%\?/i
    );

    expect(label).toBeVisible();
  });
});
