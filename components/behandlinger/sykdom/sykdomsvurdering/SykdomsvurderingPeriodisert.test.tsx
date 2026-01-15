import { beforeEach, describe, expect, it, vi } from 'vitest';
import { customRenderWithSøknadstidspunkt, render, screen, within } from 'lib/test/CustomRender';
import { userEvent } from '@testing-library/user-event';
import { MellomlagretVurderingResponse, SykdomsGrunnlag, Sykdomvurdering } from 'lib/types/types';
import { format, subDays, addDays } from 'date-fns';
import { SykdomsvurderingFormFields } from 'components/behandlinger/sykdom/sykdomsvurdering/Sykdomsvurdering';
import { FetchResponse } from 'lib/utils/api';
import createFetchMock from 'vitest-fetch-mock';
import { defaultFlytResponse, setMockFlytResponse } from 'vitestSetup';
import { SykdomsvurderingPeriodisert } from 'components/behandlinger/sykdom/sykdomsvurdering/SykdomsvurderingPeriodisert';
import { Dato } from 'lib/types/Dato';
import { formaterDatoForBackend } from 'lib/utils/date';

const fetchMock = createFetchMock(vi);
fetchMock.enableMocks();
const user = userEvent.setup();

const grunnlagUtenYrkesskade: SykdomsGrunnlag = {
  behøverVurderinger: [{ fom: new Dato(new Date()).formaterForBackend(), tom: '2099-01-01' }],
  kanVurderes: [],
  nyeVurderinger: [],
  sisteVedtatteVurderinger: [],
  perioderSomIkkeErTilstrekkeligVurdert: [],
  harTilgangTilÅSaksbehandle: true,
  skalVurdereYrkesskade: false,
  erÅrsakssammenhengYrkesskade: false,
  opplysninger: { innhentedeYrkesskader: [], oppgittYrkesskadeISøknad: false },
  gjeldendeVedtatteSykdomsvurderinger: [],
  sykdomsvurderinger: [],
  historikkSykdomsvurderinger: [],
};

const grunnlagMedYrkesskade: SykdomsGrunnlag = {
  behøverVurderinger: [{ fom: format(new Date(), 'yyyy-MM-dd'), tom: '2099-01-01' }],
  kanVurderes: [{ fom: format(new Date(), 'yyyy-MM-dd'), tom: '2099-01-01' }],
  nyeVurderinger: [],
  sisteVedtatteVurderinger: [],
  perioderSomIkkeErTilstrekkeligVurdert: [],
  harTilgangTilÅSaksbehandle: true,
  skalVurdereYrkesskade: true,
  erÅrsakssammenhengYrkesskade: false,
  opplysninger: { innhentedeYrkesskader: [], oppgittYrkesskadeISøknad: true },
  gjeldendeVedtatteSykdomsvurderinger: [],
  sykdomsvurderinger: [],
  historikkSykdomsvurderinger: [],
};

const grunnlagMedTidligereVurdering: SykdomsGrunnlag = {
  behøverVurderinger: [],
  kanVurderes: [],
  nyeVurderinger: [
    {
      fom: '2025-01-01',
      begrunnelse: 'Dette er en tidligere begrunnelse',
      dokumenterBruktIVurdering: [{ identifikator: '12345' }],
      harSkadeSykdomEllerLyte: true,
      vurdertAv: {
        dato: '2025-10-31T09:44:54.793',
        ident: 'Z123456',
      },
    },
  ],
  sisteVedtatteVurderinger: [],
  perioderSomIkkeErTilstrekkeligVurdert: [],
  harTilgangTilÅSaksbehandle: true,
  skalVurdereYrkesskade: false,
  erÅrsakssammenhengYrkesskade: false,
  opplysninger: { innhentedeYrkesskader: [], oppgittYrkesskadeISøknad: false },
  gjeldendeVedtatteSykdomsvurderinger: [],
  sykdomsvurderinger: [],
  historikkSykdomsvurderinger: [],
};

beforeEach(() => {
  setMockFlytResponse({ ...defaultFlytResponse, aktivtSteg: 'AVKLAR_SYKDOM' });
});

