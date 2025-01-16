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
    const heading = screen.getByRole('heading', { name: '§ 11-5 Nedsatt arbeidsevne og krav til årsakssammenheng' });
    expect(heading).toBeVisible();
  });

  it('skal vise en lenke som viser hvordan vilkåret skal vurderes', () => {
    render(
      <Sykdomsvurdering
        grunnlag={grunnlagUtenYrkesskade}
        readOnly={false}
        behandlingVersjon={0}
        tilknyttedeDokumenter={[]}
      />
    );

    const link = screen.getByRole('link', {
      name: 'Du kan lese hvordan vilkåret skal vurderes i rundskrivet til § 11-5 (lovdata.no)',
    });
    expect(link).toBeVisible();
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

  it('skal vise en informasjonsvarsling dersom det blir besvart av bruker ikke har nedsatt arbeidsevne', async () => {
    render(
      <Sykdomsvurdering
        grunnlag={grunnlagUtenYrkesskade}
        readOnly={false}
        behandlingVersjon={0}
        tilknyttedeDokumenter={[]}
      />
    );
    await velgAtBrukerHarSykdomSkadeLyte();

    const harBrukerNedsattArbeidsevneFelt = screen.getByRole('group', {
      name: 'Har bruker nedsatt arbeidsevne?',
    });

    await user.click(within(harBrukerNedsattArbeidsevneFelt).getByRole('radio', { name: 'Nei' }));

    const informasjonsvarsling = screen.getByText(
      'Bruker vil få vedtak om at de ikke har rett på AAP. De kvalifiserer ikke for sykepengeerstatning.'
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
    const textbox = screen.getByRole('textbox', { name: 'Vilkårsvurdering' });
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
    const button = screen.getByRole('button', { name: 'Bekreft vurdering' });
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

    const label = screen.getByText(
      'Vekt og vurder opplysningene mot hverandre, og vurder om brukeren oppfyller vilkårene i § 11-5'
    );

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
    expect(screen.getByRole('group', { name: 'Har bruker sykdom, skade eller lyte?' })).toBeVisible();
  });

  it('Skal vise feilmelding dersom felt om at spørsmål om bruker har sykdom, skade eller lyte ikke har blitt besvart', async () => {
    render(
      <Sykdomsvurdering
        grunnlag={grunnlagUtenYrkesskade}
        readOnly={false}
        behandlingVersjon={0}
        tilknyttedeDokumenter={[]}
      />
    );
    await velgBekreft();

    expect(await screen.findByText('Du må svare på om bruker har sykdom, skade eller lyte')).toBeVisible();
  });
});

describe('felt for om arbeidsevnen er nedsatt', () => {
  it('Skal ha et felt for om arbeidsevnen er nedsatt dersom bruker har sykdom, skade eller lyte', async () => {
    render(
      <Sykdomsvurdering
        grunnlag={grunnlagUtenYrkesskade}
        readOnly={false}
        behandlingVersjon={0}
        tilknyttedeDokumenter={[]}
      />
    );
    await velgAtBrukerHarSykdomSkadeLyte();
    const textbox = screen.getByRole('group', { name: 'Har bruker nedsatt arbeidsevne?' });
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
    await velgAtBrukerHarSykdomSkadeLyte();
    await velgBekreft();
    expect(await screen.getByText('Du må svare på om bruker har nedsatt arbeidsevne')).toBeVisible();
  });
});

describe('felt for å sette diagnoser', () => {
  it('felt for å sette diagnoser vises ikke initielt', async () => {
    render(
      <Sykdomsvurdering
        grunnlag={grunnlagUtenYrkesskade}
        readOnly={false}
        behandlingVersjon={0}
        tilknyttedeDokumenter={[]}
      />
    );

    expect(screen.queryByRole('group', { name: 'Velg system for diagnoser' })).not.toBeInTheDocument();
  });

  it('skal ha et felt for å velge et system for diagnoser når man har svart ja på at bruker har sykdom, skade eller lyte', async () => {
    render(
      <Sykdomsvurdering
        grunnlag={grunnlagUtenYrkesskade}
        readOnly={false}
        behandlingVersjon={0}
        tilknyttedeDokumenter={[]}
      />
    );

    await velgAtBrukerHarSykdomSkadeLyte();

    expect(screen.getByRole('group', { name: 'Velg system for diagnoser' })).toBeVisible();
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

    await velgAtBrukerHarSykdomSkadeLyte();
    await velgBekreft();

    const feilmelding = screen.getByText('Du må velge et system for diagnoser');
    expect(feilmelding).toBeVisible();
  });

  it('skal ha et felt for å sette en hoveddiagnose dersom bruker har sykdom, skade eller lyte', async () => {
    render(
      <Sykdomsvurdering
        grunnlag={grunnlagUtenYrkesskade}
        readOnly={false}
        behandlingVersjon={0}
        tilknyttedeDokumenter={[]}
      />
    );

    await velgAtBrukerHarSykdomSkadeLyte();
    const ICD10option = await screen.findByRole('radio', { name: 'ICD10' });
    await user.click(ICD10option);

    expect(await screen.findByRole('combobox', { name: 'Hoveddiagnose' }, { timeout: 5000 })).toBeVisible();
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

    await velgAtBrukerHarSykdomSkadeLyte();
    const ICD10option = screen.getByRole('radio', { name: 'ICD10' });
    await user.click(ICD10option);
    await velgBekreft();

    expect(screen.getByText('Du må velge en hoveddiagnose')).toBeVisible();
  });

  it('skal ha et felt for å sette bidiagnoser dersom bruker har sykdom, skade eller lyte', async () => {
    render(
      <Sykdomsvurdering
        grunnlag={grunnlagUtenYrkesskade}
        readOnly={false}
        behandlingVersjon={0}
        tilknyttedeDokumenter={[]}
      />
    );

    await velgAtBrukerHarSykdomSkadeLyte();
    const ICD10option = screen.getByRole('radio', { name: 'ICD10' });
    await user.click(ICD10option);

    expect(await screen.findByRole('combobox', { name: 'Bidiagnoser (valgfritt)' })).toBeVisible();
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

    await velgAtBrukerHarSykdomSkadeLyte();
    const ICD10option = screen.getByRole('radio', { name: 'ICD10' });
    await user.click(ICD10option);

    const hoveddiagnose = await screen.findByRole('combobox', { name: 'Hoveddiagnose' });
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

    await velgAtBrukerHarSykdomSkadeLyte();
    const ICD10option = screen.getByRole('radio', { name: 'ICPC2' });
    await user.click(ICD10option);

    const hoveddiagnose = await screen.findByRole('combobox', { name: 'Hoveddiagnose' });
    await user.click(hoveddiagnose);

    await user.type(hoveddiagnose, 'Frysninger');

    const frysningerOption = screen.getByText('Frysninger (A02)');
    await user.click(frysningerOption);

    expect(await screen.findByRole('combobox', { name: 'Bidiagnoser (valgfritt)' })).toBeVisible();
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
    await velgAtBrukerHarSykdomSkadeLyte();

    await velgJaIGruppe(
      screen.getByRole('group', {
        name: 'Har bruker nedsatt arbeidsevne?',
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
    await velgAtBrukerHarSykdomSkadeLyte();
    await velgJaIGruppe(
      screen.getByRole('group', {
        name: 'Har bruker nedsatt arbeidsevne?',
      })
    );

    await velgBekreft();

    expect(screen.getByText('Du må svare på om den nedsatte arbeidsevnen er av en viss varighet')).toBeVisible();
  });
});

describe('felt for om arbeidsevnen er nedsatt med minst halvparten', () => {
  it('Skal ha et felt for om arbeidsevnen er nedsatt med minst halvparten', async () => {
    render(
      <Sykdomsvurdering
        grunnlag={grunnlagUtenYrkesskade}
        readOnly={false}
        behandlingVersjon={0}
        tilknyttedeDokumenter={[]}
      />
    );
    await velgAtBrukerHarSykdomSkadeLyte();
    await velgJaIGruppe(screen.getByRole('group', { name: 'Har bruker nedsatt arbeidsevne?' }));
    await velgJaIGruppe(screen.getByRole('group', { name: 'Er den nedsatte arbeidsevnen av en viss varighet?' }));
    const radioGroup = screen.getByRole('group', { name: 'Er arbeidsevnen nedsatt med minst halvparten?' });
    expect(radioGroup).toBeVisible();
  });

  it('Skal vise feilmelding dersom felt for om arbeidsevnen er nedsatt med minst halvparten ikke er besvart', async () => {
    render(
      <Sykdomsvurdering
        grunnlag={grunnlagUtenYrkesskade}
        readOnly={false}
        behandlingVersjon={0}
        tilknyttedeDokumenter={[]}
      />
    );
    await velgAtBrukerHarSykdomSkadeLyte();
    await velgJaIGruppe(screen.getByRole('group', { name: 'Har bruker nedsatt arbeidsevne?' }));
    await velgJaIGruppe(screen.getByRole('group', { name: 'Er den nedsatte arbeidsevnen av en viss varighet?' }));
    await velgBekreft();

    expect(await screen.findByText('Du må svare på om arbeidsevnen er nedsatt med minst halvparten')).toBeVisible();
  });
});

describe('felt for om sykdom, skade eller lyte er vestenlig medvirkende til at arbeidsevnen er nedsatt', () => {
  it('feltet skal vises dersom arbeidsevnen er nedsatt med minst halvparten', async () => {
    render(
      <Sykdomsvurdering
        grunnlag={grunnlagUtenYrkesskade}
        readOnly={false}
        behandlingVersjon={0}
        tilknyttedeDokumenter={[]}
      />
    );
    await velgAtBrukerHarSykdomSkadeLyte();
    await velgJaIGruppe(screen.getByRole('group', { name: 'Har bruker nedsatt arbeidsevne?' }));
    await velgJaIGruppe(screen.getByRole('group', { name: 'Er den nedsatte arbeidsevnen av en viss varighet?' }));
    await velgJaIGruppe(screen.getByRole('group', { name: 'Er arbeidsevnen nedsatt med minst halvparten?' }));

    const felt = screen.getByRole('group', {
      name: 'Er sykdom, skade eller lyte vesentlig medvirkende til at arbeidsevnen er nedsatt?',
    });

    expect(felt).toBeVisible();
  });

  it('feltet skal vises dersom arbeidsevnen ikke er nedsatt med minst halvparten, men nedsatt med 30%', async () => {
    render(
      <Sykdomsvurdering
        grunnlag={grunnlagMedYrkesskade}
        readOnly={false}
        behandlingVersjon={0}
        tilknyttedeDokumenter={[]}
      />
    );
    await velgAtBrukerHarSykdomSkadeLyte();
    await velgJaIGruppe(screen.getByRole('group', { name: 'Har bruker nedsatt arbeidsevne?' }));
    await velgJaIGruppe(screen.getByRole('group', { name: 'Er den nedsatte arbeidsevnen av en viss varighet?' }));
    await velgNeiIGruppe(screen.getByRole('group', { name: 'Er arbeidsevnen nedsatt med minst halvparten?' }));
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
    await velgAtBrukerHarSykdomSkadeLyte();
    await velgJaIGruppe(screen.getByRole('group', { name: 'Har bruker nedsatt arbeidsevne?' }));
    await velgJaIGruppe(screen.getByRole('group', { name: 'Er den nedsatte arbeidsevnen av en viss varighet?' }));
    await velgJaIGruppe(screen.getByRole('group', { name: 'Er arbeidsevnen nedsatt med minst halvparten?' }));
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
    await velgAtBrukerHarSykdomSkadeLyte();
    await velgJaIGruppe(screen.getByRole('group', { name: 'Har bruker nedsatt arbeidsevne?' }));
    await velgJaIGruppe(screen.getByRole('group', { name: 'Er den nedsatte arbeidsevnen av en viss varighet?' }));
    await velgNeiIGruppe(screen.getByRole('group', { name: 'Er arbeidsevnen nedsatt med minst halvparten?' }));

    expect(screen.getByText('Nedsatt arbeidsevne §§ 11-5 / 11-22'));
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
      await velgAtBrukerHarSykdomSkadeLyte();
      await velgJaIGruppe(screen.getByRole('group', { name: 'Har bruker nedsatt arbeidsevne?' }));
      await velgJaIGruppe(screen.getByRole('group', { name: 'Er den nedsatte arbeidsevnen av en viss varighet?' }));
      await velgNeiIGruppe(screen.getByRole('group', { name: 'Er arbeidsevnen nedsatt med minst halvparten?' }));

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
      await velgAtBrukerHarSykdomSkadeLyte();
      await velgJaIGruppe(screen.getByRole('group', { name: 'Har bruker nedsatt arbeidsevne?' }));
      await velgJaIGruppe(screen.getByRole('group', { name: 'Er den nedsatte arbeidsevnen av en viss varighet?' }));
      await velgNeiIGruppe(screen.getByRole('group', { name: 'Er arbeidsevnen nedsatt med minst halvparten?' }));

      expect(
        screen.getByText(
          'Bruker har yrkesskade, og kan ha rett på AAP med en nedsatt arbeidsevne på minst 30%. Nay vurderer årsakssammenheng mellom yrkesskade og nedsatt arbeidsevne.'
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
      await velgAtBrukerHarSykdomSkadeLyte();
      await velgJaIGruppe(screen.getByRole('group', { name: 'Har bruker nedsatt arbeidsevne?' }));
      await velgJaIGruppe(screen.getByRole('group', { name: 'Er den nedsatte arbeidsevnen av en viss varighet?' }));
      await velgNeiIGruppe(screen.getByRole('group', { name: 'Er arbeidsevnen nedsatt med minst halvparten?' }));
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
      await velgAtBrukerHarSykdomSkadeLyte();
      await velgJaIGruppe(screen.getByRole('group', { name: 'Har bruker nedsatt arbeidsevne?' }));
      await velgJaIGruppe(screen.getByRole('group', { name: 'Er den nedsatte arbeidsevnen av en viss varighet?' }));
      await velgNeiIGruppe(screen.getByRole('group', { name: 'Er arbeidsevnen nedsatt med minst halvparten?' }));

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
      await velgAtBrukerHarSykdomSkadeLyte();
      await velgJaIGruppe(screen.getByRole('group', { name: 'Har bruker nedsatt arbeidsevne?' }));
      await velgJaIGruppe(screen.getByRole('group', { name: 'Er den nedsatte arbeidsevnen av en viss varighet?' }));
      await velgNeiIGruppe(screen.getByRole('group', { name: 'Er arbeidsevnen nedsatt med minst halvparten?' }));
      await velgBekreft();

      expect(screen.getByText('Du må svare på om den nedsatte arbeidsevnen er nedsatt med minst 30%.'));
    });
  });
});

const velgBekreft = async () => {
  const button = screen.getByRole('button', { name: 'Bekreft vurdering' });
  await user.click(button);
};

const velgAtBrukerHarSykdomSkadeLyte = async () => {
  const jaValg = within(screen.getByRole('group', { name: 'Har bruker sykdom, skade eller lyte?' })).getByRole(
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
