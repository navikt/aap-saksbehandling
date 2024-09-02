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
    const heading = screen.getByRole('heading', {
      name: 'Yrkesskade og nedsatt arbeidsevne §§ 11-22 1.ledd, 11-5',
      level: 3,
    });
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

  it('har et felt for om innbygger har sykdom, skade eller lyte', () => {
    expect(screen.getByRole('group', { name: 'Har innbygger sykdom, skade eller lyte?' })).toBeVisible();
  });

  it('felt for om arbeidsevne er nedsatt vises ikke hvis man svarer nei på om innbygger har sykdom, skade eller lyte', async () => {
    const gruppe = screen.getByRole('group', { name: 'Har innbygger sykdom, skade eller lyte?' });
    const neiValg = within(gruppe).getByRole('radio', { name: 'Nei' });
    await user.click(neiValg);
    expect(screen.queryByRole('group', { name: 'Er arbeidsevnen nedsatt?' })).not.toBeInTheDocument();
  });

  it('har et felt for om arbeidsevnen er nedsatt dersom man svarer ja på at bruker har sykdom, skade eller lyte', async () => {
    await velgAtInnbyggerHarSykdomSkadeEllerLyte();
    expect(screen.getByRole('group', { name: 'Er arbeidsevnen nedsatt?' })).toBeVisible();
  });

  it('Skal vise feilmelding dersom felt om arbeidsevnen er nedsatt ikke har blitt besvart', async () => {
    const button = screen.getByRole('button', { name: /bekreft/i });
    await user.click(button);

    expect(await screen.findByText('Du må svare på om innbygger har sykdom, skade eller lyte')).toBeVisible();
  });

  it('Skal ha felt for om sykdom, skade eller lyte er vesentlig medvirkende til nedsatt arbeidsevne', async () => {
    await velgAtInnbyggerHarSykdomSkadeEllerLyte();
    const radiogroup = screen.getByRole('group', {
      name: 'Er sykdom, skade eller lyte vesentlig medvirkende til at arbeidsevnen er nedsatt?',
    });

    expect(radiogroup).toBeVisible();
  });

  it('Skal vise feilmelding dersom felt for om sykdom, skade eller lyte er vesentlig medvirkende ikke har blitt besvart', async () => {
    await velgAtInnbyggerHarSykdomSkadeEllerLyte();
    const button = screen.getByRole('button', { name: /bekreft/i });
    await user.click(button);

    expect(
      await screen.findByText(
        'Du må svare på om sykdom, skade eller lyte er vesentlig medvirkende til nedsatt arbeidsevne'
      )
    ).toBeVisible();
  });

  it('Skal ha felt for om yrkesskaden helt eller delvis medvirkende til nedsatt arbeidsevne', async () => {
    await velgAtInnbyggerHarSykdomSkadeEllerLyte();
    const radiogroup = screen.getByRole('group', {
      name: /er yrkesskaden helt eller delvis medvirkende årsak til den nedsatte arbeidsevnen\? \(§ 11-22 1\.ledd\)\./i,
    });

    expect(radiogroup).toBeVisible();
  });

  it('Skal vise feilmelding dersom felt for om yrkesskaden er medvirkende ikke har blitt besvart', async () => {
    await velgAtInnbyggerHarSykdomSkadeEllerLyte();
    const button = screen.getByRole('button', { name: /bekreft/i });
    await user.click(button);

    expect(
      await screen.findByText(
        'Du må svare på om yrkesskaden er helt eller delvis medvirkende årsak til den nedsatte arbeidsevnen.'
      )
    ).toBeVisible();
  });

  it('Skal vise korrekt label i felt for om arbeidsevnen er nedsatt dersom 11-22 ikke er besvart', async () => {
    await velgAtInnbyggerHarSykdomSkadeEllerLyte();
    const radiogroup = screen.getByRole('group', { name: /er arbeidsevnen nedsatt med minst 50%\?/i });

    expect(radiogroup).toBeVisible();
  });

  it('Skal vise feilmelding dersom spørsmål om arbeidsevnen er nedsatt ikke har blitt besvart', async () => {
    await velgAtInnbyggerHarSykdomSkadeEllerLyte();
    const button = screen.getByRole('button', { name: /bekreft/i });
    await user.click(button);

    expect(await screen.findByText('Du må svare på om arbeidsevnen er nedsatt.')).toBeVisible();
  });

  it('Skal vise korrekt label i felt for om arbeidsevnen er nedsatt dersom 11-22 er oppfylt', async () => {
    await velgAtInnbyggerHarSykdomSkadeEllerLyte();
    const radiogroup = screen.getByRole('group', {
      name: /er yrkesskaden helt eller delvis medvirkende årsak til den nedsatte arbeidsevnen\? \(§ 11-22 1\.ledd\)\./i,
    });

    const jaValg = within(radiogroup).getByRole('radio', { name: /ja/i });

    await user.click(jaValg);

    expect(await screen.findByRole('group', { name: /er arbeidsevnen nedsatt med minst 30%\?/i })).toBeVisible();
  });

  it('Skal vise korrekt label i felt for om arbeidsevnen er nedsatt dersom 11-22 ikke er oppfylt', async () => {
    await velgAtInnbyggerHarSykdomSkadeEllerLyte();
    const radiogroup = screen.getByRole('group', {
      name: /er yrkesskaden helt eller delvis medvirkende årsak til den nedsatte arbeidsevnen\? \(§ 11-22 1\.ledd\)\./i,
    });

    const neiValg = within(radiogroup).getByRole('radio', { name: /nei/i });

    await user.click(neiValg);

    expect(await screen.findByRole('group', { name: /er arbeidsevnen nedsatt med minst 50%\?/i })).toBeVisible();
  });

  it('skal ha et felt for hvilket år arbeidsevnen ble nedsatt', async () => {
    await velgAtInnbyggerHarSykdomSkadeEllerLyte();
    await velgAtArbeidsevnenErNedsatt();
    await velgAtSykdomSkadeEllerLyteErVesentligMedvirkendeÅrsak();
    await velgAtArbeidsevnenErNedsattMedMinst50prosent();

    expect(await screen.findByRole('textbox', { name: 'Hvilket år ble arbeidsevnen nedsatt? (§11-5)' })).toBeVisible();
  });

  it('Skal vise feilmelding dersom felt for hvilket år arbeisevnen ble nedsatt ikke er besvart', async () => {
    await velgAtInnbyggerHarSykdomSkadeEllerLyte();
    await velgAtArbeidsevnenErNedsatt();
    await velgAtSykdomSkadeEllerLyteErVesentligMedvirkendeÅrsak();
    await velgAtArbeidsevnenErNedsattMedMinst50prosent();

    const button = screen.getByRole('button', { name: 'Bekreft' });
    await user.click(button);
    expect(await screen.findByText('Du må sette en dato for når arbeidsevnen ble nedsatt')).toBeVisible();
  });

  async function velgAtSykdomSkadeEllerLyteErVesentligMedvirkendeÅrsak() {
    const erSykdomSkadeEllerLyteFelt = screen.getByRole('group', {
      name: 'Er sykdom, skade eller lyte vesentlig medvirkende til at arbeidsevnen er nedsatt?',
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

  const velgAtInnbyggerHarSykdomSkadeEllerLyte = async () => {
    const jaValg = within(screen.getByRole('group', { name: 'Har innbygger sykdom, skade eller lyte?' })).getByRole(
      'radio',
      { name: 'Ja' }
    );
    await user.click(jaValg);
  };

  const velgAtArbeidsevnenErNedsatt = async () => {
    const jaValg = within(screen.getByRole('group', { name: 'Er arbeidsevnen nedsatt?' })).getByRole('radio', {
      name: 'Ja',
    });
    await user.click(jaValg);
  };
});
