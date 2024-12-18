import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { Sykdomsvurdering } from 'components/behandlinger/sykdom/sykdomsvurdering/Sykdomsvurdering';
import { userEvent } from '@testing-library/user-event';
import { SykdomsGrunnlag } from 'lib/types/types';

const user = userEvent.setup();
const grunnlagUtenYrkesskade: SykdomsGrunnlag = {
  skalVurdereYrkesskade: false,
  opplysninger: { innhentedeYrkesskader: [], oppgittYrkesskadeISøknad: false },
};

const grunnlagMedYrkesskade: SykdomsGrunnlag = {
  skalVurdereYrkesskade: true,
  opplysninger: { innhentedeYrkesskader: [], oppgittYrkesskadeISøknad: true },
};

describe('generelt', () => {
  it('Skal ha korrekt heading', () => {
    render(
      <Sykdomsvurdering
        grunnlag={grunnlagUtenYrkesskade}
        readOnly={false}
        behandlingVersjon={0}
        tilknyttedeDokumenter={[]}
      />
    );
    const heading = screen.getByRole('heading', { name: 'Nedsatt arbeidsevne - § 11-5' });
    expect(heading).toBeVisible();
  });

  it('skal vise en veiledningstest for hvordan vilkåret skal vurderes', () => {
    render(
      <Sykdomsvurdering
        grunnlag={grunnlagUtenYrkesskade}
        readOnly={false}
        behandlingVersjon={0}
        tilknyttedeDokumenter={[]}
      />
    );
    const veiledningsTekst = screen.getByText(
      'Folketrygdloven § 11-5 består av fire vilkår som du må ta stilling til og som alle må være oppfylt for at § 11-5 skal være oppfylt. Det vil si at hvis du svarer nei på ett av spørsmålene under, vil ikke vilkåret være oppfylt.'
    );
    expect(veiledningsTekst).toBeVisible();
  });

  it('skal ha en liste over tilknyttede dokumenter til vilkåret ', () => {
    render(
      <Sykdomsvurdering
        grunnlag={grunnlagUtenYrkesskade}
        readOnly={false}
        behandlingVersjon={0}
        tilknyttedeDokumenter={[]}
      />
    );
    const tilknyttedeDokumenterListe = screen.getByText('Tilknyttede dokumenter');
    expect(tilknyttedeDokumenterListe).toBeVisible();
  });

  it('skal vise en informasjonsvarsling dersom det blir besvart av innbygger ikke har nedsatt arbeidsevne', async () => {
    render(
      <Sykdomsvurdering
        grunnlag={grunnlagUtenYrkesskade}
        readOnly={false}
        behandlingVersjon={0}
        tilknyttedeDokumenter={[]}
      />
    );
    await velgAtInnbyggerHarSykdomSkadeLyte();

    const harInnbyggerNedsattArbeidsevneFelt = screen.getByRole('group', {
      name: 'Har innbygger nedsatt arbeidsevne?',
    });

    await user.click(within(harInnbyggerNedsattArbeidsevneFelt).getByRole('radio', { name: 'Nei' }));

    const informasjonsvarsling = screen.getByText(
      'Innbygger vil få vedtak om at de ikke har rett på AAP. De kvalifiserer ikke for sykepengeerstatning.'
    );

    expect(informasjonsvarsling).toBeVisible();
  });
});

describe('felt for begrunnelse', () => {
  it('Skal ha et begrunnelsefelt', () => {
    render(
      <Sykdomsvurdering
        grunnlag={grunnlagUtenYrkesskade}
        readOnly={false}
        behandlingVersjon={0}
        tilknyttedeDokumenter={[]}
      />
    );
    const textbox = screen.getByRole('textbox', { name: /Vurder den nedsatte arbeidsevnen/ });
    expect(textbox).toBeVisible();
  });

  it('Skal vise feilmelding dersom begrunnelse felt ikke har blitt besvart', async () => {
    render(
      <Sykdomsvurdering
        grunnlag={grunnlagUtenYrkesskade}
        readOnly={false}
        behandlingVersjon={0}
        tilknyttedeDokumenter={[]}
      />
    );
    const button = screen.getByRole('button', { name: 'Bekreft' });
    await user.click(button);

    expect(await screen.findByText('Du må begrunne')).toBeVisible();
  });

  it('Skal vise korrekt description på begrunnelsesfelt', async () => {
    render(
      <Sykdomsvurdering
        grunnlag={grunnlagUtenYrkesskade}
        readOnly={false}
        behandlingVersjon={0}
        tilknyttedeDokumenter={[]}
      />
    );

    const label = screen.getByText('Hvilken sykdom / skade / lyte. Hva er det mest vesentlige?');

    expect(label).toBeVisible();
  });
});

