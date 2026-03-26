import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, within } from 'lib/test/CustomRender';
import { userEvent } from '@testing-library/user-event';
import { MellomlagretVurderingResponse, VedtakslengdeGrunnlag } from 'lib/types/types';
import createFetchMock from 'vitest-fetch-mock';
import { FetchResponse } from 'lib/utils/api';
import { defaultFlytResponse, setMockFlytResponse } from 'vitestSetup';
import { VedtakslengdeSteg } from 'components/behandlinger/vedtakslengde/VedtakslengdeSteg';
import { Behovstype } from 'lib/utils/form';

const fetchMock = createFetchMock(vi);
fetchMock.enableMocks();
const user = userEvent.setup();

beforeEach(() => {
  setMockFlytResponse({ ...defaultFlytResponse, aktivtSteg: 'FASTSETT_VEDTAKSLENGDE' });
});

const grunnlagTomt: VedtakslengdeGrunnlag = {
  ikkeRelevantePerioder: [],
  nyeVurderinger: [],
  kanVurderes: [
    {
      fom: '2025-10-10',
      tom: '2030-10-10',
    },
  ],
  sisteVedtatteVurderinger: [],
  behøverVurderinger: [
    {
      fom: '2025-10-10',
      tom: '2030-10-10',
    },
  ],
  harTilgangTilÅSaksbehandle: true,
};

const grunnlagMedAutomatiskVurdering: VedtakslengdeGrunnlag = {
  ikkeRelevantePerioder: [],
  nyeVurderinger: [
    {
      fom: '2025-10-10',
      tom: '2026-10-10',
      sluttdato: '2026-10-10',
      begrunnelse: 'Automatisk fastsatt vedtakslengde',
      manuellVurdering: false,
      utvidetMed: 'FØRSTE_ÅR',
    },
  ],
  kanVurderes: [
    {
      fom: '2025-10-10',
      tom: '2030-10-10',
    },
  ],
  sisteVedtatteVurderinger: [],
  behøverVurderinger: [],
  harTilgangTilÅSaksbehandle: true,
};

const grunnlagMedManuellVurdering: VedtakslengdeGrunnlag = {
  ikkeRelevantePerioder: [],
  nyeVurderinger: [
    {
      fom: '2025-10-10',
      tom: '2026-10-10',
      sluttdato: '2026-10-10',
      begrunnelse: 'Automatisk fastsatt vedtakslengde',
      manuellVurdering: false,
      utvidetMed: 'FØRSTE_ÅR',
    },
    {
      fom: '2026-10-11',
      tom: '2027-04-10',
      sluttdato: '2027-04-10',
      begrunnelse: 'Manuell forlengelse begrunnelse',
      manuellVurdering: true,
      utvidetMed: 'ANNET',
      vurdertAv: {
        ident: 'Saksbehandler',
        dato: '2026-03-10',
      },
    },
  ],
  kanVurderes: [
    {
      fom: '2025-10-10',
      tom: '2030-10-10',
    },
  ],
  sisteVedtatteVurderinger: [],
  behøverVurderinger: [],
  harTilgangTilÅSaksbehandle: true,
};

const grunnlagMedVedtatteOgNyeVurderinger: VedtakslengdeGrunnlag = {
  ikkeRelevantePerioder: [],
  nyeVurderinger: [
    {
      fom: '2026-10-11',
      tom: '2027-10-10',
      sluttdato: '2027-10-10',
      begrunnelse: 'Automatisk vedtakslengde ny periode',
      manuellVurdering: false,
      utvidetMed: 'ANDRE_ÅR',
    },
  ],
  kanVurderes: [
    {
      fom: '2025-10-10',
      tom: '2030-10-10',
    },
  ],
  sisteVedtatteVurderinger: [
    {
      fom: '2025-10-10',
      tom: '2026-10-10',
      sluttdato: '2026-10-10',
      begrunnelse: 'Vedtatt automatisk vedtakslengde',
      manuellVurdering: false,
      utvidetMed: 'FØRSTE_ÅR',
      vurdertAv: {
        ident: 'Maskinansen',
        dato: '2025-10-10',
      },
    },
  ],
  behøverVurderinger: [],
  harTilgangTilÅSaksbehandle: true,
};

