import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { SykdomsGrunnlag } from 'lib/types/types';
import { format, subDays } from 'date-fns';
import { Sykdomsvurdering } from 'components/behandlinger/sykdom/sykdomsvurdering/Sykdomsvurdering';

const user = userEvent.setup();
const grunnlagUtenYrkesskade: SykdomsGrunnlag = {
  skalVurdereYrkesskade: false,
  opplysninger: { innhentedeYrkesskader: [], oppgittYrkesskadeISøknad: false },
  gjeldendeVedtatteSykdomsvurderinger: [],
  sykdomsvurderinger: [],
  historikkSykdomsvurderinger: [],
};

const grunnlagMedYrkesskade: SykdomsGrunnlag = {
  skalVurdereYrkesskade: true,
  opplysninger: { innhentedeYrkesskader: [], oppgittYrkesskadeISøknad: true },
  gjeldendeVedtatteSykdomsvurderinger: [],
  sykdomsvurderinger: [],
  historikkSykdomsvurderinger: [],
};

const søknadstidspunkt = format(new Date(), 'yyyy-MM-dd');

describe('generelt', () => {
  it('Skal ha korrekt heading', () => {
    render(
      <Sykdomsvurdering
        grunnlag={grunnlagUtenYrkesskade}
        readOnly={false}
        behandlingVersjon={0}
        tilknyttedeDokumenter={[]}
        typeBehandling={'Førstegangsbehandling'}
        søknadstidspunkt={søknadstidspunkt}
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
        typeBehandling={'Førstegangsbehandling'}
        søknadstidspunkt={søknadstidspunkt}
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
        typeBehandling={'Førstegangsbehandling'}
        søknadstidspunkt={søknadstidspunkt}
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
        typeBehandling={'Førstegangsbehandling'}
        søknadstidspunkt={søknadstidspunkt}
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
        typeBehandling={'Førstegangsbehandling'}
        søknadstidspunkt={søknadstidspunkt}
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
        typeBehandling={'Førstegangsbehandling'}
        søknadstidspunkt={søknadstidspunkt}
      />
    );
    const button = screen.getByRole('button', { name: 'Bekreft vurdering' });
    await user.click(button);

    expect(await screen.findByText('Du må gjøre en vilkårsvurdering')).toBeVisible();
  });

  it('Skal vise korrekt description på begrunnelsesfelt', async () => {
    render(
      <Sykdomsvurdering
        grunnlag={grunnlagUtenYrkesskade}
        readOnly={false}
        behandlingVersjon={0}
        tilknyttedeDokumenter={[]}
        typeBehandling={'Førstegangsbehandling'}
        søknadstidspunkt={søknadstidspunkt}
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
        typeBehandling={'Førstegangsbehandling'}
        søknadstidspunkt={søknadstidspunkt}
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
        typeBehandling={'Førstegangsbehandling'}
        søknadstidspunkt={søknadstidspunkt}
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
        typeBehandling={'Førstegangsbehandling'}
        søknadstidspunkt={søknadstidspunkt}
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
        typeBehandling={'Førstegangsbehandling'}
        søknadstidspunkt={søknadstidspunkt}
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
        typeBehandling={'Førstegangsbehandling'}
        søknadstidspunkt={søknadstidspunkt}
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
        typeBehandling={'Førstegangsbehandling'}
        søknadstidspunkt={søknadstidspunkt}
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
        typeBehandling={'Førstegangsbehandling'}
        søknadstidspunkt={søknadstidspunkt}
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
        typeBehandling={'Førstegangsbehandling'}
        søknadstidspunkt={søknadstidspunkt}
      />
    );

    await velgAtBrukerHarSykdomSkadeLyte();
    const ICD10option = await screen.findByRole('radio', { name: 'Spesialisthelsetjenesten (ICD10)' });
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
        typeBehandling={'Førstegangsbehandling'}
        søknadstidspunkt={søknadstidspunkt}
      />
    );

    await velgAtBrukerHarSykdomSkadeLyte();
    const ICD10option = screen.getByRole('radio', { name: 'Spesialisthelsetjenesten (ICD10)' });
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
        typeBehandling={'Førstegangsbehandling'}
        søknadstidspunkt={søknadstidspunkt}
      />
    );

    await velgAtBrukerHarSykdomSkadeLyte();
    const ICD10option = screen.getByRole('radio', { name: 'Spesialisthelsetjenesten (ICD10)' });
    await user.click(ICD10option);

    expect(await screen.findByRole('combobox', { name: 'Bidiagnoser' })).toBeVisible();
  });

  it('skal ikke vise felt for bidiagnose dersom det har blitt valgt ingen diagnose på hoveddiagnose', async () => {
    render(
      <Sykdomsvurdering
        grunnlag={grunnlagUtenYrkesskade}
        readOnly={false}
        behandlingVersjon={0}
        tilknyttedeDokumenter={[]}
        typeBehandling={'Førstegangsbehandling'}
        søknadstidspunkt={søknadstidspunkt}
      />
    );

    await velgAtBrukerHarSykdomSkadeLyte();
    const ICD10option = screen.getByRole('radio', { name: 'Spesialisthelsetjenesten (ICD10)' });
    await user.click(ICD10option);

    const hoveddiagnose = await screen.findByRole('combobox', { name: 'Hoveddiagnose' });
    await user.click(hoveddiagnose);

    const ingenDiagnoseOption = screen.getByText('Ingen diagnose');
    await user.click(ingenDiagnoseOption);

    expect(screen.queryByRole('combobox', { name: 'Bidiagnoser' })).not.toBeInTheDocument();
  });

  it('skal vise felt for bidiagnose dersom det har blitt valgt noe annet enn ingen diagnose på hoveddiagnose', async () => {
    render(
      <Sykdomsvurdering
        grunnlag={grunnlagUtenYrkesskade}
        readOnly={false}
        behandlingVersjon={0}
        tilknyttedeDokumenter={[]}
        typeBehandling={'Førstegangsbehandling'}
        søknadstidspunkt={søknadstidspunkt}
      />
    );

    await velgAtBrukerHarSykdomSkadeLyte();
    const ICD10option = screen.getByRole('radio', { name: 'Primærhelsetjenesten (ICPC2)' });
    await user.click(ICD10option);

    const hoveddiagnose = await screen.findByRole('combobox', { name: 'Hoveddiagnose' });
    await user.click(hoveddiagnose);

    await user.type(hoveddiagnose, 'Frysninger');

    const frysningerOption = screen.getByText('Frysninger (A02)');
    await user.click(frysningerOption);

    expect(await screen.findByRole('combobox', { name: 'Bidiagnoser' })).toBeVisible();
  });

  // TODO OIST dette funker i browser, men ikke i test. Why?
  it.skip('felt for hoveddiagnose er preutfylt med verdi fra gjeldende vurdering når det gjøres en revurdering', async () => {
    const grunnlagUtenYSMedHoveddiagnose: SykdomsGrunnlag = {
      skalVurdereYrkesskade: false,
      opplysninger: { innhentedeYrkesskader: [], oppgittYrkesskadeISøknad: false },
      gjeldendeVedtatteSykdomsvurderinger: [
        {
          dokumenterBruktIVurdering: [],
          begrunnelse: 'Sykdomsvurderingen her',
          erArbeidsevnenNedsatt: true,
          harSkadeSykdomEllerLyte: true,
          kodeverk: 'ICD10',
          hoveddiagnose: 'LUPUS',
          vurderingenGjelderFra: undefined,
          vurdertAvIdent: 'ABC',
          vurdertDato: '2025-02-01',
        },
      ],
      sykdomsvurderinger: [],
      historikkSykdomsvurderinger: [],
    };
    render(
      <Sykdomsvurdering
        grunnlag={grunnlagUtenYSMedHoveddiagnose}
        readOnly={false}
        behandlingVersjon={0}
        tilknyttedeDokumenter={[]}
        typeBehandling={'Revurdering'}
        søknadstidspunkt={format(subDays(new Date(), 7), 'yyyy-MM-dd')}
        hoveddiagnoseDefaultOptions={[
          { label: 'Lupus', value: 'LUPUS' },
          { label: 'Generell angst', value: 'ANGST' },
        ]}
      />
    );
    await skrivInnDatoForNårVurderingenGjelderFra(format(subDays(new Date(), 1), 'ddMMyy'));
    await velgAtBrukerHarSykdomSkadeLyte();
    expect(screen.getByRole('radio', { name: 'Spesialisthelsetjenesten (ICD10)' })).toBeChecked();
    const hoveddiagnose = await screen.findByRole('combobox', { name: 'Hoveddiagnose' }, { timeout: 5000 });
    expect(hoveddiagnose).toBeVisible();
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
        typeBehandling={'Førstegangsbehandling'}
        søknadstidspunkt={søknadstidspunkt}
      />
    );

    await velgAtBrukerHarSykdomSkadeLyte();
    await velgJaIGruppe(
      screen.getByRole('group', {
        name: 'Har bruker nedsatt arbeidsevne?',
      })
    );
    await velgJaIGruppe(screen.getByRole('group', { name: 'Er arbeidsevnen nedsatt med minst halvparten?' }));
    await velgJaIGruppe(
      screen.getByRole('group', {
        name: 'Er sykdom, skade eller lyte vesentlig medvirkende til at arbeidsevnen er nedsatt?',
      })
    );

    const felt = screen.getByRole('group', {
      name: 'Er den nedsatte arbeidsevnen av en viss varighet?',
    });
    expect(felt).toBeVisible();
  });

  it('skal vise en feilmelding hvis feltet ikke er besvart', async () => {
    render(
      <Sykdomsvurdering
        grunnlag={grunnlagUtenYrkesskade}
        readOnly={false}
        behandlingVersjon={0}
        tilknyttedeDokumenter={[]}
        typeBehandling={'Førstegangsbehandling'}
        søknadstidspunkt={søknadstidspunkt}
      />
    );
    await velgAtBrukerHarSykdomSkadeLyte();
    await velgJaIGruppe(
      screen.getByRole('group', {
        name: 'Har bruker nedsatt arbeidsevne?',
      })
    );
    await velgJaIGruppe(screen.getByRole('group', { name: 'Er arbeidsevnen nedsatt med minst halvparten?' }));
    await velgJaIGruppe(
      screen.getByRole('group', {
        name: 'Er sykdom, skade eller lyte vesentlig medvirkende til at arbeidsevnen er nedsatt?',
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
        typeBehandling={'Førstegangsbehandling'}
        søknadstidspunkt={søknadstidspunkt}
      />
    );
    await velgAtBrukerHarSykdomSkadeLyte();
    await velgJaIGruppe(screen.getByRole('group', { name: 'Har bruker nedsatt arbeidsevne?' }));
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
        typeBehandling={'Førstegangsbehandling'}
        søknadstidspunkt={søknadstidspunkt}
      />
    );
    await velgAtBrukerHarSykdomSkadeLyte();
    await velgJaIGruppe(screen.getByRole('group', { name: 'Har bruker nedsatt arbeidsevne?' }));
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
        typeBehandling={'Førstegangsbehandling'}
        søknadstidspunkt={søknadstidspunkt}
      />
    );
    await velgAtBrukerHarSykdomSkadeLyte();
    await velgJaIGruppe(screen.getByRole('group', { name: 'Har bruker nedsatt arbeidsevne?' }));
    await velgJaIGruppe(screen.getByRole('group', { name: 'Er arbeidsevnen nedsatt med minst halvparten?' }));

    const felt = screen.getByRole('group', {
      name: 'Er sykdom, skade eller lyte vesentlig medvirkende til at arbeidsevnen er nedsatt?',
    });

    expect(felt).toBeVisible();
  });

  it('feltet skal vises dersom arbeidsevnen ikke er nedsatt med minst halvparten, men nedsatt med 30 prosent', async () => {
    render(
      <Sykdomsvurdering
        grunnlag={grunnlagMedYrkesskade}
        readOnly={false}
        behandlingVersjon={0}
        tilknyttedeDokumenter={[]}
        typeBehandling={'Førstegangsbehandling'}
        søknadstidspunkt={søknadstidspunkt}
      />
    );
    await velgAtBrukerHarSykdomSkadeLyte();
    await velgJaIGruppe(screen.getByRole('group', { name: 'Har bruker nedsatt arbeidsevne?' }));
    await velgNeiIGruppe(screen.getByRole('group', { name: 'Er arbeidsevnen nedsatt med minst halvparten?' }));
    await velgJaIGruppe(screen.getByRole('group', { name: 'Er arbeidsevnen nedsatt med minst 30 prosent?' }));

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
        typeBehandling={'Førstegangsbehandling'}
        søknadstidspunkt={søknadstidspunkt}
      />
    );
    await velgAtBrukerHarSykdomSkadeLyte();
    await velgJaIGruppe(screen.getByRole('group', { name: 'Har bruker nedsatt arbeidsevne?' }));
    await velgJaIGruppe(screen.getByRole('group', { name: 'Er arbeidsevnen nedsatt med minst halvparten?' }));
    await velgBekreft();

    expect(
      screen.getByText('Du må svare på om sykdom, skade eller lyte er vesentlig medvirkende til nedsatt arbeidsevne')
    ).toBeVisible();
  });
});

