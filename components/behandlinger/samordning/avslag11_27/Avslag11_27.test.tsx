import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from 'lib/test/CustomRender';
import userEvent from '@testing-library/user-event';
import createFetchMock from 'vitest-fetch-mock';
import { FetchResponse } from 'lib/utils/api';
import { defaultFlytResponse, setMockFlytResponse } from 'vitestSetup';
import { Avslag11_27 } from 'components/behandlinger/samordning/avslag11_27/Avslag11_27';
import { Avslag11_27Grunnlag, MellomlagretVurdering } from 'lib/types/types';
import { Behovstype } from 'lib/utils/form';

const fetchMock = createFetchMock(vi);
fetchMock.enableMocks();
const user = userEvent.setup();

const ref1 = 'ref-uuid-1';
const ref2 = 'ref-uuid-2';

const grunnlagUtenVurdering: Avslag11_27Grunnlag = {
  harTilgangTilÅSaksbehandle: true,
  krav: [
    {
      referanse: ref1,
      søknadsdokument: 'JP-001',
      type: 'NYTT_KRAV_AAP',
      søknadsdato: '2026-01-15',
      muligRettighetFra: '2026-02-01',
    },
  ],
  vurderinger: null,
  vedtatteVurdering: null,
};

const grunnlagMedVurdering: Avslag11_27Grunnlag = {
  harTilgangTilÅSaksbehandle: true,
  krav: [
    {
      referanse: ref1,
      søknadsdokument: 'JP-001',
      type: 'NYTT_KRAV_AAP',
      søknadsdato: '2026-01-15',
      muligRettighetFra: '2026-02-01',
    },
  ],
  vurderinger: [
    {
      referanse: ref1,
      begrunnelse: 'Eksisterende begrunnelse',
      harAnnenFullYtelse: true,
      brukersYtelse: 'SYKEPENGER',
      harSykepengegrunnlagOver2G: true,
      skalAvslås1127: true,
    },
  ],
  vedtatteVurdering: null,
};

const grunnlagMedVedtattOgNyVurdering: Avslag11_27Grunnlag = {
  harTilgangTilÅSaksbehandle: true,
  krav: [
    {
      referanse: ref1,
      søknadsdokument: 'JP-001',
      type: 'NYTT_KRAV_AAP',
      søknadsdato: '2026-01-15',
      muligRettighetFra: '2026-02-01',
    },
    {
      referanse: ref2,
      søknadsdokument: 'JP-002',
      type: 'GJENOPPTAK',
      søknadsdato: '2026-03-01',
      muligRettighetFra: '2026-03-15',
    },
  ],
  vurderinger: [
    {
      referanse: ref2,
      begrunnelse: 'Nåværende vurdering gjenopptak',
      harAnnenFullYtelse: false,
      brukersYtelse: null,
      harSykepengegrunnlagOver2G: null,
      skalAvslås1127: false,
    },
  ],
  vedtatteVurdering: [
    {
      referanse: ref1,
      begrunnelse: 'Vedtatt vurdering fra førstegangsbehandling',
      harAnnenFullYtelse: true,
      brukersYtelse: 'SYKEPENGER',
      harSykepengegrunnlagOver2G: true,
      skalAvslås1127: true,
      vurderingerMeta: {
        vurdertAv: { ident: 'Z123456', dato: '2025-12-01' },
      },
    },
  ],
};

beforeEach(() => {
  setMockFlytResponse({ ...defaultFlytResponse, aktivtSteg: 'VURDER_AVSLAG_11_27' });
});