describe('felt for om bruker har sykdom, skade eller lyte', () => {
  it('har et felt for om bruker har sykdom, skade eller lyte', () => {
    render(
      <Sykdomsvurdering
        grunnlag={grunnlagUtenYrkesskade}
        readOnly={false}
        behandlingVersjon={0}
        tilknyttedeDokumenter={[]}
      />
    );
    expect(screen.getByRole('group', { name: 'Har innbygger sykdom, skade eller lyte?' })).toBeVisible();
  });

  it('Skal vise feilmelding dersom felt om at spørsmål om innbygger har sykdom, skade eller lyte ikke har blitt besvart', async () => {
    render(
      <Sykdomsvurdering
        grunnlag={grunnlagUtenYrkesskade}
        readOnly={false}
        behandlingVersjon={0}
        tilknyttedeDokumenter={[]}
      />
    );
    await velgBekreft();

    expect(await screen.findByText('Du må svare på om innbygger har sykdom, skade eller lyte')).toBeVisible();
  });
});

describe('felt for om arbeidsevnen er nedsatt', () => {
  it('Skal ha et felt for om arbeidsevnen er nedsatt dersom innbygger har sykdom, skade eller lyte', async () => {
    render(
      <Sykdomsvurdering
        grunnlag={grunnlagUtenYrkesskade}
        readOnly={false}
        behandlingVersjon={0}
        tilknyttedeDokumenter={[]}
      />
    );
    await velgAtInnbyggerHarSykdomSkadeLyte();
    const textbox = screen.getByRole('group', { name: 'Har innbygger nedsatt arbeidsevne?' });
    expect(textbox).toBeVisible();
  });

  it('viser feilmelding dersom felt om arbeidsevnen er nedsatt ikke er besvart', async () => {
    render(
      <Sykdomsvurdering
        grunnlag={grunnlagUtenYrkesskade}
        readOnly={false}
        behandlingVersjon={0}
        tilknyttedeDokumenter={[]}
      />
    );
    await velgAtInnbyggerHarSykdomSkadeLyte();
    await velgBekreft();
    expect(await screen.findByText('Du må svare på om innbygger har nedsatt arbeidsevne')).toBeVisible();
  });
});

