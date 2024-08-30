import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { Sykdomsvurdering } from 'components/behandlinger/sykdom/sykdomsvurdering/Sykdomsvurdering';
import { userEvent } from '@testing-library/user-event';
import { SykdomsGrunnlag } from 'lib/types/types';

describe('sykdomsvurdering uten yrkesskade', () => {
  const user = userEvent.setup();
  const grunnlag: SykdomsGrunnlag = {
    skalVurdereYrkesskade: false,
    opplysninger: { innhentedeYrkesskader: [], oppgittYrkesskadeISøknad: false },
  };

  it('Skal ha korrekt heading', () => {
    render(<Sykdomsvurdering grunnlag={grunnlag} readOnly={false} behandlingVersjon={0} tilknyttedeDokumenter={[]} />);
    const heading = screen.getByRole('heading', { name: 'Nedsatt arbeidsevne - § 11-5' });
    expect(heading).toBeVisible();
  });

  it('skal ha en liste over tilknyttede dokumenter til vilkåret ', () => {
    render(<Sykdomsvurdering grunnlag={grunnlag} readOnly={false} behandlingVersjon={0} tilknyttedeDokumenter={[]} />);
    const tilknyttedeDokumenterListe = screen.getByRole('list', { name: 'Tilknyttede dokumenter' });
    expect(tilknyttedeDokumenterListe).toBeVisible();
  });

  it('Skal ha et begrunnelsefelt', () => {
    render(<Sykdomsvurdering grunnlag={grunnlag} readOnly={false} behandlingVersjon={0} tilknyttedeDokumenter={[]} />);
    const textbox = screen.getByRole('textbox', { name: /Vurder den nedsatte arbeidsevnen/ });
    expect(textbox).toBeVisible();
  });

  it('Skal vise korrekt description på begrunnelsesfelt', async () => {
    render(<Sykdomsvurdering grunnlag={grunnlag} readOnly={false} behandlingVersjon={0} tilknyttedeDokumenter={[]} />);

    const label = screen.getByText(
      'Hvilken sykdom / skade / lyte. Hva er det mest vesentlige. Hvorfor vurderes nedsatt arbeidsevne med minst 50%?'
    );

    expect(label).toBeVisible();
  });

  it('Skal ha et felt for om arbeidsevnen er nedsatt', () => {
    render(<Sykdomsvurdering grunnlag={grunnlag} readOnly={false} behandlingVersjon={0} tilknyttedeDokumenter={[]} />);
    const textbox = screen.getByRole('group', { name: 'Er arbeidsevnen nedsatt?' });
    expect(textbox).toBeVisible();
  });

  it('Skal ha et felt for om sykdom, skade eller lyte er årsaken til nedsatt arbeidsevne', async () => {
    render(<Sykdomsvurdering grunnlag={grunnlag} readOnly={false} behandlingVersjon={0} tilknyttedeDokumenter={[]} />);
    await VelgAtArbeidsevneErNedsatt();
    const radioGroup = screen.getByRole('group', {
      name: 'Er det sykdom, skade eller lyte som er vesentlig medvirkende til nedsatt arbeidsevne? (§ 11-5)',
    });
    expect(radioGroup).toBeVisible();
  });

  it('Skal ha et felt for om arbeidsevnen er nedsatt med minst 50 prosent', async () => {
    render(<Sykdomsvurdering grunnlag={grunnlag} readOnly={false} behandlingVersjon={0} tilknyttedeDokumenter={[]} />);
    await VelgAtArbeidsevneErNedsatt();
    const radioGroup = screen.getByRole('group', { name: 'Er arbeidsevnen nedsatt med minst 50%?' });
    expect(radioGroup).toBeVisible();
  });

  it('Skal ha et felt for når arbeidsevnen ble nedsatt', async () => {
    render(<Sykdomsvurdering grunnlag={grunnlag} readOnly={false} behandlingVersjon={0} tilknyttedeDokumenter={[]} />);
    await VelgAtArbeidsevneErNedsatt();
    const felt = screen.getByRole('textbox', { name: 'Hvilket år ble arbeidsevnen nedsatt? (§11-5)' });
    expect(felt).toBeVisible();
  });

  it('Skal ikke vise felt for når arbeidsevnen ble nedsatt dersom arbeidsevnen ikke er nedsatt', () => {
    render(<Sykdomsvurdering grunnlag={grunnlag} readOnly={false} behandlingVersjon={0} tilknyttedeDokumenter={[]} />);
    const felt = screen.queryByRole('textbox', { name: 'Hvilket år ble arbeidsevnen nedsatt? (§11-5)' });
    expect(felt).toBeNull();
  });

  it('Skal ikke vise felt for om sykdom, skade eller lyte er årsaken til nedsatt arbeidsevne dersom arbeidsevnen ikke er nedsatt', () => {
    render(<Sykdomsvurdering grunnlag={grunnlag} readOnly={false} behandlingVersjon={0} tilknyttedeDokumenter={[]} />);
    const radioGroup = screen.queryByRole('group', {
      name: 'Er det sykdom, skade eller lyte som er vesentlig medvirkende til nedsatt arbeidsevne? (§ 11-5)',
    });
    expect(radioGroup).toBeNull();
  });

  it('Skal ikke vise felt for om arbeidsevnen er nedsatt med minst 50 prosent dersom arbeidsevnen ikke er nedsatt', () => {
    render(<Sykdomsvurdering grunnlag={grunnlag} readOnly={false} behandlingVersjon={0} tilknyttedeDokumenter={[]} />);
    const radioGroup = screen.queryByRole('group', { name: 'Er arbeidsevnen nedsatt med minst 50%?' });
    expect(radioGroup).toBeNull();
  });

  it('Skal vise feilmelding dersom begrunnelse felt ikke er besvart', async () => {
    render(<Sykdomsvurdering grunnlag={grunnlag} readOnly={false} behandlingVersjon={0} tilknyttedeDokumenter={[]} />);
    const button = screen.getByRole('button', { name: /Bekreft/ });
    await user.click(button);

    expect(await screen.findByText('Du må begrunne')).toBeVisible();
  });

  it('Skal vise feilmelding dersom felt om arbeidsevnen er nedsatt ikke har blitt besvart', async () => {
    render(<Sykdomsvurdering grunnlag={grunnlag} readOnly={false} behandlingVersjon={0} tilknyttedeDokumenter={[]} />);
    const button = screen.getByRole('button', { name: /Bekreft/ });
    await user.click(button);

    expect(await screen.findByText('Du må svare på om arbeidsevnen er nedsatt')).toBeVisible();
  });

  it('Skal vise feilmelding dersom felt for om sykdom, skade eller lyte er årsaken til nedsatt arbeidsevne ikke er besvart', async () => {
    render(<Sykdomsvurdering grunnlag={grunnlag} readOnly={false} behandlingVersjon={0} tilknyttedeDokumenter={[]} />);
    await VelgAtArbeidsevneErNedsatt();
    const button = screen.getByRole('button', { name: /Bekreft/ });
    await user.click(button);

    expect(await screen.findByText('Du må svare på om vilkåret er oppfyllt')).toBeVisible();
  });

  it('Skal vise feilmelding dersom felt for om arbeidsevnen er nedsatt med minst 50% ikke er besvart', async () => {
    render(<Sykdomsvurdering grunnlag={grunnlag} readOnly={false} behandlingVersjon={0} tilknyttedeDokumenter={[]} />);
    await VelgAtArbeidsevneErNedsatt();
    const button = screen.getByRole('button', { name: /Bekreft/ });
    await user.click(button);

    expect(await screen.findByText('Du må svare på om arbeidsevnen er nedsatt med minst 50%')).toBeVisible();
  });

  it('Skal vise feilmelding dersom felt for hvilket år arbeisevnen ble nedsatt ikke er besvart', async () => {
    render(<Sykdomsvurdering grunnlag={grunnlag} readOnly={false} behandlingVersjon={0} tilknyttedeDokumenter={[]} />);
    await VelgAtArbeidsevneErNedsatt();
    const button = screen.getByRole('button', { name: /Bekreft/ });
    await user.click(button);

    expect(await screen.findByText('Du må sette en dato for når arbeidsevnen ble nedsatt')).toBeVisible();
  });

  async function VelgAtArbeidsevneErNedsatt() {
    const group = screen.getByRole('group', { name: 'Er arbeidsevnen nedsatt?' });
    const jaValg = within(group).getByRole('radio', { name: /Ja/ });
    await user.click(jaValg);
  }
});