const grunnlagMedVedtattManuellVurdering: VedtakslengdeGrunnlag = {
  ikkeRelevantePerioder: [],
  nyeVurderinger: [],
  kanVurderes: [
    {
      fom: '2025-10-10',
      tom: '2030-10-10',
    },
  ],
  sisteVedtatteVurderinger: [
    {
      fom: '2025-10-10',
      tom: '2026-10-10',
      sluttdato: '2026-10-10',
      begrunnelse: 'Vedtatt automatisk',
      manuellVurdering: false,
      utvidetMed: 'FØRSTE_ÅR',
      vurdertAv: {
        ident: 'Maskinansen',
        dato: '2025-10-10',
      },
    },
    {
      fom: '2026-10-11',
      tom: '2027-04-10',
      sluttdato: '2027-04-10',
      begrunnelse: 'Vedtatt manuell forlengelse',
      manuellVurdering: true,
      utvidetMed: 'ANNET',
      vurdertAv: {
        ident: 'Saksansen',
        dato: '2026-03-10',
      },
    },
  ],
  behøverVurderinger: [],
  harTilgangTilÅSaksbehandle: true,
};

describe('Generelt', () => {
  it('Skal ha en overskrift', () => {
    render(<VedtakslengdeSteg readOnly={false} behandlingVersjon={0} grunnlag={grunnlagTomt} />);

    const heading = screen.getByText('§ 6 i AAP forskriften. Vedtaksperiode');
    expect(heading).toBeVisible();
  });

  it('Skal vise "Legg til ny vurdering" knapp når ingen manuell vurdering finnes', () => {
    render(<VedtakslengdeSteg readOnly={false} behandlingVersjon={0} grunnlag={grunnlagTomt} />);

    const leggTilKnapp = screen.getByRole('button', { name: 'Legg til ny vurdering' });
    expect(leggTilKnapp).toBeVisible();
  });

  it('Skal ikke vise "Legg til ny vurdering" knapp når manuell vurdering allerede finnes', () => {
    render(<VedtakslengdeSteg readOnly={false} behandlingVersjon={0} grunnlag={grunnlagMedManuellVurdering} />);

    const leggTilKnapp = screen.queryByRole('button', { name: 'Legg til ny vurdering' });
    expect(leggTilKnapp).not.toBeInTheDocument();
  });

  it('Skal vise skjemafelt etter å ha trykket "Legg til ny vurdering"', async () => {
    render(<VedtakslengdeSteg readOnly={false} behandlingVersjon={0} grunnlag={grunnlagTomt} />);

    const leggTilKnapp = screen.getByRole('button', { name: 'Legg til ny vurdering' });
    await user.click(leggTilKnapp);

    // radiogroup
    const endringGruppe = screen.getByRole('group', { name: 'Ønsket endring' });
    expect(endringGruppe).toBeVisible();
    expect(within(endringGruppe).getByRole('radio', { name: 'Forleng vedtak' })).toBeChecked();

    // datofelt
    const sluttdatoFelt = screen.getByRole('textbox', { name: 'Sett ny sluttdato for vedtaksperiode' });
    expect(sluttdatoFelt).toBeVisible();

    // begrunnelse
    const begrunnelseFelt = screen.getByRole('textbox', { name: 'Begrunnelse for endring av vedtakslengde' });
    expect(begrunnelseFelt).toBeVisible();
  });

  it('Skal ikke vise "Legg til ny vurdering" etter at en manuell vurdering er lagt til', async () => {
    render(<VedtakslengdeSteg readOnly={false} behandlingVersjon={0} grunnlag={grunnlagTomt} />);

    const leggTilKnapp = screen.getByRole('button', { name: 'Legg til ny vurdering' });
    await user.click(leggTilKnapp);

    expect(screen.queryByRole('button', { name: 'Legg til ny vurdering' })).not.toBeInTheDocument();
  });
});

