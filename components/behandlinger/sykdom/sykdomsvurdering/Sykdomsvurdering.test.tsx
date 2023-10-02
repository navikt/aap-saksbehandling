import { render, screen } from 'lib/test/setUpTests';
import { Sykdomsvurdering } from 'components/behandlinger/sykdom/sykdomsvurdering/Sykdomsvurdering';
import userEvent from '@testing-library/user-event';

beforeEach(() => {
  render(<Sykdomsvurdering behandlingsReferanse={'123'} />);
});

describe('sykdomsvurdering', () => {
  const user = userEvent.setup();

  it('Skal ha en heading', () => {
    const heading = screen.getByText('Nedsatt arbeidsevne - § 11-5');
    expect(heading).toBeVisible();
  });

  it('Skal ha et felt for om dokumentasjon mangler', () => {
    const checkboxGroup = screen.getByRole('group', { name: /dokumentasjon mangler/i });
    expect(checkboxGroup).toBeVisible();
  });

  it('Skal ha et begrunnelsefelt', () => {
    const textbox = screen.getByRole('textbox', { name: /vurder den nedsatte arbeidsevnen/i });
    expect(textbox).toBeVisible();
  });

  it('Skal ha et felt for om sykdom, skade eller lyte er årsaken til nedsatt arbeidsevne', () => {
    const radioGroup = screen.getByRole('textbox', { name: /vurder den nedsatte arbeidsevnen/i });
    expect(radioGroup).toBeVisible();
  });

  it('Skal ha et felt for om arbeidsevnen er nedsatt med minst 50 prosent', () => {
    const radioGroup = screen.getByRole('group', { name: /er arbeidsevnen nedsatt med minst 50%\?/i });
    expect(radioGroup).toBeVisible();
  });

  it('Skal vise feilmelding dersom begrunnelse felt ikke er besvart', async () => {
    const button = screen.getByRole('button', { name: /bekreft/i });
    await user.click(button);

    expect(await screen.findByText('Du må begrunne')).toBeVisible();
  });

  it('Skal vise feilmelding dersom felt for om sykdom, skade eller lyte er årsaken til nedsatt arbeidsevne ikke er besvart', async () => {
    const button = screen.getByRole('button', { name: /bekreft/i });
    await user.click(button);

    expect(await screen.findByText('Du må svare på om vilkåret er oppfyllt')).toBeVisible();
  });
});
