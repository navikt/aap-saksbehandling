import { describe, expect, it, vi } from 'vitest';
import { render, screen, within } from 'lib/test/CustomRender';
import { userEvent } from '@testing-library/user-event';
import { Bistandsbehov } from 'components/behandlinger/sykdom/bistandsbehov/Bistandsbehov';
import { BistandsGrunnlag, MellomlagredeVurderingResponse } from 'lib/types/types';
import createFetchMock from 'vitest-fetch-mock';
import { FetchResponse } from 'lib/utils/api';

const fetchMock = createFetchMock(vi);
fetchMock.enableMocks();
const user = userEvent.setup();

describe('Generelt', () => {
  it('Skal ha en overskrift', () => {
    render(<Bistandsbehov readOnly={false} behandlingVersjon={0} typeBehandling={'Førstegangsbehandling'} />);

    const heading = screen.getByText('§ 11-6 Behov for bistand til å skaffe seg eller beholde arbeid');
    expect(heading).toBeVisible();
  });
});

describe('mellomlagring i bistandsbehov', () => {
  const mellomlagring: MellomlagredeVurderingResponse = {
    mellomlagretVurdering: {
      avklaringsbehovkode: '5006',
      behandlingId: { id: 1 },
      data: '{"begrunnelse":"Dette er min vurdering som er mellomlagret","erBehovForAktivBehandling":"ja","erBehovForArbeidsrettetTiltak":"ja"}',
      vurdertAv: 'Saksbehandler',
      vurdertDato: '2025-08-19',
    },
  };

  const bistandsgrunnlag: BistandsGrunnlag = {
    vurdering: {
      begrunnelse: 'Dette er min vurdering som er bekreftet',
      erBehovForAktivBehandling: true,
      erBehovForArbeidsrettetTiltak: true,
      vurdertAv: { ident: 'TESTER', dato: '2025-08-19' },
    },
    gjeldendeSykdsomsvurderinger: [],
    gjeldendeVedtatteVurderinger: [],
    harTilgangTilÅSaksbehandle: true,
    historiskeVurderinger: [],
  };

  it('Skal vise et varsel dersom det finnes en mellomlagring på vurderingen', () => {
    render(
      <Bistandsbehov
        readOnly={false}
        behandlingVersjon={0}
        typeBehandling={'Førstegangsbehandling'}
        mellomlagredeVurdering={mellomlagring.mellomlagretVurdering}
      />
    );
    const mellomlagringWarning = screen.getByText('Det finnes en mellomlagring');
    expect(mellomlagringWarning).toBeVisible();
  });

  it('Skal ikke vise et varsel dersom det ikke finnes en mellomlagring på vurderingen', () => {
    render(<Bistandsbehov behandlingVersjon={0} readOnly={false} typeBehandling={'Førstegangsbehandling'} />);
    const mellomlagringWarning = screen.queryByText('Det finnes en mellomlagring');
    expect(mellomlagringWarning).not.toBeInTheDocument();
  });

  it('Skal vise et varsel dersom bruker trykker på lagre mellomlagring', async () => {
    render(<Bistandsbehov behandlingVersjon={0} readOnly={false} typeBehandling={'Førstegangsbehandling'} />);

    await user.type(
      screen.getByRole('textbox', { name: 'Vilkårsvurdering' }),
      'Her har jeg begynt å skrive en vurdering..'
    );

    expect(screen.queryByText('Det finnes en mellomlagring')).not.toBeInTheDocument();

    const mockFetchResponseLagreMellomlagring: FetchResponse<MellomlagredeVurderingResponse> = {
      type: 'SUCCESS',
      data: mellomlagring,
      status: 200,
    };
    fetchMock.mockResponse(JSON.stringify(mockFetchResponseLagreMellomlagring));

    const lagreKnapp = screen.getByRole('button', { name: 'Lagre' });
    await user.click(lagreKnapp);

    expect(screen.getByText('Det finnes en mellomlagring')).toBeVisible();
  });

  it('Skal ikke vise et varsel dersom bruker trykker på slett mellomlagring', async () => {
    render(
      <Bistandsbehov
        behandlingVersjon={0}
        readOnly={false}
        typeBehandling={'Førstegangsbehandling'}
        mellomlagredeVurdering={mellomlagring.mellomlagretVurdering}
      />
    );

    expect(screen.getByText('Det finnes en mellomlagring')).toBeVisible();

    const mockFetchResponseSlettMellomlagring: FetchResponse<object> = { type: 'SUCCESS', status: 202, data: {} };
    fetchMock.mockResponse(JSON.stringify(mockFetchResponseSlettMellomlagring));

    const slettKnapp = screen.getByRole('button', { name: 'Slett' });
    await user.click(slettKnapp);

    expect(screen.queryByText('Det finnes en mellomlagring')).not.toBeInTheDocument();
  });

  it('Skal bruke mellomlagring som defaultValue i skjema dersom det finnes', () => {
    render(
      <Bistandsbehov
        behandlingVersjon={0}
        readOnly={false}
        typeBehandling={'Førstegangsbehandling'}
        grunnlag={bistandsgrunnlag}
        mellomlagredeVurdering={mellomlagring.mellomlagretVurdering}
      />
    );

    const begrunnelseFelt = screen.getByRole('textbox', {
      name: /vilkårsvurdering/i,
    });

    expect(begrunnelseFelt).toHaveValue('Dette er min vurdering som er mellomlagret');
  });

  it('Skal bruke bekreftet vurdering fra grunnlag som defaultValue i skjema dersom mellomlagring ikke finnes', () => {
    render(
      <Bistandsbehov
        behandlingVersjon={0}
        readOnly={false}
        typeBehandling={'Førstegangsbehandling'}
        grunnlag={bistandsgrunnlag}
      />
    );

    const begrunnelseFelt = screen.getByRole('textbox', {
      name: /vilkårsvurdering/i,
    });

    expect(begrunnelseFelt).toHaveValue('Dette er min vurdering som er bekreftet');
  });

  it('Skal resette skjema til tomt skjema dersom det ikke finnes en bekreftet vurdering og bruker sletter mellomlagring', async () => {
    render(
      <Bistandsbehov
        behandlingVersjon={0}
        readOnly={false}
        typeBehandling={'Førstegangsbehandling'}
        mellomlagredeVurdering={mellomlagring.mellomlagretVurdering}
      />
    );

    await user.type(screen.getByRole('textbox', { name: 'Vilkårsvurdering' }), ' her er ekstra tekst');

    expect(screen.getByRole('textbox', { name: 'Vilkårsvurdering' })).toHaveValue(
      'Dette er min vurdering som er mellomlagret her er ekstra tekst'
    );

    const slettKnapp = screen.getByRole('button', { name: 'Slett' });

    await user.click(slettKnapp);

    expect(screen.getByRole('textbox', { name: 'Vilkårsvurdering' })).toHaveValue('');
  });

  it('Skal resette skjema til bekreftet vurdering dersom det finnes en bekreftet vurdering og bruker sletter mellomlagring', async () => {
    render(
      <Bistandsbehov
        behandlingVersjon={0}
        readOnly={false}
        typeBehandling={'Førstegangsbehandling'}
        mellomlagredeVurdering={mellomlagring.mellomlagretVurdering}
        grunnlag={bistandsgrunnlag}
      />
    );

    await user.type(screen.getByRole('textbox', { name: 'Vilkårsvurdering' }), ' her er ekstra tekst');

    expect(screen.getByRole('textbox', { name: 'Vilkårsvurdering' })).toHaveValue(
      'Dette er min vurdering som er mellomlagret her er ekstra tekst'
    );

    const slettKnapp = screen.getByRole('button', { name: 'Slett' });

    await user.click(slettKnapp);

    expect(screen.getByRole('textbox', { name: 'Vilkårsvurdering' })).toHaveValue(
      'Dette er min vurdering som er bekreftet'
    );
  });
});