describe('Validering', () => {
  it('Skal vise feilmeldinger når skjemaet sendes inn uten utfylte felt', async () => {
    render(<VedtakslengdeSteg readOnly={false} behandlingVersjon={0} grunnlag={grunnlagTomt} />);

    // Legg til ny vurdering
    await user.click(screen.getByRole('button', { name: 'Legg til ny vurdering' }));

    // Tøm sluttdato (er tom fra start) og la begrunnelse være tom
    await trykkPåBekreft();

    expect(screen.getAllByText('Du må oppgi en sluttdato')[0]).toBeVisible();
    expect(screen.getAllByText('Du må gi en begrunnelse')[0]).toBeVisible();
  });

  it('Skal vise feilmelding ved ugyldig datoformat', async () => {
    render(<VedtakslengdeSteg readOnly={false} behandlingVersjon={0} grunnlag={grunnlagTomt} />);

    await user.click(screen.getByRole('button', { name: 'Legg til ny vurdering' }));

    const sluttdatoFelt = screen.getByRole('textbox', { name: 'Sett ny sluttdato for vedtaksperiode' });
    await user.type(sluttdatoFelt, 'ugyldig-dato');

    await trykkPåBekreft();

    expect(screen.getAllByText('Datoformatet er ikke gyldig. Dato må være på formatet dd.mm.åååå')[0]).toBeVisible();
  });
});

describe('Tidligere vurderinger', () => {
  it('Skal vise sisteVedtatteVurderinger med riktig status-tag for automatisk vurdering', () => {
    render(<VedtakslengdeSteg readOnly={false} behandlingVersjon={0} grunnlag={grunnlagMedVedtatteOgNyeVurderinger} />);

    const automatiskTags = screen.getAllByText('Automatisk satt vedtaksperiode');
    expect(automatiskTags.length).toBeGreaterThanOrEqual(1);
    expect(automatiskTags[0]).toBeVisible();
  });

  it('Skal vise sisteVedtatteVurderinger med riktig status-tag for manuell vurdering', () => {
    render(<VedtakslengdeSteg readOnly={false} behandlingVersjon={0} grunnlag={grunnlagMedVedtattManuellVurdering} />);

    expect(screen.getByText('Manuell forlengelse')).toBeVisible();
  });

  it('Skal vise automatiske nye vurderinger som tidligere vurderinger med automatisk status', () => {
    render(<VedtakslengdeSteg readOnly={false} behandlingVersjon={0} grunnlag={grunnlagMedAutomatiskVurdering} />);

    expect(screen.getByText('Automatisk satt vedtaksperiode')).toBeVisible();
  });

  it('Skal vise VedtakslengdeVurderingInnhold med sluttdato og begrunnelse', () => {
    render(<VedtakslengdeSteg readOnly={false} behandlingVersjon={0} grunnlag={grunnlagMedVedtatteOgNyeVurderinger} />);

    // Sluttdato og begrunnelse vises i SpørsmålOgSvar (cards may be collapsed)
    const sluttdatoLabels = screen.getAllByText('Sluttdato');
    expect(sluttdatoLabels.length).toBeGreaterThanOrEqual(1);
    sluttdatoLabels.forEach((label) => expect(label).toBeInTheDocument());

    const begrunnelseLabels = screen.getAllByText('Begrunnelse');
    expect(begrunnelseLabels.length).toBeGreaterThanOrEqual(1);
    begrunnelseLabels.forEach((label) => expect(label).toBeInTheDocument());
  });
});

describe('Slett manuell vurdering', () => {
  it('Skal fjerne manuell vurdering når slett-knappen trykkes', async () => {
    render(<VedtakslengdeSteg readOnly={false} behandlingVersjon={0} grunnlag={grunnlagMedAutomatiskVurdering} />);

    // Legg til vurdering
    await user.click(screen.getByRole('button', { name: 'Legg til ny vurdering' }));

    // Fyll inn felt
    const begrunnelseFelt = screen.getByRole('textbox', { name: 'Begrunnelse for endring av vedtakslengde' });
    await user.type(begrunnelseFelt, 'Min begrunnelse');

    // Fjern vurdering
    const fjernKnapp = screen.getByRole('button', { name: 'Fjern vurdering' });
    await user.click(fjernKnapp);

    // Bekreft slett i modal (button text is "Slett")
    const bekreftSlettKnapp = screen.getByRole('button', { name: 'Slett' });
    await user.click(bekreftSlettKnapp);

    // Skjemafelt skal ikke lenger være synlige
    expect(screen.queryByRole('textbox', { name: 'Begrunnelse for endring av vedtakslengde' })).not.toBeInTheDocument();

    // "Legg til ny vurdering" knappen skal vises igjen
    expect(screen.getByRole('button', { name: 'Legg til ny vurdering' })).toBeVisible();
  });
});