describe('yrkesskade', () => {
  describe('felt for begrunnelse i yrkesskade', () => {
    it('skal ha et felt for begrunnelse dersom det finnes yrkesskade og arbeidsevnen ikke er nedsatt med halvparten', async () => {
      render(
        <Sykdomsvurdering
          grunnlag={grunnlagMedYrkesskade}
          readOnly={false}
          behandlingVersjon={0}
          tilknyttedeDokumenter={[]}
          typeBehandling={'Førstegangsbehandling'}
          søknadstidspunkt={søknadstidspunkt}
        />
      );
      await velgAtBrukerHarSykdomSkadeLyte();
      await velgJaIGruppe(screen.getByRole('group', { name: 'Har bruker nedsatt arbeidsevne?' }));
      await velgNeiIGruppe(screen.getByRole('group', { name: 'Er arbeidsevnen nedsatt med minst halvparten?' }));

      expect(screen.getByRole('textbox', { name: '§ 11-22 AAP ved yrkesskade' }));
    });

    it('skal vise description', async () => {
      render(
        <Sykdomsvurdering
          grunnlag={grunnlagMedYrkesskade}
          readOnly={false}
          behandlingVersjon={0}
          tilknyttedeDokumenter={[]}
          typeBehandling={'Førstegangsbehandling'}
          søknadstidspunkt={søknadstidspunkt}
        />
      );
      await velgAtBrukerHarSykdomSkadeLyte();
      await velgJaIGruppe(screen.getByRole('group', { name: 'Har bruker nedsatt arbeidsevne?' }));
      await velgNeiIGruppe(screen.getByRole('group', { name: 'Er arbeidsevnen nedsatt med minst halvparten?' }));

      expect(
        screen.getByText(
          'Brukeren har en yrkesskade som kan ha betydning for retten til AAP. Du må derfor vurdere om arbeidsevnen er nedsatt med minst 30 prosent. NAY vil vurdere om arbeidsevnen er nedsatt på grunn av yrkesskaden.'
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
          typeBehandling={'Førstegangsbehandling'}
          søknadstidspunkt={søknadstidspunkt}
        />
      );
      await velgAtBrukerHarSykdomSkadeLyte();
      await velgJaIGruppe(screen.getByRole('group', { name: 'Har bruker nedsatt arbeidsevne?' }));
      await velgNeiIGruppe(screen.getByRole('group', { name: 'Er arbeidsevnen nedsatt med minst halvparten?' }));
      await velgBekreft();

      expect(screen.getByText('Du må skrive en begrunnelse for om arbeidsevnen er nedsatt med mist 30 prosent'));
    });
  });

  describe('felt for om arbeidsevnen er nedsatt med minst 30 prosent', () => {
    it('skal vise feltet dersom det finnes yrkesskade og arbeidsevnen er ikke nedsatt med minst halvparten', async () => {
      render(
        <Sykdomsvurdering
          grunnlag={grunnlagMedYrkesskade}
          readOnly={false}
          behandlingVersjon={0}
          tilknyttedeDokumenter={[]}
          typeBehandling={'Førstegangsbehandling'}
          søknadstidspunkt={søknadstidspunkt}
        />
      );
      await velgAtBrukerHarSykdomSkadeLyte();
      await velgJaIGruppe(screen.getByRole('group', { name: 'Har bruker nedsatt arbeidsevne?' }));
      await velgNeiIGruppe(screen.getByRole('group', { name: 'Er arbeidsevnen nedsatt med minst halvparten?' }));

      expect(screen.getByRole('group', { name: 'Er arbeidsevnen nedsatt med minst 30 prosent?' }));
    });

    it('skal vise feilmelding dersom det ikke er besvart', async () => {
      render(
        <Sykdomsvurdering
          grunnlag={grunnlagMedYrkesskade}
          readOnly={false}
          behandlingVersjon={0}
          tilknyttedeDokumenter={[]}
          typeBehandling={'Førstegangsbehandling'}
          søknadstidspunkt={søknadstidspunkt}
        />
      );
      await velgAtBrukerHarSykdomSkadeLyte();
      await velgJaIGruppe(screen.getByRole('group', { name: 'Har bruker nedsatt arbeidsevne?' }));
      await velgNeiIGruppe(screen.getByRole('group', { name: 'Er arbeidsevnen nedsatt med minst halvparten?' }));
      await velgBekreft();

      expect(screen.getByText('Du må svare på om den nedsatte arbeidsevnen er nedsatt med minst 30 prosent.'));
    });
  });
});

describe('revurdering', () => {
  it('datofelt for når vurderingen gjelder fra vises ikke for førstegangsbehandling', () => {
    render(
      <Sykdomsvurdering
        grunnlag={grunnlagUtenYrkesskade}
        readOnly={false}
        behandlingVersjon={0}
        tilknyttedeDokumenter={[]}
        typeBehandling={'Førstegangsbehandling'}
        søknadstidspunkt={søknadstidspunkt}
      />
    );

    expect(screen.queryByRole('textbox', { name: 'Vurderingen gjelder fra' })).not.toBeInTheDocument();
  });

  it('viser datofelt får når vurderingen gjelder fra', () => {
    render(
      <Sykdomsvurdering
        grunnlag={grunnlagUtenYrkesskade}
        readOnly={false}
        behandlingVersjon={0}
        tilknyttedeDokumenter={[]}
        typeBehandling={'Revurdering'}
        søknadstidspunkt={søknadstidspunkt}
      />
    );

    expect(screen.getByRole('textbox', { name: 'Vurderingen gjelder fra' })).toBeVisible();
  });

  it('viser en feilmelding dersom dato for når vurderingen gjelder fra ikke er fylt ut', async () => {
    render(
      <Sykdomsvurdering
        grunnlag={grunnlagUtenYrkesskade}
        readOnly={false}
        behandlingVersjon={0}
        tilknyttedeDokumenter={[]}
        typeBehandling={'Revurdering'}
        søknadstidspunkt={format(subDays(new Date(), 4), 'yyyy-MM-dd')}
      />
    );

    await velgBekreft();
    expect(screen.getByText('Du må velge når vurderingen gjelder fra')).toBeVisible();
  });

  it('viser feilmelding dersom dato for når vurderingen gjelder fra er før søknadstidspunkt', async () => {
    render(
      <Sykdomsvurdering
        grunnlag={grunnlagUtenYrkesskade}
        readOnly={false}
        behandlingVersjon={0}
        tilknyttedeDokumenter={[]}
        typeBehandling={'Revurdering'}
        søknadstidspunkt={format(subDays(new Date(), 4), 'yyyy-MM-dd')}
      />
    );

    const datofelt = screen.getByRole('textbox', { name: 'Vurderingen gjelder fra' });
    const datoForVurderingInput = format(subDays(new Date(), 7), 'ddMMyy');
    await user.type(datofelt, datoForVurderingInput);
    await velgBekreft();
    expect(screen.getByText('Vurderingen kan ikke gjelde fra før søknadstidspunkt')).toBeVisible();
  });

  it('viser ikke feilmelding når dato for vurderingen er etter søknadstidspunkt', async () => {
    render(
      <Sykdomsvurdering
        grunnlag={grunnlagUtenYrkesskade}
        readOnly={false}
        behandlingVersjon={0}
        tilknyttedeDokumenter={[]}
        typeBehandling={'Revurdering'}
        søknadstidspunkt={format(subDays(new Date(), 4), 'yyyy-MM-dd')}
      />
    );

    const datofelt = screen.getByRole('textbox', { name: 'Vurderingen gjelder fra' });
    const datoForVurderingInput = format(new Date(), 'ddMMyy');
    await user.type(datofelt, datoForVurderingInput);
    await velgBekreft();
    expect(screen.queryByText('Vurderingen kan ikke gjelde fra før søknadstidspunkt')).not.toBeInTheDocument();
  });

  it('viser ikke feilmelding når dato for vurderingen er lik søknadstidspunkt', async () => {
    const søknadstidspunkt = subDays(new Date(), 4);
    render(
      <Sykdomsvurdering
        grunnlag={grunnlagUtenYrkesskade}
        readOnly={false}
        behandlingVersjon={0}
        tilknyttedeDokumenter={[]}
        typeBehandling={'Revurdering'}
        søknadstidspunkt={format(søknadstidspunkt, 'yyyy-MM-dd')}
      />
    );

    const datofelt = screen.getByRole('textbox', { name: 'Vurderingen gjelder fra' });
    const datoForVurderingInput = format(søknadstidspunkt, 'ddMMyy');
    await user.type(datofelt, datoForVurderingInput);
    await velgBekreft();
    expect(screen.queryByText('Vurderingen kan ikke gjelde fra før søknadstidspunkt')).not.toBeInTheDocument();
  });

  it('viser spørsmål om den nedsatte arbeidsevnen er minst 40 prosent når det ikke skal vurderes mot yrkesskade', async () => {
    const søknadstidspunkt = subDays(new Date(), 14);
    render(
      <Sykdomsvurdering
        grunnlag={grunnlagUtenYrkesskade}
        readOnly={false}
        behandlingVersjon={0}
        tilknyttedeDokumenter={[]}
        typeBehandling={'Revurdering'}
        søknadstidspunkt={format(søknadstidspunkt, 'yyyy-MM-dd')}
      />
    );
    await skrivInnDatoForNårVurderingenGjelderFra(format(new Date(), 'ddMMyy'));
    await velgAtBrukerHarSykdomSkadeLyte();
    await velgAtBrukerHarNedsattArbeidsevne();
    expect(screen.getByRole('group', { name: 'Er arbeidsevnen nedsatt med minst 40 prosent?' })).toBeVisible();
    expect(
      screen.queryByRole('group', { name: 'Er arbeidsevnen nedsatt med minst 30 prosent?' })
    ).not.toBeInTheDocument();
  });

  it('feltet for erNedsettelseIArbeidsevneMerEnnHalvparten brukes som grunnlag for om nedsettelsen er på minst 40 prosent i en revurdering', () => {
    const grunnlag: SykdomsGrunnlag = {
      skalVurdereYrkesskade: false,
      opplysninger: { innhentedeYrkesskader: [], oppgittYrkesskadeISøknad: false },
      gjeldendeVedtatteSykdomsvurderinger: [],
      historikkSykdomsvurderinger: [],
      sykdomsvurderinger: [
        {
          begrunnelse: 'En begrunnelse',
          dokumenterBruktIVurdering: [],
          harSkadeSykdomEllerLyte: true,
          vurdertAvIdent: 'ident',
          vurdertDato: '2025-03-11',
          bidiagnoser: [],
          erArbeidsevnenNedsatt: true,
          erNedsettelseIArbeidsevneMerEnnHalvparten: true,
          erNedsettelseIArbeidsevneAvEnVissVarighet: true,
        },
      ],
    };
    const søknadstidspunkt = subDays(new Date(), 14);
    render(
      <Sykdomsvurdering
        grunnlag={grunnlag}
        readOnly={true}
        behandlingVersjon={0}
        tilknyttedeDokumenter={[]}
        typeBehandling={'Revurdering'}
        søknadstidspunkt={format(søknadstidspunkt, 'yyyy-MM-dd')}
      />
    );
    const nedsattMed40ProsentGruppe = screen.getByRole('group', {
      name: /Er arbeidsevnen nedsatt med minst 40 prosent?/,
    });
    expect(nedsattMed40ProsentGruppe).toBeVisible();
    expect(within(nedsattMed40ProsentGruppe).getByRole('radio', { name: 'Ja' })).toBeChecked();
  });

  it('viser spørsmål om den nedsatte arbeidsevnen er minst 30 prosent når det skal vurderes mot yrkesskade', async () => {
    const søknadstidspunkt = subDays(new Date(), 14);
    render(
      <Sykdomsvurdering
        grunnlag={grunnlagMedYrkesskade}
        readOnly={false}
        behandlingVersjon={0}
        tilknyttedeDokumenter={[]}
        typeBehandling={'Revurdering'}
        søknadstidspunkt={format(søknadstidspunkt, 'yyyy-MM-dd')}
      />
    );
    await skrivInnDatoForNårVurderingenGjelderFra(format(new Date(), 'ddMMyy'));
    await velgAtBrukerHarSykdomSkadeLyte();
    await velgAtBrukerHarNedsattArbeidsevne();
    expect(
      screen.queryByRole('group', { name: 'Er arbeidsevnen nedsatt med minst 40 prosent?' })
    ).not.toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Er arbeidsevnen nedsatt med minst 30 prosent?' })).toBeVisible();
  });

  it('viser spørsmål for om den nedsatte arbeidsevnen i vesentlig del skyldes sykdom, skade eller lyte', async () => {
    const søknadstidspunkt = subDays(new Date(), 14);
    render(
      <Sykdomsvurdering
        grunnlag={grunnlagUtenYrkesskade}
        readOnly={false}
        behandlingVersjon={0}
        tilknyttedeDokumenter={[]}
        typeBehandling={'Revurdering'}
        søknadstidspunkt={format(søknadstidspunkt, 'yyyy-MM-dd')}
      />
    );
    await skrivInnDatoForNårVurderingenGjelderFra(format(new Date(), 'ddMMyy'));
    await velgAtBrukerHarSykdomSkadeLyte();
    await velgAtBrukerHarNedsattArbeidsevne();
    await velgAtArbeidsevnenErNedsattMedMinstFørtiProsent();
    expect(
      screen.getByRole('group', {
        name: 'Er sykdom, skade eller lyte vesentlig medvirkende til at arbeidsevnen er nedsatt?',
      })
    ).toBeVisible();
  });

  it('viser ikke felt for en viss varighet når det gjøres en revurdering', async () => {
    const søknadstidspunkt = subDays(new Date(), 14);
    render(
      <Sykdomsvurdering
        grunnlag={grunnlagUtenYrkesskade}
        readOnly={false}
        behandlingVersjon={0}
        tilknyttedeDokumenter={[]}
        typeBehandling={'Revurdering'}
        søknadstidspunkt={format(søknadstidspunkt, 'yyyy-MM-dd')}
      />
    );
    await skrivInnDatoForNårVurderingenGjelderFra(format(new Date(), 'ddMMyy'));
    await velgAtBrukerHarSykdomSkadeLyte();
    await velgAtBrukerHarNedsattArbeidsevne();
    expect(
      screen.queryByRole('group', {
        name: 'Er den nedsatte arbeidsevnen av en viss varighet?',
      })
    ).not.toBeInTheDocument();
  });
});

describe('revurdering av førstegangsbehandling', () => {
  it('viser felt for en viss varighet når det er revurdering av førstegangsbehandling', async () => {
    const søknadstidspunkt = subDays(new Date(), 4);
    render(
      <Sykdomsvurdering
        grunnlag={grunnlagUtenYrkesskade}
        readOnly={false}
        behandlingVersjon={0}
        tilknyttedeDokumenter={[]}
        typeBehandling={'Revurdering'}
        søknadstidspunkt={format(søknadstidspunkt, 'yyyy-MM-dd')}
      />
    );
    await skrivInnDatoForNårVurderingenGjelderFra(format(søknadstidspunkt, 'ddMMyy'));
    await velgAtBrukerHarSykdomSkadeLyte();
    await velgAtBrukerHarNedsattArbeidsevne();
    await velgJaIGruppe(screen.getByRole('group', { name: 'Er arbeidsevnen nedsatt med minst halvparten?' }));
    await velgJaIGruppe(
      screen.getByRole('group', {
        name: 'Er sykdom, skade eller lyte vesentlig medvirkende til at arbeidsevnen er nedsatt?',
      })
    );
    expect(
      screen.getByRole('group', {
        name: 'Er den nedsatte arbeidsevnen av en viss varighet?',
      })
    ).toBeVisible();
  });

  it('når gjelder fra dato settes til det samme som søknadstidspunkt vises spørsmål om arbeidsevnen er nedsatt med minst halvparten', async () => {
    const søknadstidspunkt = subDays(new Date(), 4);
    render(
      <Sykdomsvurdering
        grunnlag={grunnlagUtenYrkesskade}
        readOnly={false}
        behandlingVersjon={0}
        tilknyttedeDokumenter={[]}
        typeBehandling={'Revurdering'}
        søknadstidspunkt={format(søknadstidspunkt, 'yyyy-MM-dd')}
      />
    );
    await skrivInnDatoForNårVurderingenGjelderFra(format(søknadstidspunkt, 'ddMMyy'));
    await velgAtBrukerHarSykdomSkadeLyte();
    await velgAtBrukerHarNedsattArbeidsevne();
    expect(screen.getByRole('group', { name: 'Er arbeidsevnen nedsatt med minst halvparten?' })).toBeVisible();
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

const velgAtBrukerHarNedsattArbeidsevne = async () =>
  await velgJaIGruppe(screen.getByRole('group', { name: 'Har bruker nedsatt arbeidsevne?' }));

const velgAtArbeidsevnenErNedsattMedMinstFørtiProsent = async () =>
  await velgJaIGruppe(screen.getByRole('group', { name: 'Er arbeidsevnen nedsatt med minst 40 prosent?' }));

const skrivInnDatoForNårVurderingenGjelderFra = async (dato: string) => {
  const datofelt = screen.getByRole('textbox', { name: 'Vurderingen gjelder fra' });
  await user.type(datofelt, dato);
};

const velgNeiIGruppe = async (gruppe: HTMLElement): Promise<void> =>
  await user.click(within(gruppe).getByRole('radio', { name: 'Nei' }));

const velgJaIGruppe = async (gruppe: HTMLElement): Promise<void> =>
  await user.click(within(gruppe).getByRole('radio', { name: 'Ja' }));