describe('Avslag11_27 - kravtabell og valg', () => {
  it('viser kravtabellen med krav', () => {
    render(
      <Avslag11_27
        grunnlag={grunnlagUtenVurdering}
        behandlingVersjon={1}
        readOnly={false}
        typeBehandling="Førstegangsbehandling"
      />
    );

    expect(screen.getByText('JP-001')).toBeVisible();
    expect(screen.getByText('Nytt krav om AAP')).toBeVisible();
  });

  it('viser overskrift for steget', () => {
    render(
      <Avslag11_27
        grunnlag={grunnlagUtenVurdering}
        behandlingVersjon={1}
        readOnly={false}
        typeBehandling="Førstegangsbehandling"
      />
    );

    expect(
      screen.getByText('§ 11-27 Brukeren har annen full trygdeytelse i en lengre periode etter AAP søknad')
    ).toBeVisible();
  });

  it('krav er pre-selektert når nåværende vurdering finnes for referansen', () => {
    render(
      <Avslag11_27
        grunnlag={grunnlagMedVurdering}
        behandlingVersjon={1}
        readOnly={false}
        typeBehandling="Førstegangsbehandling"
      />
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('krav er ikke pre-selektert uten eksisterende vurdering', () => {
    render(
      <Avslag11_27
        grunnlag={grunnlagUtenVurdering}
        behandlingVersjon={1}
        readOnly={false}
        typeBehandling="Førstegangsbehandling"
      />
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });
});

describe('Avslag11_27 - skjema vises/skjules', () => {
  it('viser skjema for krav som er valgt', async () => {
    render(
      <Avslag11_27
        grunnlag={grunnlagUtenVurdering}
        behandlingVersjon={1}
        readOnly={false}
        typeBehandling="Førstegangsbehandling"
      />
    );

    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    expect(screen.getByText('Vurder krav JP-001')).toBeVisible();
  });

  it('skjuler skjema når krav deselekteres', async () => {
    render(
      <Avslag11_27
        grunnlag={grunnlagUtenVurdering}
        behandlingVersjon={1}
        readOnly={false}
        typeBehandling="Førstegangsbehandling"
      />
    );

    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);
    expect(screen.getByText('Vurder krav JP-001')).toBeVisible();

    await user.click(checkbox);
    expect(screen.queryByText('Vurder krav JP-001')).not.toBeInTheDocument();
  });

  it('viser skjema automatisk for krav med eksisterende vurdering', () => {
    render(
      <Avslag11_27
        grunnlag={grunnlagMedVurdering}
        behandlingVersjon={1}
        readOnly={false}
        typeBehandling="Førstegangsbehandling"
      />
    );

    expect(screen.getByText('Vurder krav JP-001')).toBeVisible();
  });
});

describe('Avslag11_27 - defaultverdier fra grunnlag', () => {
  it('fyller inn begrunnelse fra eksisterende vurdering', () => {
    render(
      <Avslag11_27
        grunnlag={grunnlagMedVurdering}
        behandlingVersjon={1}
        readOnly={false}
        typeBehandling="Førstegangsbehandling"
      />
    );

    expect(screen.getByDisplayValue('Eksisterende begrunnelse')).toBeInTheDocument();
  });

  it('bruker mellomlagring som defaultValue fremfor grunnlag', () => {
    const mellomlagring: MellomlagretVurdering = {
      avklaringsbehovkode: Behovstype.VURDER_AVSLAG_11_27,
      behandlingId: { id: 1 },
      data: JSON.stringify({
        avslag11_27vurderinger: [
          {
            vurdering: {
              referanse: ref1,
              begrunnelse: 'Mellomlagret begrunnelse',
              behøverVurdering: true,
              erNyVurdering: false,
              harAnnenFullYtelse: 'Ja',
              brukersYtelse: 'SYKEPENGER',
              harSykepengegrunnlagOver2G: 'Ja',
              skalAvslås1127: 'Ja',
            },
          },
        ],
      }),
      vurdertAv: 'Z123456',
      vurdertDato: '2026-01-01T12:00:00',
    };

    render(
      <Avslag11_27
        grunnlag={grunnlagMedVurdering}
        behandlingVersjon={1}
        readOnly={false}
        typeBehandling="Førstegangsbehandling"
        initialMellomlagretVurdering={mellomlagring}
      />
    );

    expect(screen.getByDisplayValue('Mellomlagret begrunnelse')).toBeInTheDocument();
  });
});

describe('Avslag11_27 - vedtatte vurderinger', () => {
  it('viser vedtatt vurdering for revurdering', async () => {
    render(
      <Avslag11_27
        grunnlag={grunnlagMedVedtattOgNyVurdering}
        behandlingVersjon={1}
        readOnly={false}
        typeBehandling="Revurdering"
      />
    );

    // ref1 er vedtatt — kortet er kollaps, ekspander det
    const kortHeader = screen.getByText(/januar/i);
    await user.click(kortHeader);

    expect(screen.getByText('Vedtatt vurdering fra førstegangsbehandling')).toBeVisible();
  });

  it('viser "Legg til vurdering"-knapp for revurdering med vedtatt vurdering', () => {
    render(
      <Avslag11_27
        grunnlag={grunnlagMedVedtattOgNyVurdering}
        behandlingVersjon={1}
        readOnly={false}
        typeBehandling="Revurdering"
      />
    );

    // ref1 har vedtatt vurdering + revurdering → visLeggTilVurderingKnapp=true
    expect(screen.getByRole('button', { name: 'Legg til vurdering' })).toBeVisible();
  });
});

describe('Avslag11_27 - validering', () => {
  it('viser feil ved innsending uten valgt krav i førstegangsbehandling', async () => {
    render(
      <Avslag11_27
        grunnlag={grunnlagUtenVurdering}
        behandlingVersjon={1}
        readOnly={false}
        typeBehandling="Førstegangsbehandling"
      />
    );

    const lagreKnapp = screen.getByRole('button', { name: 'Bekreft' });
    await user.click(lagreKnapp);

    expect(screen.getByText('Du må velge minst ett krav å vurdere.')).toBeVisible();
  });

  it('validerer ikke ved revurdering uten valgt krav', async () => {
    render(
      <Avslag11_27
        grunnlag={grunnlagUtenVurdering}
        behandlingVersjon={1}
        readOnly={false}
        typeBehandling="Revurdering"
      />
    );

    const lagreKnapp = screen.getByRole('button', { name: 'Bekreft' });
    await user.click(lagreKnapp);

    expect(screen.queryByText('Du må velge minst ett krav å vurdere.')).not.toBeInTheDocument();
  });

  it('nullstiller feilmelding etter krav velges', async () => {
    render(
      <Avslag11_27
        grunnlag={grunnlagUtenVurdering}
        behandlingVersjon={1}
        readOnly={false}
        typeBehandling="Førstegangsbehandling"
      />
    );

    const lagreKnapp = screen.getByRole('button', { name: 'Bekreft' });
    await user.click(lagreKnapp);
    expect(screen.getByText('Du må velge minst ett krav å vurdere.')).toBeVisible();

    await user.click(screen.getByRole('checkbox'));
    expect(screen.queryByText('Du må velge minst ett krav å vurdere.')).not.toBeInTheDocument();
  });
});

describe('Avslag11_27 - mellomlagring', () => {
  it('viser mellomlagringstekst med dato og bruker', () => {
    const mellomlagring: MellomlagretVurdering = {
      avklaringsbehovkode: Behovstype.VURDER_AVSLAG_11_27,
      behandlingId: { id: 1 },
      data: JSON.stringify({
        avslag11_27vurderinger: [
          {
            vurdering: {
              referanse: ref1,
              begrunnelse: '',
              behøverVurdering: true,
              erNyVurdering: true,
              harAnnenFullYtelse: undefined,
              brukersYtelse: undefined,
              harSykepengegrunnlagOver2G: undefined,
              skalAvslås1127: undefined,
            },
          },
        ],
      }),
      vurdertAv: 'Jan T. Loven',
      vurdertDato: '2026-01-15T10:30:00',
    };

    render(
      <Avslag11_27
        grunnlag={grunnlagUtenVurdering}
        behandlingVersjon={1}
        readOnly={false}
        typeBehandling="Førstegangsbehandling"
        initialMellomlagretVurdering={mellomlagring}
      />
    );

    expect(screen.getByText(/Utkast lagret.*Jan T. Loven/)).toBeVisible();
  });

  it('sletter mellomlagring og nullstiller skjema', async () => {
    const mellomlagring: MellomlagretVurdering = {
      avklaringsbehovkode: Behovstype.VURDER_AVSLAG_11_27,
      behandlingId: { id: 1 },
      data: JSON.stringify({
        avslag11_27vurderinger: [
          {
            vurdering: {
              referanse: ref1,
              begrunnelse: 'Mellomlagret',
              behøverVurdering: true,
              erNyVurdering: false,
              harAnnenFullYtelse: 'Ja',
              brukersYtelse: 'SYKEPENGER',
              harSykepengegrunnlagOver2G: 'Ja',
              skalAvslås1127: 'Ja',
            },
          },
        ],
      }),
      vurdertAv: 'Z123456',
      vurdertDato: '2026-01-01T12:00:00',
    };

    const mockResponse: FetchResponse<object> = { type: 'SUCCESS', status: 202, data: {} };
    fetchMock.mockResponse(JSON.stringify(mockResponse));

    render(
      <Avslag11_27
        grunnlag={grunnlagUtenVurdering}
        behandlingVersjon={1}
        readOnly={false}
        typeBehandling="Førstegangsbehandling"
        initialMellomlagretVurdering={mellomlagring}
      />
    );

    const slettKnapp = screen.getByRole('button', { name: 'Slett utkast' });
    await user.click(slettKnapp);

    expect(screen.queryByText(/Utkast lagret/)).not.toBeInTheDocument();
  });
});