describe('Endre / Avbryt', () => {
  it('Skal vise "Endre"-knapp når steg ikke er aktivt og det finnes en manuell vurdering', () => {
    setMockFlytResponse({ ...defaultFlytResponse, aktivtSteg: 'FASTSETT_GRUNNLAG' });

    render(<VedtakslengdeSteg readOnly={false} behandlingVersjon={0} grunnlag={grunnlagMedManuellVurdering} />);

    const endreKnapp = screen.getByRole('button', { name: 'Endre' });
    expect(endreKnapp).toBeVisible();
  });

  it('Skal resette state i felt dersom Avbryt-knappen blir trykket', async () => {
    setMockFlytResponse({ ...defaultFlytResponse, aktivtSteg: 'FASTSETT_GRUNNLAG' });

    render(<VedtakslengdeSteg readOnly={false} behandlingVersjon={0} grunnlag={grunnlagMedManuellVurdering} />);

    const endreKnapp = screen.getByRole('button', { name: 'Endre' });
    await user.click(endreKnapp);

    // Åpne accordion for den manuelle vurderingen
    const nyVurderingAccordion = screen.getByRole('button', {
      name: /ny vurdering/i,
    });
    await user.click(nyVurderingAccordion);

    const begrunnelseFelt = screen.getByRole('textbox', {
      name: 'Begrunnelse for endring av vedtakslengde',
    });
    await user.clear(begrunnelseFelt);
    await user.type(begrunnelseFelt, 'Dette er en ny begrunnelse');
    expect(begrunnelseFelt).toHaveValue('Dette er en ny begrunnelse');

    const avbrytKnapp = screen.getByRole('button', { name: 'Avbryt' });
    await user.click(avbrytKnapp);

    // Åpne accordion igjen
    const nyVurderingAccordionEtterAvbryt = screen.getByRole('button', {
      name: /ny vurdering/i,
    });
    await user.click(nyVurderingAccordionEtterAvbryt);

    const begrunnelseFeltEtterAvbryt = screen.getByRole('textbox', {
      name: 'Begrunnelse for endring av vedtakslengde',
    });
    expect(begrunnelseFeltEtterAvbryt).toHaveValue('Manuell forlengelse begrunnelse');
  });
});