describe('generelt', () => {
  it('Skal ha korrekt heading', () => {
    render(
      <SykdomsvurderingPeriodisert
        grunnlag={grunnlagUtenYrkesskade}
        readOnly={false}
        behandlingVersjon={0}
        typeBehandling={'Førstegangsbehandling'}
      />
    );
    const heading = screen.getByRole('heading', { name: '§ 11-5 Nedsatt arbeidsevne og krav til årsakssammenheng' });
    expect(heading).toBeVisible();
  });

  it('skal vise en lenke som viser hvordan vilkåret skal vurderes', () => {
    render(
      <SykdomsvurderingPeriodisert
        grunnlag={grunnlagUtenYrkesskade}
        readOnly={false}
        behandlingVersjon={0}
        typeBehandling={'Førstegangsbehandling'}
      />
    );

    const link = screen.getByRole('link', {
      name: 'Du kan lese hvordan vilkåret skal vurderes i rundskrivet til § 11-5 (lovdata.no)',
    });
    expect(link).toBeVisible();
  });

  it('skal vise en informasjonsvarsling dersom det blir besvart av brukeren ikke har nedsatt arbeidsevne', async () => {
    render(
      <SykdomsvurderingPeriodisert
        grunnlag={grunnlagUtenYrkesskade}
        readOnly={false}
        behandlingVersjon={0}
        typeBehandling={'Førstegangsbehandling'}
      />
    );
    await velgAtBrukerHarSykdomSkadeLyte();

    const harBrukerNedsattArbeidsevneFelt = screen.getByRole('group', {
      name: 'Har brukeren nedsatt arbeidsevne?',
    });

    await user.click(within(harBrukerNedsattArbeidsevneFelt).getByRole('radio', { name: 'Nei' }));

    const informasjonsvarsling = screen.getByText(
      'Brukeren vil få vedtak om at de ikke har rett på AAP. De kvalifiserer ikke for sykepengeerstatning.'
    );

    expect(informasjonsvarsling).toBeVisible();
  });

  it('skal resette state i felt dersom Avbryt-knappen blir trykket', async () => {
    setMockFlytResponse({ ...defaultFlytResponse, aktivtSteg: 'VURDER_BISTANDSBEHOV' });

    render(
      <SykdomsvurderingPeriodisert
        grunnlag={grunnlagMedTidligereVurdering}
        readOnly={false}
        behandlingVersjon={0}
        typeBehandling={'Førstegangsbehandling'}
      />
    );

    const endreKnapp = screen.getByRole('button', { name: 'Endre' });
    await user.click(endreKnapp);

    const begrunnelseFelt = screen.getByRole('textbox', { name: 'Vilkårsvurdering' });
    await user.clear(begrunnelseFelt);
    await user.type(begrunnelseFelt, 'Dette er en ny begrunnelse');
    expect(begrunnelseFelt).toHaveValue('Dette er en ny begrunnelse');

    const avbrytKnapp = screen.getByRole('button', { name: 'Avbryt' });
    await user.click(avbrytKnapp);

    const begrunnelseFeltEtterAvbryt = screen.getByRole('textbox', { name: 'Vilkårsvurdering' });
    expect(begrunnelseFeltEtterAvbryt).toHaveValue('Dette er en tidligere begrunnelse');
  });
});

describe('felt for begrunnelse', () => {
  it('Skal ha et begrunnelsefelt', () => {
    render(
      <SykdomsvurderingPeriodisert
        grunnlag={grunnlagUtenYrkesskade}
        readOnly={false}
        behandlingVersjon={0}
        typeBehandling={'Førstegangsbehandling'}
      />
    );
    const textbox = screen.getByRole('textbox', { name: 'Vilkårsvurdering' });
    expect(textbox).toBeVisible();
  });

  it('Skal vise feilmelding dersom begrunnelse felt ikke har blitt besvart', async () => {
    render(
      <SykdomsvurderingPeriodisert
        grunnlag={grunnlagUtenYrkesskade}
        readOnly={false}
        behandlingVersjon={0}
        typeBehandling={'Førstegangsbehandling'}
      />
    );
    await skrivInnDatoForNårVurderingenGjelderFra(format(new Date(), 'ddMMyy'));
    const button = screen.getByRole('button', { name: 'Bekreft' });
    await user.click(button);

    const feilmeldinger = await screen.findAllByText('Du må gjøre en vilkårsvurdering');
    expect(feilmeldinger.length).toBe(2);
    expect(feilmeldinger[0]).toBeVisible();
  });
});

describe('felt for om brukeren har sykdom, skade eller lyte', () => {
  it('har et felt for om brukeren har sykdom, skade eller lyte', () => {
    render(
      <SykdomsvurderingPeriodisert
        grunnlag={grunnlagUtenYrkesskade}
        readOnly={false}
        behandlingVersjon={0}
        typeBehandling={'Førstegangsbehandling'}
      />
    );
    expect(screen.getByRole('group', { name: 'Har brukeren sykdom, skade eller lyte?' })).toBeVisible();
  });

  it('Skal vise feilmelding dersom felt om at spørsmål om brukeren har sykdom, skade eller lyte ikke har blitt besvart', async () => {
    render(
      <SykdomsvurderingPeriodisert
        grunnlag={grunnlagUtenYrkesskade}
        readOnly={false}
        behandlingVersjon={0}
        typeBehandling={'Førstegangsbehandling'}
      />
    );
    await velgBekreft();
    const feilmeldinger = await screen.findAllByText('Du må svare på om brukeren har sykdom, skade eller lyte');
    expect(feilmeldinger.length).toBe(2);
    expect(feilmeldinger[0]).toBeVisible();
  });
});

describe('felt for om arbeidsevnen er nedsatt', () => {
  it('Skal ha et felt for om arbeidsevnen er nedsatt dersom brukeren har sykdom, skade eller lyte', async () => {
    render(
      <SykdomsvurderingPeriodisert
        grunnlag={grunnlagUtenYrkesskade}
        readOnly={false}
        behandlingVersjon={0}
        typeBehandling={'Førstegangsbehandling'}
      />
    );
    await velgAtBrukerHarSykdomSkadeLyte();
    const textbox = screen.getByRole('group', { name: 'Har brukeren nedsatt arbeidsevne?' });
    expect(textbox).toBeVisible();
  });

  it('viser feilmelding dersom felt om arbeidsevnen er nedsatt ikke er besvart', async () => {
    render(
      <SykdomsvurderingPeriodisert
        grunnlag={grunnlagUtenYrkesskade}
        readOnly={false}
        behandlingVersjon={0}
        typeBehandling={'Førstegangsbehandling'}
      />
    );
    await velgAtBrukerHarSykdomSkadeLyte();
    await velgBekreft();

    const feilmeldinger = await screen.getAllByText('Du må svare på om brukeren har nedsatt arbeidsevne');
    expect(feilmeldinger.length).toBe(2);
    expect(feilmeldinger[0]).toBeVisible();
  });
});