describe('felt for å sette diagnoser', () => {
  it('skal ha et felt for å velge et system for diagnoser', async () => {
    render(
      <Sykdomsvurdering
        grunnlag={grunnlagUtenYrkesskade}
        readOnly={false}
        behandlingVersjon={0}
        tilknyttedeDokumenter={[]}
      />
    );

    const systemFelt = screen.getByRole('group', { name: /velg system for diagnoser/i });
    expect(systemFelt).toBeVisible();
  });

  it('skal vise en feilmelding dersom felt for å velge system ikke er valgt', async () => {
    render(
      <Sykdomsvurdering
        grunnlag={grunnlagUtenYrkesskade}
        readOnly={false}
        behandlingVersjon={0}
        tilknyttedeDokumenter={[]}
      />
    );

    await velgBekreft();

    const feilmelding = screen.getByText('Du må velge et system for diagnoser');
    expect(feilmelding).toBeVisible();
  });

  it('skal ha et felt for å sette en hoveddiagnose dersom innbygger har sykdom, skade eller lyte', async () => {
    render(
      <Sykdomsvurdering
        grunnlag={grunnlagUtenYrkesskade}
        readOnly={false}
        behandlingVersjon={0}
        tilknyttedeDokumenter={[]}
      />
    );
    const ICD10option = screen.getByRole('radio', { name: 'ICD10' });
    await user.click(ICD10option);

    expect(screen.getByRole('combobox', { name: 'Hoveddiagnose' })).toBeVisible();
  });

  it('skal ha vise en feilmelding dersom det ikke har blitt satt en hoveddiagnose', async () => {
    render(
      <Sykdomsvurdering
        grunnlag={grunnlagUtenYrkesskade}
        readOnly={false}
        behandlingVersjon={0}
        tilknyttedeDokumenter={[]}
      />
    );
    const ICD10option = screen.getByRole('radio', { name: 'ICD10' });
    await user.click(ICD10option);
    await velgBekreft();

    expect(screen.getByText('Du må velge en hoveddiagnose')).toBeVisible();
  });

  it('skal ha et felt for å sette bidiagnoser dersom innbygger har sykdom, skade eller lyte', async () => {
    render(
      <Sykdomsvurdering
        grunnlag={grunnlagUtenYrkesskade}
        readOnly={false}
        behandlingVersjon={0}
        tilknyttedeDokumenter={[]}
      />
    );
    const ICD10option = screen.getByRole('radio', { name: 'ICD10' });
    await user.click(ICD10option);

    expect(screen.getByRole('combobox', { name: 'Bidiagnoser (valgfritt)' })).toBeVisible();
  });

  it('skal ikke vise felt for bidiagnose dersom det har blitt valgt ingen diagnose på hoveddiagnose', async () => {
    render(
      <Sykdomsvurdering
        grunnlag={grunnlagUtenYrkesskade}
        readOnly={false}
        behandlingVersjon={0}
        tilknyttedeDokumenter={[]}
      />
    );
    const ICD10option = screen.getByRole('radio', { name: 'ICD10' });
    await user.click(ICD10option);

    const hoveddiagnose = screen.getByRole('combobox', { name: 'Hoveddiagnose' });
    await user.click(hoveddiagnose);

    const ingenDiagnoseOption = screen.getByText('Ingen diagnose');
    await user.click(ingenDiagnoseOption);

    expect(screen.queryByRole('combobox', { name: 'Bidiagnoser (valgfritt)' })).not.toBeInTheDocument();
  });

  it('skal vise felt for bidiagnose dersom det har blitt valgt noe annet enn ingen diagnose på hoveddiagnose', async () => {
    render(
      <Sykdomsvurdering
        grunnlag={grunnlagUtenYrkesskade}
        readOnly={false}
        behandlingVersjon={0}
        tilknyttedeDokumenter={[]}
      />
    );
    const ICD10option = screen.getByRole('radio', { name: 'ICPC2' });
    await user.click(ICD10option);

    const hoveddiagnose = screen.getByRole('combobox', { name: 'Hoveddiagnose' });
    await user.click(hoveddiagnose);

    await user.type(hoveddiagnose, 'Frysninger');

    const frysningerOption = screen.getByText('Frysninger (A02)');
    await user.click(frysningerOption);

    expect(screen.getByRole('combobox', { name: 'Bidiagnoser (valgfritt)' })).toBeVisible();
  });
});

describe('felt for nedsettelsen er av en viss varighet', () => {
  it('feltet skal vises', async () => {
    render(
      <Sykdomsvurdering
        grunnlag={grunnlagUtenYrkesskade}
        readOnly={false}
        behandlingVersjon={0}
        tilknyttedeDokumenter={[]}
      />
    );
    await velgAtInnbyggerHarSykdomSkadeLyte();

    await velgJaIGruppe(
      screen.getByRole('group', {
        name: 'Har innbygger nedsatt arbeidsevne?',
      })
    );

    const felt = screen.getByRole('group', { name: 'Er den nedsatte arbeidsevnen av en viss varighet?' });
    expect(felt).toBeVisible();
  });

  it('skal vise en feilmelding hvis feltet ikke er besvart', async () => {
    render(
      <Sykdomsvurdering
        grunnlag={grunnlagUtenYrkesskade}
        readOnly={false}
        behandlingVersjon={0}
        tilknyttedeDokumenter={[]}
      />
    );
    await velgAtInnbyggerHarSykdomSkadeLyte();
    await velgJaIGruppe(
      screen.getByRole('group', {
        name: 'Har innbygger nedsatt arbeidsevne?',
      })
    );

    await velgBekreft();

    expect(screen.getByText('Du må svare på om den nedsatte arbeidsevnen er av en viss varighet')).toBeVisible();
  });
});