describe('Mellomlagring i vedtakslengde', () => {
  const mellomlagring: MellomlagretVurderingResponse = {
    mellomlagretVurdering: {
      avklaringsbehovkode: Behovstype.FASTSETT_VEDTAKSLENGDE,
      behandlingId: { id: 1 },
      data: '{"vurderinger":[{"fraDato":"11.10.2025","begrunnelse":"Dette er min vurdering som er mellomlagret","sluttdato":"10.04.2027","erNyVurdering":false,"behøverVurdering":false,"manuellVurdering":true,"endring":"FORLENGELSE"}]}',
      vurdertDato: '2025-08-21T12:00:00.000',
      vurdertAv: 'Jan T. Loven',
    },
  };

  it('Skal vise en tekst om hvem som har gjort vurderingen dersom det finnes en mellomlagring', () => {
    render(
      <VedtakslengdeSteg
        readOnly={false}
        behandlingVersjon={0}
        grunnlag={grunnlagTomt}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
      />
    );

    const tekst = screen.getByText('Utkast lagret 21.08.2025 12:00 (Jan T. Loven)');
    expect(tekst).toBeVisible();
  });

  it('Skal ikke vise tekst om hvem som har gjort mellomlagring dersom bruker trykker på slett mellomlagring', async () => {
    render(
      <VedtakslengdeSteg
        readOnly={false}
        behandlingVersjon={0}
        grunnlag={grunnlagTomt}
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
      <VedtakslengdeSteg
        readOnly={false}
        behandlingVersjon={0}
        grunnlag={grunnlagTomt}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
      />
    );

    const begrunnelseFelt = screen.getByRole('textbox', {
      name: 'Begrunnelse for endring av vedtakslengde',
    });
    expect(begrunnelseFelt).toHaveValue('Dette er min vurdering som er mellomlagret');

    const sluttdatoFelt = screen.getByRole('textbox', {
      name: 'Sett ny sluttdato for vedtaksperiode',
    });
    expect(sluttdatoFelt).toHaveValue('10.04.2027');
  });

  it('Skal bruke bekreftet vurdering fra grunnlag som defaultValue i skjema dersom mellomlagring ikke finnes', () => {
    render(<VedtakslengdeSteg readOnly={false} behandlingVersjon={0} grunnlag={grunnlagMedManuellVurdering} />);

    const begrunnelseFelt = screen.getByRole('textbox', {
      name: 'Begrunnelse for endring av vedtakslengde',
    });
    expect(begrunnelseFelt).toHaveValue('Manuell forlengelse begrunnelse');

    const sluttdatoFelt = screen.getByRole('textbox', {
      name: 'Sett ny sluttdato for vedtaksperiode',
    });
    expect(sluttdatoFelt).toHaveValue('10.04.2027');
  });

  it('Skal resette skjema til tomt skjema dersom det ikke finnes en bekreftet vurdering og bruker sletter mellomlagring', async () => {
    render(
      <VedtakslengdeSteg
        readOnly={false}
        behandlingVersjon={0}
        grunnlag={grunnlagTomt}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
      />
    );

    const mockFetchResponseSlettMellomlagring: FetchResponse<object> = { type: 'SUCCESS', status: 202, data: {} };
    fetchMock.mockResponse(JSON.stringify(mockFetchResponseSlettMellomlagring));

    const slettKnapp = screen.getByRole('button', { name: 'Slett utkast' });
    await user.click(slettKnapp);

    // Etter sletting skal det ikke være noen vurderinger i skjemaet (tomt grunnlag)
    expect(screen.queryByRole('textbox', { name: 'Begrunnelse for endring av vedtakslengde' })).not.toBeInTheDocument();
  });

  it('Skal resette skjema til bekreftet vurdering dersom det finnes en bekreftet vurdering og bruker sletter mellomlagring', async () => {
    render(
      <VedtakslengdeSteg
        readOnly={false}
        behandlingVersjon={0}
        grunnlag={grunnlagMedManuellVurdering}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
      />
    );

    const mockFetchResponseSlettMellomlagring: FetchResponse<object> = { type: 'SUCCESS', status: 202, data: {} };
    fetchMock.mockResponse(JSON.stringify(mockFetchResponseSlettMellomlagring));

    const slettKnapp = screen.getByRole('button', { name: 'Slett utkast' });
    await user.click(slettKnapp);

    const begrunnelseFelt = screen.getByRole('textbox', {
      name: 'Begrunnelse for endring av vedtakslengde',
    });
    expect(begrunnelseFelt).toHaveValue('Manuell forlengelse begrunnelse');
  });

  it('Skal ikke være mulig å lagre eller slette mellomlagring hvis det er readOnly', () => {
    render(
      <VedtakslengdeSteg
        readOnly={true}
        behandlingVersjon={0}
        grunnlag={grunnlagTomt}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
      />
    );

    const lagreKnapp = screen.queryByRole('button', { name: 'Lagre utkast' });
    expect(lagreKnapp).not.toBeInTheDocument();
    const slettKnapp = screen.queryByRole('button', { name: 'Slett utkast' });
    expect(slettKnapp).not.toBeInTheDocument();
  });
});

const trykkPåBekreft = async () => await user.click(screen.getByRole('button', { name: 'Bekreft' }));
