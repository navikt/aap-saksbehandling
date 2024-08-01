import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { SykdomsvurderingMedYrkesskade } from 'components/behandlinger/sykdom/sykdomsvurdering/SykdomsvurderingMedYrkesskade';
import { SykdomsGrunnlag } from 'lib/types/types';

const grunnlagFørBesvarelse: SykdomsGrunnlag = {
  skalVurdereYrkesskade: true,
  opplysninger: { innhentedeYrkesskader: [], oppgittYrkesskadeISøknad: false },
};

describe('Sykdomsvurdering med yrkesskade', () => {
  beforeEach(() => {
    render(
      <SykdomsvurderingMedYrkesskade
        grunnlag={grunnlagFørBesvarelse}
        readOnly={false}
        behandlingVersjon={0}
        tilknyttedeDokumenter={[]}
      />
    );
  });
  const user = userEvent.setup();

  it('Skal ha riktig heading', () => {
    const heading = screen.getByText('Yrkesskade og nedsatt arbeidsevne §§ 11-22 1.ledd, 11-5');
    expect(heading).toBeVisible();
  });

  it('Skal ha warning alert som forteller at vi har funnet en eller flere registrerte yrkesskader', () => {
    const warningAlert = screen.getByText(/vi har funnet en eller flere registrerte yrkesskader/i);
    expect(warningAlert).toBeVisible();
  });

  it('Skal ha synlig vilkårsveiledning', () => {
    const vilkårsveiledning = screen.getByText('Slik vurderes vilkåret');
    expect(vilkårsveiledning).toBeVisible();
  });

  it('skal ha en liste over tilknyttede dokumenter til vilkåret ', () => {
    const tilknyttedeDokumenterListe = screen.getByRole('list', { name: /tilknyttede dokumenter/i });
    expect(tilknyttedeDokumenterListe).toBeVisible();
  });

  it('Skal ha et begrunnelsesfelt', async () => {
    const textbox = screen.getByRole('textbox', {
      name: /Vurder den nedsatte arbeidsevnen/i,
    });

    expect(textbox).toBeVisible();
  });

  it('Skal vise feilmelding dersom begrunnelse felt ikke har blitt besvart', async () => {
    const button = screen.getByRole('button', { name: /bekreft/i });
    await user.click(button);

    expect(await screen.findByText('Du må begrunne')).toBeVisible();
  });

  it('Skal ha et felt for om arbeidsevnen er nedsatt', () => {
    const textbox = screen.getByRole('group', { name: /er arbeidsevnen nedsatt\?/i });
    expect(textbox).toBeVisible();
  });

  it('Skal vise feilmelding dersom felt om arbeidsevnen er nedsatt ikke har blitt besvart', async () => {
    const button = screen.getByRole('button', { name: /bekreft/i });
    await user.click(button);

    expect(await screen.findByText('Du må svare på om arbeidsevnen er nedsatt')).toBeVisible();
  });

  it('Skal ha felt for om sykdom, skade eller lyte er vesentlig medvirkende til nedsatt arbeidsevne', async () => {
    await velgAtArbeidsevneErNedsatt();
    const radiogroup = screen.getByRole('group', {
      name: /er det sykdom, skade eller lyte som er vesentlig medvirkende til nedsatt arbeidsevne\? \(§ 11-5\)/i,
    });

    expect(radiogroup).toBeVisible();
  });

  it('Skal vise feilmelding dersom felt for om sykdom, skade eller lyte er vesentlig medvirkende ikke har blitt besvart', async () => {
    await velgAtArbeidsevneErNedsatt();
    const button = screen.getByRole('button', { name: /bekreft/i });
    await user.click(button);

    expect(
      await screen.findByText(
        'Du må svare på om det er sykdom, skade eller lyte som er medvirkende til nedsatt arbeidsevne.'
      )
    ).toBeVisible();
  });

  it('Skal ha felt for om yrkesskaden helt eller delvis medvirkende til nedsatt arbeidsevne', async () => {
    await velgAtArbeidsevneErNedsatt();
    const radiogroup = screen.getByRole('group', {
      name: /er yrkesskaden helt eller delvis medvirkende årsak til den nedsatte arbeidsevnen\? \(§ 11-22 1\.ledd\)\./i,
    });

    expect(radiogroup).toBeVisible();
  });

  it('Skal vise feilmelding dersom felt for om yrkesskaden er medvirkende ikke har blitt besvart', async () => {
    await velgAtArbeidsevneErNedsatt();
    const button = screen.getByRole('button', { name: /bekreft/i });
    await user.click(button);

    expect(
      await screen.findByText(
        'Du må svare på om yrkesskaden er helt eller delvis medvirkende årsak til den nedsatte arbeidsevnen.'
      )
    ).toBeVisible();
  });

  it('Skal vise korrekt label i felt for om arbeidsevnen er nedsatt dersom 11-22 ikke er besvart', async () => {
    await velgAtArbeidsevneErNedsatt();
    const radiogroup = screen.getByRole('group', { name: /er arbeidsevnen nedsatt med minst 50%\?/i });

    expect(radiogroup).toBeVisible();
  });

  it('Skal vise feilmelding dersom spørsmål om arbeidsevnen er nedsatt ikke har blitt besvart', async () => {
    await velgAtArbeidsevneErNedsatt();
    const button = screen.getByRole('button', { name: /bekreft/i });
    await user.click(button);

    expect(await screen.findByText('Du må svare på om arbeidsevnen er nedsatt.')).toBeVisible();
  });

  it('Skal vise korrekt label i felt for om arbeidsevnen er nedsatt dersom 11-22 er oppfylt', async () => {
    await velgAtArbeidsevneErNedsatt();
    const radiogroup = screen.getByRole('group', {
      name: /er yrkesskaden helt eller delvis medvirkende årsak til den nedsatte arbeidsevnen\? \(§ 11-22 1\.ledd\)\./i,
    });

    const jaValg = within(radiogroup).getByRole('radio', { name: /ja/i });

    await user.click(jaValg);

    expect(await screen.findByRole('group', { name: /er arbeidsevnen nedsatt med minst 30%\?/i })).toBeVisible();
  });

  it('Skal vise korrekt label i felt for om arbeidsevnen er nedsatt dersom 11-22 ikke er oppfylt', async () => {
    await velgAtArbeidsevneErNedsatt();
    const radiogroup = screen.getByRole('group', {
      name: /er yrkesskaden helt eller delvis medvirkende årsak til den nedsatte arbeidsevnen\? \(§ 11-22 1\.ledd\)\./i,
    });

    const neiValg = within(radiogroup).getByRole('radio', { name: /nei/i });

    await user.click(neiValg);

    expect(await screen.findByRole('group', { name: /er arbeidsevnen nedsatt med minst 50%\?/i })).toBeVisible();
  });

  it('skal ha et felt for hvilket år arbeidsevnen ble nedsatt', async () => {
    await velgAtArbeidsevneErNedsatt();
    await velgAtSykdomSkadeEllerLyteErVesentligMedvirkendeÅrsak();
    await velgAtArbeidsevnenErNedsattMedMinst50prosent();

    expect(
      await screen.findByRole('textbox', { name: /hvilket år ble arbeidsevnen nedsatt\? \(§11-5\)/i })
    ).toBeVisible();
  });

  it('Skal vise feilmelding dersom felt for hvilket år arbeisevnen ble nedsatt ikke er besvart', async () => {
    await velgAtArbeidsevneErNedsatt();
    await velgAtSykdomSkadeEllerLyteErVesentligMedvirkendeÅrsak();
    await velgAtArbeidsevnenErNedsattMedMinst50prosent();

    const button = screen.getByRole('button', { name: /bekreft/i });
    await user.click(button);
    expect(await screen.findByText('Du må sette en dato for når arbeidsevnen ble nedsatt')).toBeVisible();
  });

  async function velgAtArbeidsevneErNedsatt() {
    const group = screen.getByRole('group', { name: /er arbeidsevnen nedsatt\?/i });
    const jaValg = within(group).getByRole('radio', { name: /ja/i });
    await user.click(jaValg);
  }

  async function velgAtSykdomSkadeEllerLyteErVesentligMedvirkendeÅrsak() {
    const erSykdomSkadeEllerLyteFelt = screen.getByRole('group', {
      name: /er det sykdom, skade eller lyte som er vesentlig medvirkende til nedsatt arbeidsevne\? \(§ 11-5\)/i,
    });

    const erSykdomSkadeEllerLyteFeltJaValg = within(erSykdomSkadeEllerLyteFelt).getByRole('radio', {
      name: /ja/i,
    });

    await user.click(erSykdomSkadeEllerLyteFeltJaValg);
  }

  async function velgAtArbeidsevnenErNedsattMedMinst50prosent() {
    const erArbeidsevnenNedsattMedMinst50prosentFelt = screen.getByRole('group', {
      name: /er arbeidsevnen nedsatt med minst 50%\?/i,
    });
    const erArbeidsevnenNedsattMedMinst50prosentFeltjaValg = within(
      erArbeidsevnenNedsattMedMinst50prosentFelt
    ).getByRole('radio', { name: /ja/i });
    await user.click(erArbeidsevnenNedsattMedMinst50prosentFeltjaValg);
  }
});