describe('felt for om arbeidsevnen er nedsatt med minst halvparten', () => {
  it('Skal ha et felt for om arbeidsevnen er nedsatt med minst 50 prosent', async () => {
    render(
      <Sykdomsvurdering
        grunnlag={grunnlagUtenYrkesskade}
        readOnly={false}
        behandlingVersjon={0}
        tilknyttedeDokumenter={[]}
      />
    );
    await velgAtInnbyggerHarSykdomSkadeLyte();
    await velgJaIGruppe(screen.getByRole('group', { name: 'Har innbygger nedsatt arbeidsevne?' }));
    await velgJaIGruppe(screen.getByRole('group', { name: 'Er den nedsatte arbeidsevnen av en viss varighet?' }));
    const radioGroup = screen.getByRole('group', { name: 'Er arbeidsevnen nedsatt med minst 50%?' });
    expect(radioGroup).toBeVisible();
  });

  it('Skal vise feilmelding dersom felt for om arbeidsevnen er nedsatt med minst 50% ikke er besvart', async () => {
    render(
      <Sykdomsvurdering
        grunnlag={grunnlagUtenYrkesskade}
        readOnly={false}
        behandlingVersjon={0}
        tilknyttedeDokumenter={[]}
      />
    );
    await velgAtInnbyggerHarSykdomSkadeLyte();
    await velgJaIGruppe(screen.getByRole('group', { name: 'Har innbygger nedsatt arbeidsevne?' }));
    await velgJaIGruppe(screen.getByRole('group', { name: 'Er den nedsatte arbeidsevnen av en viss varighet?' }));
    await velgBekreft();

    expect(await screen.findByText('Du må svare på om arbeidsevnen er nedsatt med minst 50%')).toBeVisible();
  });
});

describe('felt for om sykdom, skade eller lyte er vestenlig medvirkende til at arbeidsevnen er nedsatt', () => {
  it('feltet skal vises dersom arbeidsevnen er nedsatt med minst 50%', async () => {
    render(
      <Sykdomsvurdering
        grunnlag={grunnlagUtenYrkesskade}
        readOnly={false}
        behandlingVersjon={0}
        tilknyttedeDokumenter={[]}
      />
    );
    await velgAtInnbyggerHarSykdomSkadeLyte();
    await velgJaIGruppe(screen.getByRole('group', { name: 'Har innbygger nedsatt arbeidsevne?' }));
    await velgJaIGruppe(screen.getByRole('group', { name: 'Er den nedsatte arbeidsevnen av en viss varighet?' }));
    await velgJaIGruppe(screen.getByRole('group', { name: 'Er arbeidsevnen nedsatt med minst 50%?' }));

    const felt = screen.getByRole('group', {
      name: 'Er sykdom, skade eller lyte vesentlig medvirkende til at arbeidsevnen er nedsatt?',
    });

    expect(felt).toBeVisible();
  });

  it('feltet skal vises dersom arbeidsevnen ikke er nedsatt med minst 50%, men nedsatt med 30%', async () => {
    render(
      <Sykdomsvurdering
        grunnlag={grunnlagMedYrkesskade}
        readOnly={false}
        behandlingVersjon={0}
        tilknyttedeDokumenter={[]}
      />
    );
    await velgAtInnbyggerHarSykdomSkadeLyte();
    await velgJaIGruppe(screen.getByRole('group', { name: 'Har innbygger nedsatt arbeidsevne?' }));
    await velgJaIGruppe(screen.getByRole('group', { name: 'Er den nedsatte arbeidsevnen av en viss varighet?' }));
    await velgNeiIGruppe(screen.getByRole('group', { name: 'Er arbeidsevnen nedsatt med minst 50%?' }));
    await velgJaIGruppe(screen.getByRole('group', { name: 'Er arbeidsevnen nedsatt med minst 30%?' }));

    const felt = screen.getByRole('group', {
      name: 'Er sykdom, skade eller lyte vesentlig medvirkende til at arbeidsevnen er nedsatt?',
    });

    expect(felt).toBeVisible();
  });

  it('viser en feilmelding dersom feltet ikke er besvart', async () => {
    render(
      <Sykdomsvurdering
        grunnlag={grunnlagUtenYrkesskade}
        readOnly={false}
        behandlingVersjon={0}
        tilknyttedeDokumenter={[]}
      />
    );
    await velgAtInnbyggerHarSykdomSkadeLyte();
    await velgJaIGruppe(screen.getByRole('group', { name: 'Har innbygger nedsatt arbeidsevne?' }));
    await velgJaIGruppe(screen.getByRole('group', { name: 'Er den nedsatte arbeidsevnen av en viss varighet?' }));
    await velgJaIGruppe(screen.getByRole('group', { name: 'Er arbeidsevnen nedsatt med minst 50%?' }));
    await velgBekreft();

    expect(
      screen.getByText('Du må svare på om sykdom, skade eller lyte er vesentlig medvirkende til nedsatt arbeidsevne')
    ).toBeVisible();
  });
});