describe('Førstegangsbehandling', () => {
  it('Skal ha felt for begrunnelse', () => {
    render(<Bistandsbehov readOnly={false} behandlingVersjon={0} typeBehandling={'Førstegangsbehandling'} />);
    const begrunnelse = screen.getByRole('textbox', { name: 'Vilkårsvurdering' });
    expect(begrunnelse).toBeVisible();
  });

  it('Skal ha felt for om brukeren har behov for aktiv behandling', () => {
    render(<Bistandsbehov readOnly={false} behandlingVersjon={0} typeBehandling={'Førstegangsbehandling'} />);
    const felt = screen.getByRole('group', {
      name: 'a: Har brukeren behov for aktiv behandling?',
    });
    expect(felt).toBeVisible();
  });

  it('Skal ha felt for om brukeren har behov for arbeidsrettet tiltak', () => {
    render(<Bistandsbehov readOnly={false} behandlingVersjon={0} typeBehandling={'Førstegangsbehandling'} />);
    const felt = screen.getByRole('group', { name: 'b: Har brukeren behov for arbeidsrettet tiltak?' });
    expect(felt).toBeVisible();
  });

  it('har felt for om brukeren anses for å ha en viss mulighet til å komme i arbeid', async () => {
    render(<Bistandsbehov readOnly={false} behandlingVersjon={0} typeBehandling={'Førstegangsbehandling'} />);
    expect(
      screen.queryByRole('group', {
        name: 'c: Kan brukeren anses for å ha en viss mulighet for å komme i arbeid, ved å få annen oppfølging fra Nav?',
      })
    ).toBeVisible();
  });

  it('skjuler felt for om brukeren anses for å ha en viss mulighet til å komme i arbeid dersom a er besvart med ja', async () => {
    render(<Bistandsbehov readOnly={false} behandlingVersjon={0} typeBehandling={'Førstegangsbehandling'} />);

    expect(finnGruppeForBokstavC()).toBeVisible();

    await velgJa(finnGruppeForBokstavA());
    expect(finnGruppeForBokstavC()).not.toBeInTheDocument();
  });

  it('skjuler felt for om brukeren anses for å ha en viss mulighet til å komme i arbeid dersom b er besvart med nei', async () => {
    render(<Bistandsbehov readOnly={false} behandlingVersjon={0} typeBehandling={'Førstegangsbehandling'} />);

    expect(finnGruppeForBokstavC()).toBeVisible();

    await velgJa(finnGruppeForBokstavB());
    expect(finnGruppeForBokstavC()).not.toBeInTheDocument();
  });

  it('skjuler felt for om brukeren anses for å ha en viss mulighet til å komme i arbeid dersom både a og b er besvart med ja', async () => {
    render(<Bistandsbehov readOnly={false} behandlingVersjon={0} typeBehandling={'Førstegangsbehandling'} />);

    expect(finnGruppeForBokstavC()).toBeVisible();

    await velgJa(finnGruppeForBokstavA());
    await velgJa(finnGruppeForBokstavB());

    expect(finnGruppeForBokstavC()).not.toBeInTheDocument();
  });

  it('viser felt for om brukeren anses for å ha en viss mulighet til å komme i arbeid dersom a og b er besvart med nei', async () => {
    render(<Bistandsbehov readOnly={false} behandlingVersjon={0} typeBehandling={'Førstegangsbehandling'} />);
    await velgNei(finnGruppeForBokstavA());
    await velgNei(finnGruppeForBokstavB());

    expect(finnGruppeForBokstavC()).toBeVisible();
  });

  it('felt for når vurderingen gjelder fra vises ikke dersom det ikke er en revurdering', () => {
    render(<Bistandsbehov readOnly={false} behandlingVersjon={0} typeBehandling="Førstegangsbehandling" />);
    expect(screen.queryByRole('textbox', { name: 'Vurderingen gjelder fra' })).not.toBeInTheDocument();
  });

  /* TODO skippes inntil backend er klar */
  it.skip('viser felt for når vurderingen gjelder fra dersom det er en revurdering', () => {
    render(<Bistandsbehov readOnly={false} behandlingVersjon={0} typeBehandling="Revurdering" />);
    expect(screen.getByRole('textbox', { name: 'Vurderingen gjelder fra' })).toBeVisible();
  });

  it('viser spørsmål om brukeren skal vurderes for AAP i overgang til uføre hvis det svares nei på a,b og c', async () => {
    render(<Bistandsbehov readOnly={false} behandlingVersjon={0} typeBehandling={'Førstegangsbehandling'} />);
    await velgNei(finnGruppeForBokstavA());
    await velgNei(finnGruppeForBokstavB());
    const gruppeC = screen.getByRole('group', {
      name: 'c: Kan brukeren anses for å ha en viss mulighet for å komme i arbeid, ved å få annen oppfølging fra Nav?',
    });
    await velgNei(gruppeC);
    expect(
      screen.getByRole('heading', {
        name: '§ 11-18 Arbeidsavklaringspenger under behandling av krav om uføretrygd',
        level: 3,
      })
    ).toBeVisible();
    expect(
      await screen.findByRole('group', {
        name: 'Har brukeren rett til AAP under behandling av krav om uføretrygd?',
      })
    ).toBeVisible();
  });

  /* TODO Skippes inntil backend er klar. Mangler å avgjøre hvordan steget skal vite om 11-5 er oppfylt eller ei */
  it.skip('viser spørsmål for om brukeren skal vurderes for AAP i overgang til arbeid hvis det er en revurdering og det er avslag på både 11-5 og 11-6', async () => {
    render(<Bistandsbehov readOnly={false} behandlingVersjon={0} typeBehandling={'Revurdering'} />);
    await velgNei(finnGruppeForBokstavA());
    await velgNei(finnGruppeForBokstavB());
    const gruppeC = screen.getByRole('group', {
      name: 'c: Kan brukeren anses for å ha en viss mulighet for å komme i arbeid, ved å få annen oppfølging fra Nav?',
    });
    await velgNei(gruppeC);
    expect(screen.getByRole('heading', { name: '§ 11-17 AAP i perioden som arbeidssøker', level: 3 })).toBeVisible();
    expect(screen.getByRole('group', { name: 'Har brukeren rett til AAP i perioden som arbeidssøker?' })).toBeVisible();
  });

  it('Skal vise feilmelding dersom feltet for begrunnelse ikke er besvart', async () => {
    render(<Bistandsbehov readOnly={false} behandlingVersjon={0} typeBehandling={'Førstegangsbehandling'} />);

    await trykkPåBekreft();
    const feilmelding = screen.getByText('Du må gi en begrunnelse om brukeren har behov for oppfølging');
    expect(feilmelding).toBeVisible();
  });

  it('Skal vise feilmelding dersom feltet om brukeren har behov for aktiv behandling ikke er besvart', async () => {
    render(<Bistandsbehov readOnly={false} behandlingVersjon={0} typeBehandling={'Førstegangsbehandling'} />);

    await trykkPåBekreft();
    const feilmelding = screen.getByText('Du må svare på om brukeren har behov for aktiv behandling');
    expect(feilmelding).toBeVisible();
  });

  it('Skal vise feilmelding dersom feltet om brukeren har behov for arbeidsrettet tiltak ikke er besvart', async () => {
    render(<Bistandsbehov readOnly={false} behandlingVersjon={0} typeBehandling={'Førstegangsbehandling'} />);

    await trykkPåBekreft();

    const feilmelding = screen.getByText('Du må svare på om brukeren har behov for arbeidsrettet tiltak');
    expect(feilmelding).toBeVisible();
  });

  it('Skal vise feilmelding dersom feltet om brukeren anses for å ha en viss mulighet for å komme i arbeid ikke er besvart', async () => {
    render(<Bistandsbehov readOnly={false} behandlingVersjon={0} typeBehandling={'Førstegangsbehandling'} />);

    const harInnbyggetBehovForAktivBehandling = screen.getByRole('group', {
      name: 'a: Har brukeren behov for aktiv behandling?',
    });

    const neiFeltHarBrukerBehovForAktivBehandling = within(harInnbyggetBehovForAktivBehandling).getByRole('radio', {
      name: 'Nei',
    });

    await user.click(neiFeltHarBrukerBehovForAktivBehandling);

    const harBrukerBehovForArbeidsrettetTiltakFelt = screen.getByRole('group', {
      name: 'b: Har brukeren behov for arbeidsrettet tiltak?',
    });
    const neiHarBrukerBehovForArbeidsrettetTiltakFelt = within(harBrukerBehovForArbeidsrettetTiltakFelt).getByRole(
      'radio',
      { name: 'Nei' }
    );

    await user.click(neiHarBrukerBehovForArbeidsrettetTiltakFelt);

    await trykkPåBekreft();
    const feilmelding = screen.getByText(
      'Du må svare på om brukeren anses for å ha en viss mulighet til å komme i arbeid'
    );
    expect(feilmelding).toBeVisible();
  });
});