describe('felt for å sette diagnoser', () => {
  it('felt for å sette diagnoser vises ikke initielt', async () => {
    render(
      <SykdomsvurderingPeriodisert
        grunnlag={grunnlagUtenYrkesskade}
        readOnly={false}
        behandlingVersjon={0}
        typeBehandling={'Førstegangsbehandling'}
      />
    );

    expect(screen.queryByRole('group', { name: 'Velg system for diagnoser' })).not.toBeInTheDocument();
  });

  it('skal ha et felt for å velge et system for diagnoser når man har svart ja på at brukeren har sykdom, skade eller lyte', async () => {
    render(
      <SykdomsvurderingPeriodisert
        grunnlag={grunnlagUtenYrkesskade}
        readOnly={false}
        behandlingVersjon={0}
        typeBehandling={'Førstegangsbehandling'}
      />
    );

    await velgAtBrukerHarSykdomSkadeLyte();

    expect(screen.getByRole('group', { name: 'Velg system for diagnoser' })).toBeVisible();
  });

  it('skal vise en feilmelding dersom felt for å velge system ikke er valgt', async () => {
    render(
      <SykdomsvurderingPeriodisert
        grunnlag={grunnlagUtenYrkesskade}
        readOnly={false}
        behandlingVersjon={0}
        typeBehandling={'Førstegangsbehandling'}
      />
    );

    await velgAtBrukerHarSykdomSkadeLyte();
    await velgBekreft();

    const feilmeldinger = await screen.findAllByText('Du må velge et system for diagnoser');
    expect(feilmeldinger.length).toBe(2);
    expect(feilmeldinger[0]).toBeVisible();
  });

  it('skal ha et felt for å sette en hoveddiagnose dersom brukeren har sykdom, skade eller lyte', async () => {
    render(
      <SykdomsvurderingPeriodisert
        grunnlag={grunnlagUtenYrkesskade}
        readOnly={false}
        behandlingVersjon={0}
        typeBehandling={'Førstegangsbehandling'}
      />
    );

    await velgAtBrukerHarSykdomSkadeLyte();
    const ICD10option = await screen.findByRole('radio', { name: 'Spesialisthelsetjenesten (ICD10)' });
    await user.click(ICD10option);

    expect(await screen.findByRole('combobox', { name: 'Hoveddiagnose' }, { timeout: 5000 })).toBeVisible();
  });

  it('skal ha vise en feilmelding dersom det ikke har blitt satt en hoveddiagnose', async () => {
    render(
      <SykdomsvurderingPeriodisert
        grunnlag={grunnlagUtenYrkesskade}
        readOnly={false}
        behandlingVersjon={0}
        typeBehandling={'Førstegangsbehandling'}
      />
    );

    await velgAtBrukerHarSykdomSkadeLyte();
    const ICD10option = screen.getByRole('radio', { name: 'Spesialisthelsetjenesten (ICD10)' });
    await user.click(ICD10option);
    await velgBekreft();

    const feilmeldinger = await screen.findAllByText('Du må velge en hoveddiagnose');
    expect(feilmeldinger.length).toBe(2);
    expect(feilmeldinger[0]).toBeVisible();
  });

  it('skal ha et felt for å sette bidiagnoser dersom brukeren har sykdom, skade eller lyte', async () => {
    render(
      <SykdomsvurderingPeriodisert
        grunnlag={grunnlagUtenYrkesskade}
        readOnly={false}
        behandlingVersjon={0}
        typeBehandling={'Førstegangsbehandling'}
      />
    );

    await velgAtBrukerHarSykdomSkadeLyte();
    const ICD10option = screen.getByRole('radio', { name: 'Spesialisthelsetjenesten (ICD10)' });
    await user.click(ICD10option);

    expect(await screen.findByRole('combobox', { name: 'Bidiagnoser' })).toBeVisible();
  });

  it('skal ikke vise felt for bidiagnose dersom det har blitt valgt ingen diagnose på hoveddiagnose', async () => {
    render(
      <SykdomsvurderingPeriodisert
        grunnlag={grunnlagUtenYrkesskade}
        readOnly={false}
        behandlingVersjon={0}
        typeBehandling={'Førstegangsbehandling'}
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
      <SykdomsvurderingPeriodisert
        grunnlag={grunnlagUtenYrkesskade}
        readOnly={false}
        behandlingVersjon={0}
        typeBehandling={'Førstegangsbehandling'}
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
});

describe('felt for nedsettelsen er av en viss varighet', () => {
  it('feltet skal vises', async () => {
    render(
      <SykdomsvurderingPeriodisert
        grunnlag={grunnlagUtenYrkesskade}
        readOnly={false}
        behandlingVersjon={0}
        typeBehandling={'Førstegangsbehandling'}
      />
    );

    await velgAtBrukerHarSykdomSkadeLyte();
    await velgJaIGruppe(
      screen.getByRole('group', {
        name: 'Har brukeren nedsatt arbeidsevne?',
      })
    );
    await velgJaIGruppe(screen.getByRole('group', { name: 'Er arbeidsevnen nedsatt med minst halvparten?' }));
    await velgJaIGruppe(
      screen.getByRole('group', {
        name: 'Er sykdom, skade eller lyte vesentlig medvirkende til at arbeidsevnen er nedsatt?',
      })
    );

    const felt = screen.getByRole('group', {
      name: 'Er den nedsatte arbeidsevnen av en viss varighet? Om du svarer nei, vil brukeren vurderes for AAP som sykepengeerstatning etter § 11-13.',
    });
    expect(felt).toBeVisible();
  });

  it('skal vise en feilmelding hvis feltet ikke er besvart', async () => {
    render(
      <SykdomsvurderingPeriodisert
        grunnlag={grunnlagUtenYrkesskade}
        readOnly={false}
        behandlingVersjon={0}
        typeBehandling={'Førstegangsbehandling'}
      />
    );
    await velgAtBrukerHarSykdomSkadeLyte();
    await velgJaIGruppe(
      screen.getByRole('group', {
        name: 'Har brukeren nedsatt arbeidsevne?',
      })
    );
    await velgJaIGruppe(screen.getByRole('group', { name: 'Er arbeidsevnen nedsatt med minst halvparten?' }));
    await velgJaIGruppe(
      screen.getByRole('group', {
        name: 'Er sykdom, skade eller lyte vesentlig medvirkende til at arbeidsevnen er nedsatt?',
      })
    );

    await velgBekreft();

    const feilmeldinger = await screen.findAllByText(
      'Du må svare på om den nedsatte arbeidsevnen er av en viss varighet'
    );
    expect(feilmeldinger.length).toBe(2);
    expect(feilmeldinger[0]).toBeVisible();
  });
});

describe('felt for om arbeidsevnen er nedsatt med minst halvparten', () => {
  it('Skal ha et felt for om arbeidsevnen er nedsatt med minst halvparten', async () => {
    render(
      <SykdomsvurderingPeriodisert
        grunnlag={grunnlagUtenYrkesskade}
        readOnly={false}
        behandlingVersjon={0}
        typeBehandling={'Førstegangsbehandling'}
      />
    );
    await velgAtBrukerHarSykdomSkadeLyte();
    await velgJaIGruppe(screen.getByRole('group', { name: 'Har brukeren nedsatt arbeidsevne?' }));
    const radioGroup = screen.getByRole('group', { name: 'Er arbeidsevnen nedsatt med minst halvparten?' });
    expect(radioGroup).toBeVisible();
  });

  it('Skal vise feilmelding dersom felt for om arbeidsevnen er nedsatt med minst halvparten ikke er besvart', async () => {
    render(
      <SykdomsvurderingPeriodisert
        grunnlag={grunnlagUtenYrkesskade}
        readOnly={false}
        behandlingVersjon={0}
        typeBehandling={'Førstegangsbehandling'}
      />
    );
    await velgAtBrukerHarSykdomSkadeLyte();
    await velgJaIGruppe(screen.getByRole('group', { name: 'Har brukeren nedsatt arbeidsevne?' }));
    await velgBekreft();

    const feilmeldinger = await screen.findAllByText('Du må svare på om arbeidsevnen er nedsatt med minst halvparten');
    expect(feilmeldinger.length).toBe(2);
    expect(feilmeldinger[0]).toBeVisible();
  });
});

describe('felt for om sykdom, skade eller lyte er vestenlig medvirkende til at arbeidsevnen er nedsatt', () => {
  it('feltet skal vises dersom arbeidsevnen er nedsatt med minst halvparten', async () => {
    render(
      <SykdomsvurderingPeriodisert
        grunnlag={grunnlagUtenYrkesskade}
        readOnly={false}
        behandlingVersjon={0}
        typeBehandling={'Førstegangsbehandling'}
      />
    );
    await velgAtBrukerHarSykdomSkadeLyte();
    await velgJaIGruppe(screen.getByRole('group', { name: 'Har brukeren nedsatt arbeidsevne?' }));
    await velgJaIGruppe(screen.getByRole('group', { name: 'Er arbeidsevnen nedsatt med minst halvparten?' }));

    const felt = screen.getByRole('group', {
      name: 'Er sykdom, skade eller lyte vesentlig medvirkende til at arbeidsevnen er nedsatt?',
    });

    expect(felt).toBeVisible();
  });

  it('feltet skal vises dersom arbeidsevnen ikke er nedsatt med minst halvparten, men nedsatt med 30 prosent', async () => {
    render(
      <SykdomsvurderingPeriodisert
        grunnlag={grunnlagMedYrkesskade}
        readOnly={false}
        behandlingVersjon={0}
        typeBehandling={'Førstegangsbehandling'}
      />
    );
    await velgAtBrukerHarSykdomSkadeLyte();
    await velgJaIGruppe(screen.getByRole('group', { name: 'Har brukeren nedsatt arbeidsevne?' }));
    await velgNeiIGruppe(screen.getByRole('group', { name: 'Er arbeidsevnen nedsatt med minst halvparten?' }));
    await velgJaIGruppe(screen.getByRole('group', { name: 'Er arbeidsevnen nedsatt med minst 30 prosent?' }));

    const felt = screen.getByRole('group', {
      name: 'Er sykdom, skade eller lyte vesentlig medvirkende til at arbeidsevnen er nedsatt?',
    });

    expect(felt).toBeVisible();
  });

  it('viser en feilmelding dersom feltet ikke er besvart', async () => {
    render(
      <SykdomsvurderingPeriodisert
        grunnlag={grunnlagUtenYrkesskade}
        readOnly={false}
        behandlingVersjon={0}
        typeBehandling={'Førstegangsbehandling'}
      />
    );
    await velgAtBrukerHarSykdomSkadeLyte();
    await velgJaIGruppe(screen.getByRole('group', { name: 'Har brukeren nedsatt arbeidsevne?' }));
    await velgJaIGruppe(screen.getByRole('group', { name: 'Er arbeidsevnen nedsatt med minst halvparten?' }));
    await velgBekreft();

    const feilmeldinger = await screen.findAllByText(
      'Du må svare på om sykdom, skade eller lyte er vesentlig medvirkende til nedsatt arbeidsevne'
    );
    expect(feilmeldinger.length).toBe(2);
    expect(feilmeldinger[0]).toBeVisible();
  });
});

describe('yrkesskade', () => {
  describe('felt for begrunnelse i yrkesskade', () => {
    it('skal ha et felt for begrunnelse dersom det finnes yrkesskade og arbeidsevnen ikke er nedsatt med halvparten', async () => {
      render(
        <SykdomsvurderingPeriodisert
          grunnlag={grunnlagMedYrkesskade}
          readOnly={false}
          behandlingVersjon={0}
          typeBehandling={'Førstegangsbehandling'}
        />
      );
      await velgAtBrukerHarSykdomSkadeLyte();
      await velgJaIGruppe(screen.getByRole('group', { name: 'Har brukeren nedsatt arbeidsevne?' }));
      await velgNeiIGruppe(screen.getByRole('group', { name: 'Er arbeidsevnen nedsatt med minst halvparten?' }));

      expect(screen.getByRole('textbox', { name: '§ 11-22 AAP ved yrkesskade' }));
    });

    it('skal vise description', async () => {
      render(
        <SykdomsvurderingPeriodisert
          grunnlag={grunnlagMedYrkesskade}
          readOnly={false}
          behandlingVersjon={0}
          typeBehandling={'Førstegangsbehandling'}
        />
      );
      await velgAtBrukerHarSykdomSkadeLyte();
      await velgJaIGruppe(screen.getByRole('group', { name: 'Har brukeren nedsatt arbeidsevne?' }));
      await velgNeiIGruppe(screen.getByRole('group', { name: 'Er arbeidsevnen nedsatt med minst halvparten?' }));

      expect(
        screen.getByText(
          'Brukeren har en yrkesskade som kan ha betydning for retten til AAP. Du må derfor vurdere om arbeidsevnen er nedsatt med minst 30 prosent. NAY vil vurdere om arbeidsevnen er nedsatt på grunn av yrkesskaden.'
        )
      );
    });

    it('skal vise feilmelding hvis det ikke er besvart', async () => {
      render(
        <SykdomsvurderingPeriodisert
          grunnlag={grunnlagMedYrkesskade}
          readOnly={false}
          behandlingVersjon={0}
          typeBehandling={'Førstegangsbehandling'}
        />
      );
      await velgAtBrukerHarSykdomSkadeLyte();
      await velgJaIGruppe(screen.getByRole('group', { name: 'Har brukeren nedsatt arbeidsevne?' }));
      await velgNeiIGruppe(screen.getByRole('group', { name: 'Er arbeidsevnen nedsatt med minst halvparten?' }));
      await velgBekreft();

      const feilmeldinger = await screen.findAllByText(
        'Du må skrive en begrunnelse for om arbeidsevnen er nedsatt med mist 30 prosent'
      );
      expect(feilmeldinger.length).toBe(2);
      expect(feilmeldinger[0]).toBeVisible();
    });
  });

  describe('felt for om arbeidsevnen er nedsatt med minst 30 prosent', () => {
    it('skal vise feltet dersom det finnes yrkesskade og arbeidsevnen er ikke nedsatt med minst halvparten', async () => {
      render(
        <SykdomsvurderingPeriodisert
          grunnlag={grunnlagMedYrkesskade}
          readOnly={false}
          behandlingVersjon={0}
          typeBehandling={'Førstegangsbehandling'}
        />
      );
      await velgAtBrukerHarSykdomSkadeLyte();
      await velgJaIGruppe(screen.getByRole('group', { name: 'Har brukeren nedsatt arbeidsevne?' }));
      await velgNeiIGruppe(screen.getByRole('group', { name: 'Er arbeidsevnen nedsatt med minst halvparten?' }));

      expect(screen.getByRole('group', { name: 'Er arbeidsevnen nedsatt med minst 30 prosent?' }));
    });

    it('skal vise feilmelding dersom det ikke er besvart', async () => {
      render(
        <SykdomsvurderingPeriodisert
          grunnlag={grunnlagMedYrkesskade}
          readOnly={false}
          behandlingVersjon={0}
          typeBehandling={'Førstegangsbehandling'}
        />
      );
      await velgAtBrukerHarSykdomSkadeLyte();
      await velgJaIGruppe(screen.getByRole('group', { name: 'Har brukeren nedsatt arbeidsevne?' }));
      await velgNeiIGruppe(screen.getByRole('group', { name: 'Er arbeidsevnen nedsatt med minst halvparten?' }));
      await velgBekreft();

      const feilmeldinger = await screen.findAllByText(
        'Du må svare på om den nedsatte arbeidsevnen er nedsatt med minst 30 prosent.'
      );
      expect(feilmeldinger.length).toBe(2);
      expect(feilmeldinger[0]).toBeVisible();
    });
  });
});

describe('vurderinger uten viss varighet', () => {
  it('viser datofelt får når vurderingen gjelder fra', () => {
    render(
      <SykdomsvurderingPeriodisert
        grunnlag={grunnlagUtenYrkesskade}
        readOnly={false}
        behandlingVersjon={0}
        typeBehandling={'Revurdering'}
      />
    );

    expect(screen.getByRole('textbox', { name: 'Vurderingen gjelder fra' })).toBeVisible();
  });

  it('viser feilmelding dersom dato for når vurderingen gjelder fra er før søknadstidspunkt', async () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    customRenderWithSøknadstidspunkt(
      <SykdomsvurderingPeriodisert
        grunnlag={grunnlagMedYrkesskade}
        readOnly={false}
        behandlingVersjon={0}
        typeBehandling={'Førstegangsbehandling'}
        initialMellomlagretVurdering={undefined}
      />,
      today
    );
    const vurderingFraDato = format(subDays(new Date(), 7), 'dd.MM.yyyy');
    await skrivInnDatoForNårVurderingenGjelderFra(vurderingFraDato);
    await user.type(
      screen.getByRole('textbox', { name: 'Vilkårsvurdering' }),
      'Her har jeg begynt å skrive en vurdering..'
    );
    const neiValg = within(screen.getByRole('group', { name: 'Har brukeren sykdom, skade eller lyte?' })).getByRole(
      'radio',
      {
        name: 'Nei',
      }
    );
    await user.click(neiValg);

    await velgBekreft();

    const feilmeldinger = screen.getAllByText(/Vurderingene du har laget starter før perioden du kan vurdere/i);
    await expect(feilmeldinger.length).toBe(2);
    await expect(feilmeldinger[0]).toBeVisible();
  });

  it('viser ikke feilmelding når dato for vurderingen er etter søknadstidspunkt', async () => {
    customRenderWithSøknadstidspunkt(
      <SykdomsvurderingPeriodisert
        grunnlag={grunnlagUtenYrkesskade}
        readOnly={false}
        behandlingVersjon={0}
        typeBehandling={'Revurdering'}
      />,
      format(subDays(new Date(), 4), 'yyyy-MM-dd')
    );

    const datofelt = screen.getByRole('textbox', { name: 'Vurderingen gjelder fra' });
    const datoForVurderingInput = format(new Date(), 'ddMMyy');
    await user.type(datofelt, datoForVurderingInput);
    await velgBekreft();
    expect(screen.queryByText('Vurderingen kan ikke gjelde fra før starttidspunktet')).not.toBeInTheDocument();
  });

  it('viser ikke feilmelding når dato for vurderingen er lik søknadstidspunkt', async () => {
    const søknadstidspunkt = subDays(new Date(), 4);
    customRenderWithSøknadstidspunkt(
      <SykdomsvurderingPeriodisert
        grunnlag={grunnlagUtenYrkesskade}
        readOnly={false}
        behandlingVersjon={0}
        typeBehandling={'Revurdering'}
      />,
      format(søknadstidspunkt, 'yyyy-MM-dd')
    );

    const datofelt = screen.getByRole('textbox', { name: 'Vurderingen gjelder fra' });
    const datoForVurderingInput = format(søknadstidspunkt, 'ddMMyy');
    await user.type(datofelt, datoForVurderingInput);
    await velgBekreft();
    expect(screen.queryByText('Vurderingen kan ikke gjelde fra før starttidspunktet')).not.toBeInTheDocument();
  });

  it('viser spørsmål om den nedsatte arbeidsevnen er minst 40 prosent når det ikke skal vurderes mot yrkesskade', async () => {
    const søknadstidspunkt = subDays(new Date(), 14);
    customRenderWithSøknadstidspunkt(
      <SykdomsvurderingPeriodisert
        grunnlag={grunnlagUtenYrkesskade}
        readOnly={false}
        behandlingVersjon={0}
        typeBehandling={'Revurdering'}
      />,
      format(søknadstidspunkt, 'yyyy-MM-dd')
    );
    await skrivInnDatoForNårVurderingenGjelderFra(format(addDays(new Date(), 10), 'ddMMyy'));
    await velgAtBrukerHarSykdomSkadeLyte();
    await velgAtBrukerHarNedsattArbeidsevne();
    expect(screen.getByRole('group', { name: 'Er arbeidsevnen nedsatt med minst 40 prosent?' })).toBeVisible();
    expect(
      screen.queryByRole('group', { name: 'Er arbeidsevnen nedsatt med minst 30 prosent?' })
    ).not.toBeInTheDocument();
  });

  it('viser spørsmål om den nedsatte arbeidsevnen er minst 30 prosent når det skal vurderes mot yrkesskade', async () => {
    const søknadstidspunkt = subDays(new Date(), 14);
    const grunnlagMedYrkesskadeOgÅrsakssammenheng: SykdomsGrunnlag = {
      behøverVurderinger: [],
      kanVurderes: [{ fom: formaterDatoForBackend(søknadstidspunkt), tom: '' }],
      nyeVurderinger: [],
      sisteVedtatteVurderinger: [],
      perioderSomIkkeErTilstrekkeligVurdert: [],
      harTilgangTilÅSaksbehandle: true,
      skalVurdereYrkesskade: true,
      erÅrsakssammenhengYrkesskade: true,
      opplysninger: { innhentedeYrkesskader: [], oppgittYrkesskadeISøknad: true },
      gjeldendeVedtatteSykdomsvurderinger: [],
      sykdomsvurderinger: [],
      historikkSykdomsvurderinger: [],
    };

    customRenderWithSøknadstidspunkt(
      <SykdomsvurderingPeriodisert
        grunnlag={grunnlagMedYrkesskadeOgÅrsakssammenheng}
        readOnly={false}
        behandlingVersjon={0}
        typeBehandling={'Revurdering'}
      />,
      format(søknadstidspunkt, 'yyyy-MM-dd')
    );
    await skrivInnDatoForNårVurderingenGjelderFra(format(new Date(), 'ddMMyy'));
    await velgAtBrukerHarSykdomSkadeLyte();
    await velgAtBrukerHarNedsattArbeidsevne();
    expect(
      screen.queryByRole('group', { name: 'Er arbeidsevnen nedsatt med minst 40 prosent?' })
    ).not.toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Er arbeidsevnen nedsatt med minst 30 prosent?' })).toBeVisible();
  });

  it('viser ikke felt for en viss varighet når det gjøres en revurdering', async () => {
    const søknadstidspunkt = subDays(new Date(), 14);
    customRenderWithSøknadstidspunkt(
      <SykdomsvurderingPeriodisert
        grunnlag={grunnlagUtenYrkesskade}
        readOnly={false}
        behandlingVersjon={0}
        typeBehandling={'Revurdering'}
      />,
      format(søknadstidspunkt, 'yyyy-MM-dd')
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

describe('mellomlagring i sykdom', () => {
  const mellomlagring: MellomlagretVurderingResponse = {
    mellomlagretVurdering: {
      avklaringsbehovkode: '5006',
      behandlingId: { id: 1 },
      data: '{"vurderinger": [{"begrunnelse":"Dette er min vurdering som er mellomlagret","erBehovForAktivBehandling":"ja","erBehovForArbeidsrettetTiltak":"ja"}]}',
      vurdertDato: '2025-08-21T12:00:00.000',
      vurdertAv: 'Jan T. Loven',
    },
  };

  const sykdomsvurdering: Sykdomvurdering = {
    fom: '2025-01-01',
    begrunnelse: 'Dette er min vurdering som er bekreftet',
    dokumenterBruktIVurdering: [],
    harSkadeSykdomEllerLyte: false,
    vurdertAv: { ident: '1234', dato: '2025-01-01' },
  };

  const sykdomsGrunnlagMedVurdering: SykdomsGrunnlag = {
    behøverVurderinger: [],
    kanVurderes: [],
    nyeVurderinger: [sykdomsvurdering],
    sisteVedtatteVurderinger: [],
    perioderSomIkkeErTilstrekkeligVurdert: [],
    gjeldendeVedtatteSykdomsvurderinger: [],
    harTilgangTilÅSaksbehandle: false,
    historikkSykdomsvurderinger: [],
    opplysninger: { innhentedeYrkesskader: [], oppgittYrkesskadeISøknad: false },
    skalVurdereYrkesskade: false,
    erÅrsakssammenhengYrkesskade: false,
    sykdomsvurderinger: [sykdomsvurdering],
  };

  const sykdomsGrunnlagUtenVurdering: SykdomsGrunnlag = {
    behøverVurderinger: [],
    kanVurderes: [{ fom: new Dato(new Date()).formaterForBackend(), tom: '2099-01-01' }],
    nyeVurderinger: [],
    sisteVedtatteVurderinger: [],
    perioderSomIkkeErTilstrekkeligVurdert: [],
    gjeldendeVedtatteSykdomsvurderinger: [],
    harTilgangTilÅSaksbehandle: false,
    historikkSykdomsvurderinger: [],
    opplysninger: { innhentedeYrkesskader: [], oppgittYrkesskadeISøknad: false },
    skalVurdereYrkesskade: false,
    erÅrsakssammenhengYrkesskade: false,
    sykdomsvurderinger: [],
  };

  it('Skal vise en tekst om hvem som har gjort vurderingen dersom det finnes en mellomlagring', () => {
    render(
      <SykdomsvurderingPeriodisert
        grunnlag={sykdomsGrunnlagUtenVurdering}
        readOnly={false}
        behandlingVersjon={0}
        typeBehandling={'Førstegangsbehandling'}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
      />
    );
    const tekst = screen.getByText('Utkast lagret 21.08.2025 12:00 (Jan T. Loven)');
    expect(tekst).toBeVisible();
  });

  it('Skal vise en tekst om hvem som har lagret vurdering dersom bruker trykker på lagre mellomlagring', async () => {
    render(
      <SykdomsvurderingPeriodisert
        readOnly={false}
        behandlingVersjon={0}
        typeBehandling={'Førstegangsbehandling'}
        grunnlag={sykdomsGrunnlagUtenVurdering}
      />
    );

    await user.type(
      screen.getByRole('textbox', { name: 'Vilkårsvurdering' }),
      'Her har jeg begynt å skrive en vurdering..'
    );
    expect(screen.queryByText('Utkast lagret 21.08.2025 12:00 (Jan T. Loven)')).not.toBeInTheDocument();

    const mockFetchResponseLagreMellomlagring: FetchResponse<MellomlagretVurderingResponse> = {
      type: 'SUCCESS',
      data: mellomlagring,
      status: 200,
    };
    fetchMock.mockResponse(JSON.stringify(mockFetchResponseLagreMellomlagring));

    const lagreKnapp = screen.getByRole('button', { name: 'Lagre utkast' });
    await user.click(lagreKnapp);
    const tekst = screen.getByText('Utkast lagret 21.08.2025 12:00 (Jan T. Loven)');
    expect(tekst).toBeVisible();
  });

  it('Skal ikke vise en tekst om hvem som har gjort mellomlagring dersom bruker trykker på slett mellomlagring', async () => {
    render(
      <SykdomsvurderingPeriodisert
        readOnly={false}
        behandlingVersjon={0}
        grunnlag={sykdomsGrunnlagUtenVurdering}
        typeBehandling={'Førstegangsbehandling'}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
      />
    );

    expect(screen.getByText('Utkast lagret 21.08.2025 12:00 (Jan T. Loven)')).toBeVisible();

    const mockFetchResponseSlettMellomlagring: FetchResponse<object> = { type: 'SUCCESS', status: 202, data: {} };
    fetchMock.mockResponse(JSON.stringify(mockFetchResponseSlettMellomlagring));

    const slettKnapp = screen.getByRole('button', { name: 'Slett utkast' });
    await user.click(slettKnapp);

    expect(screen.queryByText('Utkast lagret 21.08.2025 12:00 (Jan T. Loven)')).not.toBeInTheDocument();
  });

  it('Skal bruke mellomlagring som defaultValue i skjema dersom det finnes', () => {
    render(
      <SykdomsvurderingPeriodisert
        grunnlag={sykdomsGrunnlagMedVurdering}
        readOnly={false}
        behandlingVersjon={0}
        typeBehandling={'Førstegangsbehandling'}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
      />
    );
    const begrunnelseFelt = screen.getByRole('textbox', {
      name: /vilkårsvurdering/i,
    });

    expect(begrunnelseFelt).toHaveValue('Dette er min vurdering som er mellomlagret');
  });

  it('Skal bruke bekreftet vurdering fra grunnlag som defaultValue i skjema dersom mellomlagring ikke finnes', () => {
    render(
      <SykdomsvurderingPeriodisert
        grunnlag={sykdomsGrunnlagMedVurdering}
        readOnly={false}
        behandlingVersjon={0}
        typeBehandling={'Førstegangsbehandling'}
      />
    );
    const begrunnelseFelt = screen.getByRole('textbox', {
      name: /vilkårsvurdering/i,
    });

    expect(begrunnelseFelt).toHaveValue('Dette er min vurdering som er bekreftet');
  });

  it('Skal resette skjema til tomt skjema dersom det ikke finnes en bekreftet vurdering og bruker sletter mellomlagring', async () => {
    render(
      <SykdomsvurderingPeriodisert
        readOnly={false}
        grunnlag={sykdomsGrunnlagUtenVurdering}
        behandlingVersjon={0}
        typeBehandling={'Førstegangsbehandling'}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
      />
    );
    await user.type(screen.getByRole('textbox', { name: 'Vilkårsvurdering' }), ' her er ekstra tekst');

    expect(screen.getByRole('textbox', { name: 'Vilkårsvurdering' })).toHaveValue(
      'Dette er min vurdering som er mellomlagret her er ekstra tekst'
    );

    const mockFetchResponseSlettMellomlagring: FetchResponse<object> = { type: 'SUCCESS', status: 202, data: {} };
    fetchMock.mockResponse(JSON.stringify(mockFetchResponseSlettMellomlagring));

    const slettKnapp = screen.getByRole('button', { name: 'Slett utkast' });

    await user.click(slettKnapp);

    expect(screen.getByRole('textbox', { name: 'Vilkårsvurdering' })).toHaveValue('');
  });

  it('Skal resette skjema til bekreftet vurdering dersom det finnes en bekreftet vurdering og bruker sletter mellomlagring', async () => {
    render(
      <SykdomsvurderingPeriodisert
        grunnlag={sykdomsGrunnlagMedVurdering}
        readOnly={false}
        behandlingVersjon={0}
        typeBehandling={'Førstegangsbehandling'}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
      />
    );
    await user.type(screen.getByRole('textbox', { name: 'Vilkårsvurdering' }), ' her er ekstra tekst');

    expect(screen.getByRole('textbox', { name: 'Vilkårsvurdering' })).toHaveValue(
      'Dette er min vurdering som er mellomlagret her er ekstra tekst'
    );
    const mockFetchResponseSlettMellomlagring: FetchResponse<object> = { type: 'SUCCESS', status: 202, data: {} };
    fetchMock.mockResponse(JSON.stringify(mockFetchResponseSlettMellomlagring));

    const slettKnapp = screen.getByRole('button', { name: 'Slett utkast' });

    await user.click(slettKnapp);

    expect(screen.getByRole('textbox', { name: 'Vilkårsvurdering' })).toHaveValue(
      'Dette er min vurdering som er bekreftet'
    );
  });

  it('Skal ikke være mulig å lagre eller slette mellomlagring hvis det er readOnly', () => {
    render(
      <SykdomsvurderingPeriodisert
        grunnlag={sykdomsGrunnlagMedVurdering}
        readOnly={true}
        behandlingVersjon={0}
        typeBehandling={'Førstegangsbehandling'}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
      />
    );

    const lagreKnapp = screen.queryByRole('button', { name: 'Lagre utkast' });
    expect(lagreKnapp).not.toBeInTheDocument();
    const slettKnapp = screen.queryByRole('button', { name: 'Slett utkast' });
    expect(slettKnapp).not.toBeInTheDocument();
  });

  it('Skal støtte å bruke gammelt format på mellomlagret data', () => {
    const dataGammel: Partial<SykdomsvurderingFormFields> = {
      begrunnelse: 'Dette er en gammel mellomlagret begrunnelse',
    };

    const mellomlagringGammel: MellomlagretVurderingResponse = {
      mellomlagretVurdering: {
        avklaringsbehovkode: '5003',
        behandlingId: { id: 1 },
        data: JSON.stringify(dataGammel),
        vurdertDato: '2025-08-21T12:00:00.000',
        vurdertAv: 'Jan T. Loven',
      },
    };

    render(
      <SykdomsvurderingPeriodisert
        typeBehandling={'Førstegangsbehandling'}
        behandlingVersjon={0}
        readOnly={false}
        grunnlag={sykdomsGrunnlagUtenVurdering}
        initialMellomlagretVurdering={mellomlagringGammel.mellomlagretVurdering}
      />
    );

    const begrunnelseFelt = screen.getByRole('textbox', {
      name: /vilkårsvurdering/i,
    });

    expect(begrunnelseFelt).toHaveValue(dataGammel.begrunnelse);
  });
});

const velgBekreft = async () => {
  const button = screen.getByRole('button', { name: 'Bekreft' });
  await user.click(button);
};

const velgAtBrukerHarSykdomSkadeLyte = async () => {
  const jaValg = within(screen.getByRole('group', { name: 'Har brukeren sykdom, skade eller lyte?' })).getByRole(
    'radio',
    {
      name: 'Ja',
    }
  );
  await user.click(jaValg);
};

const velgAtBrukerHarNedsattArbeidsevne = async () =>
  await velgJaIGruppe(screen.getByRole('group', { name: 'Har brukeren nedsatt arbeidsevne?' }));

const skrivInnDatoForNårVurderingenGjelderFra = async (dato: string) => {
  const datofelt = screen.getByRole('textbox', { name: 'Vurderingen gjelder fra' });
  await user.clear(datofelt);
  await user.type(datofelt, dato);
};

const velgNeiIGruppe = async (gruppe: HTMLElement): Promise<void> =>
  await user.click(within(gruppe).getByRole('radio', { name: 'Nei' }));

const velgJaIGruppe = async (gruppe: HTMLElement): Promise<void> =>
  await user.click(within(gruppe).getByRole('radio', { name: 'Ja' }));