describe('yrkesskade', () => {
  it('skal vise overskrift for feltene til yrkesskade', async () => {
    render(
      <Sykdomsvurdering
        grunnlag={grunnlagMedYrkesskade}
        readOnly={false}
        behandlingVersjon={0}
        tilknyttedeDokumenter={[]}
      />
    );
    await velgAtInnbyggerHarSykdomSkadeLyte();
    await velgJaIGruppe(screen.getByRole('group', { name: 'Har innbygger nedsatt arbeidsevne?' }));
    await velgJaIGruppe(screen.getByRole('group', { name: 'Er den nedsatte arbeidsevnen av en viss varighet?' }));
    await velgNeiIGruppe(screen.getByRole('group', { name: 'Er arbeidsevnen nedsatt med minst 50%?' }));

    expect(screen.getByText('Nedsatt arbeidsevne §§ 11-5 / 11-22'));
  });

  it('skal vise en veiledning for vurdering av 11-22', async () => {
    render(
      <Sykdomsvurdering
        grunnlag={grunnlagMedYrkesskade}
        readOnly={false}
        behandlingVersjon={0}
        tilknyttedeDokumenter={[]}
      />
    );
    await velgAtInnbyggerHarSykdomSkadeLyte();
    await velgJaIGruppe(screen.getByRole('group', { name: 'Har innbygger nedsatt arbeidsevne?' }));
    await velgJaIGruppe(screen.getByRole('group', { name: 'Er den nedsatte arbeidsevnen av en viss varighet?' }));
    await velgNeiIGruppe(screen.getByRole('group', { name: 'Er arbeidsevnen nedsatt med minst 50%?' }));

    expect(screen.getByText('Her kommer det noe tekst som beskriver hvordan vilkåret skal vurderes')).toBeVisible();
  });

  describe('felt for begrunnelse i yrkesskade', () => {
    it('skal ha et felt for begrunnelse dersom det finnes yrkesskade og arbeidsevnen ikke er nedsatt med halvparten', async () => {
      render(
        <Sykdomsvurdering
          grunnlag={grunnlagMedYrkesskade}
          readOnly={false}
          behandlingVersjon={0}
          tilknyttedeDokumenter={[]}
        />
      );
      await velgAtInnbyggerHarSykdomSkadeLyte();
      await velgJaIGruppe(screen.getByRole('group', { name: 'Har innbygger nedsatt arbeidsevne?' }));
      await velgJaIGruppe(screen.getByRole('group', { name: 'Er den nedsatte arbeidsevnen av en viss varighet?' }));
      await velgNeiIGruppe(screen.getByRole('group', { name: 'Er arbeidsevnen nedsatt med minst 50%?' }));

      expect(screen.getByRole('textbox', { name: 'Vurdering om arbeidsevne er nedsatt med minst 30% (§11-22)' }));
    });

    it('skal vise description', async () => {
      render(
        <Sykdomsvurdering
          grunnlag={grunnlagMedYrkesskade}
          readOnly={false}
          behandlingVersjon={0}
          tilknyttedeDokumenter={[]}
        />
      );
      await velgAtInnbyggerHarSykdomSkadeLyte();
      await velgJaIGruppe(screen.getByRole('group', { name: 'Har innbygger nedsatt arbeidsevne?' }));
      await velgJaIGruppe(screen.getByRole('group', { name: 'Er den nedsatte arbeidsevnen av en viss varighet?' }));
      await velgNeiIGruppe(screen.getByRole('group', { name: 'Er arbeidsevnen nedsatt med minst 50%?' }));

      expect(
        screen.getByText(
          'Innbygger har yrkesskade, og kan ha rett på AAP med en nedsatt arbeidsevne på minst 30%. Nay vurderer årsakssammenheng mellom yrkesskade og nedsatt arbeidsevne.'
        )
      );
    });

    it('skal vise feilmelding hvis det ikke er besvart', async () => {
      render(
        <Sykdomsvurdering
          grunnlag={grunnlagMedYrkesskade}
          readOnly={false}
          behandlingVersjon={0}
          tilknyttedeDokumenter={[]}
        />
      );
      await velgAtInnbyggerHarSykdomSkadeLyte();
      await velgJaIGruppe(screen.getByRole('group', { name: 'Har innbygger nedsatt arbeidsevne?' }));
      await velgJaIGruppe(screen.getByRole('group', { name: 'Er den nedsatte arbeidsevnen av en viss varighet?' }));
      await velgNeiIGruppe(screen.getByRole('group', { name: 'Er arbeidsevnen nedsatt med minst 50%?' }));
      await velgBekreft();

      expect(screen.getByText('Du må skrive en begrunnelse for om arbeidsevnen er nedsatt med mist 30%'));
    });
  });

  describe('felt for om arbeidsevnen er nedsatt med minst 30%', () => {
    it('skal vise feltet dersom det finnes yrkesskade og arbeidsevnen er ikke nedsatt med minst halvparten', async () => {
      render(
        <Sykdomsvurdering
          grunnlag={grunnlagMedYrkesskade}
          readOnly={false}
          behandlingVersjon={0}
          tilknyttedeDokumenter={[]}
        />
      );
      await velgAtInnbyggerHarSykdomSkadeLyte();
      await velgJaIGruppe(screen.getByRole('group', { name: 'Har innbygger nedsatt arbeidsevne?' }));
      await velgJaIGruppe(screen.getByRole('group', { name: 'Er den nedsatte arbeidsevnen av en viss varighet?' }));
      await velgNeiIGruppe(screen.getByRole('group', { name: 'Er arbeidsevnen nedsatt med minst 50%?' }));

      expect(screen.getByRole('group', { name: 'Er arbeidsevnen nedsatt med minst 30%?' }));
    });

    it('skal vise feilmelding dersom det ikke er besvart', async () => {
      render(
        <Sykdomsvurdering
          grunnlag={grunnlagMedYrkesskade}
          readOnly={false}
          behandlingVersjon={0}
          tilknyttedeDokumenter={[]}
        />
      );
      await velgAtInnbyggerHarSykdomSkadeLyte();
      await velgJaIGruppe(screen.getByRole('group', { name: 'Har innbygger nedsatt arbeidsevne?' }));
      await velgJaIGruppe(screen.getByRole('group', { name: 'Er den nedsatte arbeidsevnen av en viss varighet?' }));
      await velgNeiIGruppe(screen.getByRole('group', { name: 'Er arbeidsevnen nedsatt med minst 50%?' }));
      await velgBekreft();

      expect(screen.getByText('Du må svare på om den nedsatte arbeidsevnen er nedsatt med minst 30%.'));
    });
  });
});

const velgBekreft = async () => {
  const button = screen.getByRole('button', { name: /Bekreft/ });
  await user.click(button);
};

const velgAtInnbyggerHarSykdomSkadeLyte = async () => {
  const jaValg = within(screen.getByRole('group', { name: 'Har innbygger sykdom, skade eller lyte?' })).getByRole(
    'radio',
    {
      name: 'Ja',
    }
  );
  await user.click(jaValg);
};

const velgNeiIGruppe = async (gruppe: HTMLElement): Promise<void> =>
  await user.click(within(gruppe).getByRole('radio', { name: 'Nei' }));

const velgJaIGruppe = async (gruppe: HTMLElement): Promise<void> =>
  await user.click(within(gruppe).getByRole('radio', { name: 'Ja' }));