describe('Revurdering', () => {
  const grunnlagRevurdering: BistandsGrunnlag = {
    harTilgangTilÅSaksbehandle: true,
    harOppfylt11_5: true,
    gjeldendeVedtatteVurderinger: [
      {
        begrunnelse: 'En begrunnelse',
        erBehovForArbeidsrettetTiltak: true,
        erBehovForAktivBehandling: false,
        vurdertAv: { ident: 'Saksbehandler', dato: '2025-03-24' },
      },
    ],
    historiskeVurderinger: [
      {
        begrunnelse: 'En begrunnelse',
        erBehovForArbeidsrettetTiltak: true,
        erBehovForAktivBehandling: false,
        vurdertAv: { ident: 'Saksbehandler', dato: '2025-03-24' },
      },
    ],
    gjeldendeSykdsomsvurderinger: [
      {
        begrunnelse: 'blabla',
        dokumenterBruktIVurdering: [],
        erArbeidsevnenNedsatt: true,
        erNedsettelseIArbeidsevneAvEnVissVarighet: true,
        erNedsettelseIArbeidsevneMerEnnHalvparten: true,
        erSkadeSykdomEllerLyteVesentligdel: true,
        harSkadeSykdomEllerLyte: true,
        vurderingenGjelderFra: '2025-03-24',
        vurdertAv: { ident: 'Saksbehandler', dato: '2025-03-24' },
      },
    ],
  };

  it('viser spørsmål om brukeren skal vurderes for AAP i overgang til uføre hvis det svares nei på a,b og c', async () => {
    render(
      <Bistandsbehov
        readOnly={false}
        behandlingVersjon={0}
        typeBehandling={'Revurdering'}
        grunnlag={grunnlagRevurdering}
      />
    );
    await velgNei(finnGruppeForBokstavA());
    await velgNei(finnGruppeForBokstavB());
    const gruppeC = screen.getByRole('group', {
      name: 'c: Kan brukeren anses for å ha en viss mulighet for å komme i arbeid, ved å få annen oppfølging fra Nav?',
    });
    await velgNei(gruppeC);
    expect(
      screen.getByRole('heading', {
        name: '§ 11-18 Arbeidsavklaringspenger under behandling av krav om uføretrygd',
        level: 3,
      })
    ).toBeVisible();
    expect(
      await screen.findByRole('group', {
        name: 'Har brukeren rett til AAP under behandling av krav om uføretrygd?',
      })
    ).toBeVisible();
  });

  it('viser spørsmål om brukeren skal vurders for AAP i overgang til arbeid hvis det er avslag på både 11-5 og det svares nei på a,b og c', async () => {
    const grunnlag = { ...grunnlagRevurdering, harOppfylt11_5: false };
    render(<Bistandsbehov readOnly={false} behandlingVersjon={0} typeBehandling={'Revurdering'} grunnlag={grunnlag} />);
    await velgNei(finnGruppeForBokstavA());
    await velgNei(finnGruppeForBokstavB());
    const gruppeC = screen.getByRole('group', {
      name: 'c: Kan brukeren anses for å ha en viss mulighet for å komme i arbeid, ved å få annen oppfølging fra Nav?',
    });
    await velgNei(gruppeC);

    expect(
      screen.getByRole('heading', { name: '§ 11-17 Arbeidsavklaringspenger i perioden som arbeidssøker', level: 3 })
    ).toBeVisible();
    expect(screen.getAllByRole('textbox', { name: 'Vilkårsvurdering' })).toHaveLength(2);
    expect(
      await screen.findByRole('group', {
        name: 'Har brukeren rett til AAP i perioden som arbeidssøker?',
      })
    ).toBeVisible();
  });

  it('dersom det svares ja på 11-17 skal det vises en melding som sier at dette ikke er klart enda', async () => {
    const grunnlag = { ...grunnlagRevurdering, harOppfylt11_5: false };
    render(<Bistandsbehov readOnly={false} behandlingVersjon={0} typeBehandling={'Revurdering'} grunnlag={grunnlag} />);
    await velgNei(finnGruppeForBokstavA());
    await velgNei(finnGruppeForBokstavB());
    const gruppeC = screen.getByRole('group', {
      name: 'c: Kan brukeren anses for å ha en viss mulighet for å komme i arbeid, ved å få annen oppfølging fra Nav?',
    });
    await velgNei(gruppeC);

    const overgangTilArbeid = screen.getByRole('group', {
      name: 'Har brukeren rett til AAP i perioden som arbeidssøker?',
    });

    await velgJa(overgangTilArbeid);
    expect(
      screen.getByText('Sett saken på vent og meld i fra til Team AAP at du har fått en § 11-17-sak.')
    ).toBeVisible();
  });

  it('viser en melding ved forsøk på å sende inn når det er svart ja på 11-17', async () => {
    const grunnlag = { ...grunnlagRevurdering, harOppfylt11_5: false };
    render(<Bistandsbehov readOnly={false} behandlingVersjon={0} typeBehandling={'Revurdering'} grunnlag={grunnlag} />);
    await velgNei(finnGruppeForBokstavA());
    await velgNei(finnGruppeForBokstavB());
    const gruppeC = screen.getByRole('group', {
      name: 'c: Kan brukeren anses for å ha en viss mulighet for å komme i arbeid, ved å få annen oppfølging fra Nav?',
    });
    await velgNei(gruppeC);

    const overgangTilArbeid = screen.getByRole('group', {
      name: 'Har brukeren rett til AAP i perioden som arbeidssøker?',
    });

    await velgJa(overgangTilArbeid);
    await trykkPåBekreft();
    expect(screen.getByText('AAP i overgang til arbeid er ikke støttet enda')).toBeVisible();
  });

  it('dersom det svares ja på 11-18 skal det vises en melding som sier at dette ikke er klart enda', async () => {
    render(
      <Bistandsbehov
        readOnly={false}
        behandlingVersjon={0}
        typeBehandling={'Revurdering'}
        grunnlag={grunnlagRevurdering}
      />
    );
    await velgNei(finnGruppeForBokstavA());
    await velgNei(finnGruppeForBokstavB());
    const gruppeC = screen.getByRole('group', {
      name: 'c: Kan brukeren anses for å ha en viss mulighet for å komme i arbeid, ved å få annen oppfølging fra Nav?',
    });
    await velgNei(gruppeC);
    const overgangTilUføre = screen.getByRole('group', {
      name: 'Har brukeren rett til AAP under behandling av krav om uføretrygd?',
    });
    await velgJa(overgangTilUføre);
    expect(
      screen.getByText('Sett saken på vent og meld i fra til Team AAP at du har fått en § 11-18-sak.')
    ).toBeVisible();
  });

  it('viser en feilmelding ved forsøk på å sende inn når det er svart ja på 11-18', async () => {
    render(
      <Bistandsbehov
        readOnly={false}
        behandlingVersjon={0}
        typeBehandling={'Revurdering'}
        grunnlag={grunnlagRevurdering}
      />
    );
    await velgNei(finnGruppeForBokstavA());
    await velgNei(finnGruppeForBokstavB());
    const gruppeC = screen.getByRole('group', {
      name: 'c: Kan brukeren anses for å ha en viss mulighet for å komme i arbeid, ved å få annen oppfølging fra Nav?',
    });
    await velgNei(gruppeC);
    const overgangTilUføre = screen.getByRole('group', {
      name: 'Har brukeren rett til AAP under behandling av krav om uføretrygd?',
    });
    await velgJa(overgangTilUføre);
    await trykkPåBekreft();
    expect(screen.getByText('AAP under behandling av søknad om uføretrygd er ikke støttet enda')).toBeVisible();
  });
});

const trykkPåBekreft = async () => await user.click(screen.getByRole('button', { name: 'Bekreft' }));
const finnGruppeForBokstavA = () => screen.getByRole('group', { name: 'a: Har brukeren behov for aktiv behandling?' });
const finnGruppeForBokstavB = () =>
  screen.getByRole('group', { name: 'b: Har brukeren behov for arbeidsrettet tiltak?' });
const finnGruppeForBokstavC = () =>
  screen.queryByRole('group', {
    name: 'c: Kan brukeren anses for å ha en viss mulighet for å komme i arbeid, ved å få annen oppfølging fra Nav?',
  });

const velgJa = async (group: HTMLElement) => {
  await user.click(within(group).getByRole('radio', { name: 'Ja' }));
};

const velgNei = async (group: HTMLElement) => {
  await user.click(within(group).getByRole('radio', { name: 'Nei' }));
};
