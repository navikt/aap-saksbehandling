import { userEvent } from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, within } from 'lib/test/CustomRender';
import { ForutgåendeMedlemskapGrunnlag, MellomlagretVurderingResponse } from 'lib/types/types';
import { FetchResponse } from 'lib/utils/api';
import createFetchMock from 'vitest-fetch-mock';
import { defaultFlytResponse, setMockFlytResponse } from 'vitestSetup';
import { ManuellVurderingForutgåendeMedlemskap } from 'components/behandlinger/forutgåendemedlemskap/manuellvurderingforutgåendemedlemskap/ManuellVurderingForutgåendeMedlemskap';

const fetchMock = createFetchMock(vi);
fetchMock.enableMocks();
const user = userEvent.setup();

const grunnlagUtenVurdering: ForutgåendeMedlemskapGrunnlag = {
  harTilgangTilÅSaksbehandle: true,
  historiskeManuelleVurderinger: [],
};

beforeEach(() => {
  setMockFlytResponse({ ...defaultFlytResponse, aktivtSteg: 'VURDER_MEDLEMSKAP' });
});

describe('Lovvalg og medlemskap ved søknadstidspunkt', () => {
  it('Skal ha en overskrift', () => {
    render(
      <ManuellVurderingForutgåendeMedlemskap
        overstyring={false}
        readOnly={false}
        behandlingVersjon={0}
        grunnlag={grunnlagUtenVurdering}
      />
    );
    const heading = screen.getByText('§ 11-2 Forutgående medlemskap');
    expect(heading).toBeVisible();
  });

  it('Skal ha riktig overskrift ved overstyring', () => {
    render(
      <ManuellVurderingForutgåendeMedlemskap
        readOnly={false}
        behandlingVersjon={0}
        grunnlag={grunnlagUtenVurdering}
        overstyring={true}
      />
    );
    const heading = screen.getByText('Overstyring av § 11-2 Forutgående medlemskap');
    expect(heading).toBeVisible();
  });

  it('Skal ha felt for begrunnelse', () => {
    render(
      <ManuellVurderingForutgåendeMedlemskap
        overstyring={false}
        readOnly={false}
        behandlingVersjon={0}
        grunnlag={grunnlagUtenVurdering}
      />
    );
    const begrunnelse = screen.getByRole('textbox', { name: 'Vurder brukerens blabla forutgående medlemskap' });
    expect(begrunnelse).toBeVisible();
  });

  it('Skal ha felt for forutgående medlemskap', () => {
    render(
      <ManuellVurderingForutgåendeMedlemskap
        overstyring={false}
        readOnly={false}
        behandlingVersjon={0}
        grunnlag={grunnlagUtenVurdering}
      />
    );
    screen.logTestingPlaygroundURL();
    const felt = screen.getByRole('group', {
      name: 'Har brukeren fem års forutgående medlemskap i folketrygden jf. § 11-2?',
    });
    expect(felt).toBeVisible();
  });

  it('skjuler felt for unntaksvilkår hvis forutgående medlemskap er Ja', async () => {
    render(
      <ManuellVurderingForutgåendeMedlemskap
        overstyring={false}
        readOnly={false}
        behandlingVersjon={0}
        grunnlag={grunnlagUtenVurdering}
      />
    );
    const forutgående = screen.getByRole('group', {
      name: 'Har brukeren fem års forutgående medlemskap i folketrygden jf. § 11-2?',
    });
    expect(forutgående).toBeVisible();
    await user.click(within(forutgående).getByRole('radio', { name: 'Ja' }));
    const lovvalgsland = screen.queryByRole('group', {
      name: 'Oppfyller brukeren noen av unntaksvilkårene?',
    });
    expect(lovvalgsland).not.toBeInTheDocument();
  });

  it('viser felt for unntaksvilkår hvis forutgående medlemskap er Nei', async () => {
    render(
      <ManuellVurderingForutgåendeMedlemskap
        overstyring={false}
        readOnly={false}
        behandlingVersjon={0}
        grunnlag={grunnlagUtenVurdering}
      />
    );
    const forutgående = screen.getByRole('group', {
      name: 'Har brukeren fem års forutgående medlemskap i folketrygden jf. § 11-2?',
    });
    expect(forutgående).toBeVisible();
    await user.click(within(forutgående).getByRole('radio', { name: 'Nei' }));

    const lovvalgsland = screen.queryByRole('group', {
      name: 'Oppfyller brukeren noen av unntaksvilkårene?',
    });
    expect(lovvalgsland).toBeVisible();
  });

  it('Skal vise feilmelding dersom feltet for begrunnelse ikke er besvart', async () => {
    render(
      <ManuellVurderingForutgåendeMedlemskap
        overstyring={false}
        readOnly={false}
        behandlingVersjon={0}
        grunnlag={grunnlagUtenVurdering}
      />
    );
    await trykkPåBekreft();
    const feilmelding = screen.getByText('Du må gi en begrunnelse på brukerens forutgående medlemskap');
    expect(feilmelding).toBeVisible();
  });

  it('Skal vise feilmelding dersom feltet om forutgående medlemskap ikke er besvart', async () => {
    render(
      <ManuellVurderingForutgåendeMedlemskap
        overstyring={false}
        readOnly={false}
        behandlingVersjon={0}
        grunnlag={grunnlagUtenVurdering}
      />
    );
    await trykkPåBekreft();
    const feilmelding = screen.getByText('Du må velge om brukeren har fem års forutgående medlemskap');
    expect(feilmelding).toBeVisible();
  });

  it('skal vise feilmelding for unntaksvilkår hvis forutgående medlemskap er Nei og unntaksvilkår ikke er besvart', async () => {
    render(
      <ManuellVurderingForutgåendeMedlemskap
        overstyring={false}
        readOnly={false}
        behandlingVersjon={0}
        grunnlag={grunnlagUtenVurdering}
      />
    );
    const forutgående = screen.getByRole('group', {
      name: 'Har brukeren fem års forutgående medlemskap i folketrygden jf. § 11-2?',
    });
    expect(forutgående).toBeVisible();
    await user.click(within(forutgående).getByRole('radio', { name: 'Nei' }));

    await trykkPåBekreft();

    const feilmelding = screen.getByText('Du må svare på om brukeren oppfyller noen av unntaksvilkårene');
    expect(feilmelding).toBeVisible();
  });
});

