import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, within } from 'lib/test/CustomRender';
import { Yrkesskade } from 'components/behandlinger/sykdom/yrkesskade/Yrkesskade';
import { MellomlagretVurderingResponse, YrkesskadeVurderingGrunnlag } from 'lib/types/types';
import { userEvent } from '@testing-library/user-event';
import { Behovstype } from 'lib/utils/form';
import { FetchResponse } from 'lib/utils/api';
import createFetchMock from 'vitest-fetch-mock';
import { defaultFlytResponse, setMockFlytResponse } from 'vitestSetup';

const fetchMock = createFetchMock(vi);
fetchMock.enableMocks();
const user = userEvent.setup();

const grunnlag: YrkesskadeVurderingGrunnlag = {
  harTilgangTilÅSaksbehandle: true,
  opplysninger: {
    innhentedeYrkesskader: [
      {
        ref: 'YRK',
        kilde: 'Yrkesskaderegisteret',
        skadedato: null,
      },
    ],
    oppgittYrkesskadeISøknad: false,
  },
};

beforeEach(() => {
  setMockFlytResponse({ ...defaultFlytResponse, aktivtSteg: 'VURDER_YRKESSKADE' });
});

describe('Yrkesskade', () => {
  describe('Generelt', () => {
    it('skal har korrekt heading', () => {
      render(<Yrkesskade grunnlag={grunnlag} behandlingVersjon={1} readOnly={false} behandlingsReferanse={'123'} />);
      const heading = screen.getByRole('heading', { name: '§ 11-22 AAP ved yrkesskade' });
      expect(heading).toBeVisible();
    });
  });

  describe('felter', () => {
    beforeEach(() => {
      render(<Yrkesskade grunnlag={grunnlag} behandlingVersjon={1} readOnly={false} behandlingsReferanse={'123'} />);
    });

    it('skal være synlig', () => {
      const begrunnelseFelt = screen.getByRole('textbox', {
        name: 'Vilkårsvurdering',
      });
      expect(begrunnelseFelt).toBeVisible();
    });

    it('skal vise en feilmelding dersom det ikke er besvart', async () => {
      await velgBekreft();
      const feilmelding = screen.getByText('Du må begrunne');
      expect(feilmelding).toBeVisible();
    });

    it('skal være synlig', () => {
      const felt = screen.getByRole('group', {
        name: 'Finnes det en årsakssammenheng mellom yrkesskade og nedsatt arbeidsevne?',
      });
      expect(felt).toBeVisible();
    });

    it('skal vise en feilmelding dersom det ikke er besvart', async () => {
      await velgBekreft();
      const feilmelding = screen.getByText('Du må svare på om det finnes en årsakssammenheng');
      expect(feilmelding).toBeVisible();
    });

    it('skal være synlig dersom det finnes en årsakssammenheng', async () => {
      await velgJaPåÅrsakssammenheng();
      const tabell = screen.getByText(
        'Tilknytt eventuelle yrkesskader som er helt eller delvis årsak til den nedsatte arbeidsevnen.'
      );
      expect(tabell).toBeVisible();
    });

    it('skal være mulig å velge en yrkesskade', async () => {
      await velgJaPåÅrsakssammenheng();

      const checkbox = screen.getByRole('checkbox', { name: 'Tilknytt yrkesskade til vurdering' });
      expect(checkbox).not.toBeChecked();

      await user.click(checkbox);

      expect(screen.getByRole('checkbox', { name: 'Tilknytt yrkesskade til vurdering' })).toBeChecked();
    });

    it('skal vise en feilmelding dersom yrkesskade er valgt, men skadedato mangler', async () => {
      await velgJaPåÅrsakssammenheng();

      const checkbox = screen.getByRole('checkbox', { name: 'Tilknytt yrkesskade til vurdering' });
      await user.click(checkbox);

      await velgBekreft();

      const feilmelding = screen.getByText('Du må angi dato for yrkesskade');
      expect(feilmelding).toBeVisible();
    });

    it('skal vise en feilmelding dersom det ikke er tilknyttet noen yrkesskade', async () => {
      await velgJaPåÅrsakssammenheng();
      await velgBekreft();

      const feilmelding = screen.getByText('Du må velge minst én yrkesskade');
      expect(feilmelding).toBeVisible();
    });

    it('skal være synlig dersom det finnes en årsakssammenheng', async () => {
      await velgJaPåÅrsakssammenheng();
      const felt = screen.getByRole('textbox', {
        name: 'Hvor stor andel totalt av nedsatt arbeidsevne skyldes yrkesskadene?',
      });

      expect(felt).toBeVisible();
    });

    it('skal vise feilmelding hvis det ikke har blitt besvart', async () => {
      await velgJaPåÅrsakssammenheng();
      await velgBekreft();

      const feilmelding = screen.getByText(
        'Du må svare på hvor stor andel av den nedsatte arbeidsevnen skyldes yrkesskadene'
      );
      expect(feilmelding).toBeVisible();
    });
  });

  describe('mellomlagring', () => {
    const mellomlagring: MellomlagretVurderingResponse = {
      mellomlagretVurdering: {
        avklaringsbehovkode: Behovstype.VURDER_TREKK_AV_SØKNAD_KODE,
        behandlingId: { id: 1 },
        data: '{"begrunnelse":"Dette er min vurdering som er mellomlagret"}',
        vurdertDato: '2025-08-21T12:00:00.000',
        vurdertAv: 'Jan T. Loven',
      },
    };

    const grunnlagMedVurdering: YrkesskadeVurderingGrunnlag = {
      harTilgangTilÅSaksbehandle: true,
      yrkesskadeVurdering: {
        begrunnelse: 'Dette er min vurdering som er bekreftet',
        erÅrsakssammenheng: true,
        vurdertAv: {
          ident: 'hello pello',
          dato: '2025-10-08',
        },
        relevanteSaker: [],
        relevanteYrkesskadeSaker: [],
      },
      opplysninger: { innhentedeYrkesskader: [], oppgittYrkesskadeISøknad: false },
    };

    const grunnlagUtenVurdering: YrkesskadeVurderingGrunnlag = {
      harTilgangTilÅSaksbehandle: false,
      opplysninger: { innhentedeYrkesskader: [], oppgittYrkesskadeISøknad: false },
    };

    it('Skal vise en tekst om hvem som har gjort vurderingen dersom det finnes en mellomlagring', () => {
      render(
        <Yrkesskade
          grunnlag={grunnlagUtenVurdering}
          behandlingVersjon={1}
          readOnly={false}
          behandlingsReferanse={'123'}
          initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
        />
      );

      const tekst = screen.getByText('Utkast lagret 21.08.2025 12:00 (Jan T. Loven)');
      expect(tekst).toBeVisible();
    });

    it('Skal vise en tekst om hvem som har lagret vurdering dersom bruker trykker på lagre mellomlagring', async () => {
      render(
        <Yrkesskade
          readOnly={false}
          behandlingVersjon={0}
          grunnlag={grunnlagUtenVurdering}
          behandlingsReferanse={'123'}
        />
      );

      await user.type(
        screen.getByRole('textbox', { name: 'Vilkårsvurdering' }),
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
        <Yrkesskade
          readOnly={false}
          behandlingVersjon={0}
          grunnlag={grunnlagUtenVurdering}
          behandlingsReferanse={'123'}
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
        <Yrkesskade
          readOnly={false}
          behandlingVersjon={0}
          grunnlag={grunnlagUtenVurdering}
          behandlingsReferanse={'123'}
          initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
        />
      );

      const begrunnelseFelt = screen.getByRole('textbox', {
        name: 'Vilkårsvurdering',
      });

      expect(begrunnelseFelt).toHaveValue('Dette er min vurdering som er mellomlagret');
    });

    it('Skal bruke bekreftet vurdering fra grunnlag som defaultValue i skjema dersom mellomlagring ikke finnes', () => {
      render(
        <Yrkesskade
          behandlingsReferanse={'123'}
          readOnly={false}
          behandlingVersjon={0}
          grunnlag={grunnlagMedVurdering}
        />
      );

      const begrunnelseFelt = screen.getByRole('textbox', {
        name: /Vilkårsvurdering/i,
      });

      expect(begrunnelseFelt).toHaveValue('Dette er min vurdering som er bekreftet');
    });

    it('Skal resette skjema til tomt skjema dersom det ikke finnes en bekreftet vurdering og bruker sletter mellomlagring', async () => {
      render(
        <Yrkesskade
          readOnly={false}
          behandlingVersjon={0}
          grunnlag={grunnlagUtenVurdering}
          behandlingsReferanse={'123'}
          initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
        />
      );

      await user.type(screen.getByRole('textbox', { name: 'Vilkårsvurdering' }), ' her er ekstra tekst');

      expect(screen.getByRole('textbox', { name: 'Vilkårsvurdering' })).toHaveValue(
        'Dette er min vurdering som er mellomlagret her er ekstra tekst'
      );

      const slettKnapp = screen.getByRole('button', { name: 'Slett utkast' });

      await user.click(slettKnapp);

      expect(screen.getByRole('textbox', { name: 'Vilkårsvurdering' })).toHaveValue('');
    });

    it('Skal resette skjema til bekreftet vurdering dersom det finnes en bekreftet vurdering og bruker sletter mellomlagring', async () => {
      render(
        <Yrkesskade
          readOnly={false}
          behandlingVersjon={0}
          grunnlag={grunnlagMedVurdering}
          behandlingsReferanse={'123'}
          initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
        />
      );

      await user.type(screen.getByRole('textbox', { name: 'Vilkårsvurdering' }), ' her er ekstra tekst');

      expect(screen.getByRole('textbox', { name: 'Vilkårsvurdering' })).toHaveValue(
        'Dette er min vurdering som er mellomlagret her er ekstra tekst'
      );

      const slettKnapp = screen.getByRole('button', { name: 'Slett utkast' });

      await user.click(slettKnapp);

      expect(screen.getByRole('textbox', { name: 'Vilkårsvurdering' })).toHaveValue(
        'Dette er min vurdering som er bekreftet'
      );
    });

    it('Skal ikke være mulig å lagre eller slette mellomlagring hvis det er readOnly', () => {
      render(
        <Yrkesskade
          readOnly={true}
          behandlingVersjon={0}
          grunnlag={grunnlagMedVurdering}
          behandlingsReferanse={'123'}
          initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
        />
      );

      const lagreKnapp = screen.queryByRole('button', { name: 'Lagre utkast' });
      expect(lagreKnapp).not.toBeInTheDocument();
      const slettKnapp = screen.queryByRole('button', { name: 'Slett utkast' });
      expect(slettKnapp).not.toBeInTheDocument();
    });
  });
});

async function velgBekreft() {
  await user.click(screen.getByRole('button', { name: 'Bekreft' }));
}

async function velgJaPåÅrsakssammenheng() {
  const JaValg = within(
    screen.getByRole('group', {
      name: 'Finnes det en årsakssammenheng mellom yrkesskade og nedsatt arbeidsevne?',
    })
  ).getByRole('radio', { name: 'Ja' });

  await user.click(JaValg);
}