describe('mellomlagring i lovvalg og medlemskap ved søknadstidspunkt', () => {
  const mellomlagring: MellomlagretVurderingResponse = {
    mellomlagretVurdering: {
      avklaringsbehovkode: '5006',
      behandlingId: { id: 1 },
      data: '{"begrunnelse":"Dette er min vurdering som er mellomlagret"}',
      vurdertDato: '2025-08-21T12:00:00.000',
      vurdertAv: 'Jan T. Loven',
    },
  };

  const grunnlagMedVurdering: ForutgåendeMedlemskapGrunnlag = {
    vurdering: {
      begrunnelse: 'Dette er min vurdering som er bekreftet',
      harForutgåendeMedlemskap: false,
      overstyrt: true,
      vurdertAv: {
        dato: '2025-08-21',
        ident: 'Saksbehandler',
      },
    },
    harTilgangTilÅSaksbehandle: true,
    historiskeManuelleVurderinger: [],
  };

  it('Skal vise en tekst om hvem som har gjort vurderingen dersom det finnes en mellomlagring', () => {
    render(
      <ManuellVurderingForutgåendeMedlemskap
        readOnly={false}
        behandlingVersjon={0}
        grunnlag={grunnlagUtenVurdering}
        overstyring={false}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
      />
    );
    const tekst = screen.getByText('Utkast lagret 21.08.2025 12:00 (Jan T. Loven)');
    expect(tekst).toBeVisible();
  });

  it('Skal vise en tekst om hvem som har lagret vurdering dersom bruker trykker på lagre mellomlagring', async () => {
    render(
      <ManuellVurderingForutgåendeMedlemskap
        readOnly={false}
        behandlingVersjon={0}
        grunnlag={grunnlagUtenVurdering}
        overstyring={false}
      />
    );

    await user.type(
      screen.getByRole('textbox', { name: 'Vurder brukerens forutgående medlemskap' }),
      'Her har jeg begynt å skrive en vurdering..'
    );
    expect(screen.queryByText('Utkast lagret 21.08.2025 00:00 (Jan T. Loven)')).not.toBeInTheDocument();

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

  it('Skal ikke vise tekst om hvem som har gjort mellomlagring dersom bruker trykker på slett mellomlagring', async () => {
    render(
      <ManuellVurderingForutgåendeMedlemskap
        readOnly={false}
        behandlingVersjon={0}
        grunnlag={grunnlagUtenVurdering}
        overstyring={false}
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
      <ManuellVurderingForutgåendeMedlemskap
        readOnly={false}
        behandlingVersjon={0}
        grunnlag={grunnlagMedVurdering}
        overstyring={false}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
      />
    );
    const begrunnelseFelt = screen.getByRole('textbox', {
      name: 'Vurder brukerens forutgående medlemskap',
    });

    expect(begrunnelseFelt).toHaveValue('Dette er min vurdering som er mellomlagret');
  });

  it('Skal bruke bekreftet vurdering fra grunnlag som defaultValue i skjema dersom mellomlagring ikke finnes', () => {
    render(
      <ManuellVurderingForutgåendeMedlemskap
        readOnly={false}
        behandlingVersjon={0}
        grunnlag={grunnlagMedVurdering}
        overstyring={false}
      />
    );

    const begrunnelseFelt = screen.getByRole('textbox', {
      name: 'Vurder brukerens forutgående medlemskap',
    });

    expect(begrunnelseFelt).toHaveValue('Dette er min vurdering som er bekreftet');
  });

  it('Skal resette skjema til tomt skjema dersom det ikke finnes en bekreftet vurdering og bruker sletter mellomlagring', async () => {
    render(
      <ManuellVurderingForutgåendeMedlemskap
        readOnly={false}
        behandlingVersjon={0}
        grunnlag={grunnlagUtenVurdering}
        overstyring={false}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
      />
    );

    await user.type(
      screen.getByRole('textbox', { name: 'Vurder brukerens forutgående medlemskap' }),
      ' her er ekstra tekst'
    );

    expect(screen.getByRole('textbox', { name: 'Vurder brukerens forutgående medlemskap' })).toHaveValue(
      'Dette er min vurdering som er mellomlagret her er ekstra tekst'
    );

    const slettKnapp = screen.getByRole('button', { name: 'Slett utkast' });

    await user.click(slettKnapp);

    expect(screen.getByRole('textbox', { name: 'Vurder brukerens forutgående medlemskap' })).toHaveValue('');
  });

  it('Skal resette skjema til bekreftet vurdering dersom det finnes en bekreftet vurdering og bruker sletter mellomlagring', async () => {
    render(
      <ManuellVurderingForutgåendeMedlemskap
        readOnly={false}
        behandlingVersjon={0}
        grunnlag={grunnlagMedVurdering}
        overstyring={false}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
      />
    );
    await user.type(
      screen.getByRole('textbox', { name: 'Vurder brukerens forutgående medlemskap' }),
      ' her er ekstra tekst'
    );

    expect(screen.getByRole('textbox', { name: 'Vurder brukerens forutgående medlemskap' })).toHaveValue(
      'Dette er min vurdering som er mellomlagret her er ekstra tekst'
    );

    const slettKnapp = screen.getByRole('button', { name: 'Slett utkast' });

    await user.click(slettKnapp);

    expect(screen.getByRole('textbox', { name: 'Vurder brukerens forutgående medlemskap' })).toHaveValue(
      'Dette er min vurdering som er bekreftet'
    );
  });

  it('Skal ikke være mulig å lagre eller slette mellomlagring hvis det er readOnly', () => {
    render(
      <ManuellVurderingForutgåendeMedlemskap
        readOnly={true}
        behandlingVersjon={0}
        grunnlag={grunnlagMedVurdering}
        overstyring={false}
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
