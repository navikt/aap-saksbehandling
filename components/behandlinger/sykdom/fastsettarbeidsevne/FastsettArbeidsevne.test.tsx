import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FastsettArbeidsevne } from 'components/behandlinger/sykdom/fastsettarbeidsevne/FastsettArbeidsevne';
import { render, screen, within } from 'lib/test/CustomRender';
import { userEvent } from '@testing-library/user-event';
import { ArbeidsevneGrunnlag, MellomlagretVurderingResponse } from 'lib/types/types';
import { Behovstype } from 'lib/utils/form';
import { FetchResponse } from 'lib/utils/api';
import createFetchMock from 'vitest-fetch-mock';
import { defaultFlytResponse, setMockFlytResponse } from 'vitestSetup';

const fetchMock = createFetchMock(vi);
fetchMock.enableMocks();
const user = userEvent.setup();

const grunnlagUtenVurdering: ArbeidsevneGrunnlag = { harTilgangTilÅSaksbehandle: true };
const grunnlagMedVurdering: ArbeidsevneGrunnlag = {
  harTilgangTilÅSaksbehandle: true,
  vurderinger: [
    {
      arbeidsevne: 20,
      begrunnelse: 'Dette er min vurdering som er bekreftet',
      fraDato: '2025-08-21',
      vurderingsTidspunkt: '2025-08-21',
      vurdertAv: {
        ident: 'Saksbehandler',
        dato: '2025-08-21',
      },
    },
  ],
};

beforeEach(() => {
  setMockFlytResponse({ ...defaultFlytResponse, aktivtSteg: 'FASTSETT_ARBEIDSEVNE' });
});

describe('FastsettArbeidsevne', () => {
  describe('Generelt', () => {
    it('Skal ha riktig heading', () => {
      render(<FastsettArbeidsevne readOnly={false} behandlingVersjon={0} grunnlag={grunnlagUtenVurdering} />);
      const heading = screen.getByRole('heading', {
        name: '§ 11-23 andre ledd. Arbeidsevne som ikke er utnyttet (valgfritt)',
        level: 3,
      });
      expect(heading).toBeVisible();
    });

    it('Steget skal være default lukket', () => {
      render(<FastsettArbeidsevne readOnly={false} behandlingVersjon={0} grunnlag={grunnlagUtenVurdering} />);
      expect(
        screen.queryByRole('textbox', {
          name: 'Vilkårsvurdering',
        })
      ).not.toBeInTheDocument();
    });

    it('steget er åpent for beslutter når det er gjort en vurdering (minst en vurdering og readOnly er true)', () => {
      const grunnlag: ArbeidsevneGrunnlag = {
        harTilgangTilÅSaksbehandle: true,
        vurderinger: [
          {
            begrunnelse: 'Grunn',
            fraDato: '2024-08-10',
            arbeidsevne: 80,
            vurderingsTidspunkt: '2024-08-10',
            vurdertAv: { ident: 'saksbehandler', dato: '2024-08-10' },
          },
        ],
        historikk: [],
        gjeldendeVedtatteVurderinger: [],
      };
      render(<FastsettArbeidsevne readOnly={true} behandlingVersjon={0} grunnlag={grunnlag} />);
      expect(screen.getByText('Vilkårsvurdering')).toBeVisible();
    });

    it('skal resette state i felt dersom Avbryt-knappen blir trykket', async () => {
      setMockFlytResponse({ ...defaultFlytResponse, aktivtSteg: 'SYKDOMSVURDERING_BREV' });

      render(<FastsettArbeidsevne grunnlag={grunnlagMedVurdering} readOnly={false} behandlingVersjon={0} />);

      const endreKnapp = screen.getByRole('button', { name: 'Endre' });
      await user.click(endreKnapp);

      const begrunnelseFelt = screen.getByRole('textbox', { name: 'Vilkårsvurdering' });
      await user.clear(begrunnelseFelt);
      await user.type(begrunnelseFelt, 'Dette er en ny begrunnelse');
      expect(begrunnelseFelt).toHaveValue('Dette er en ny begrunnelse');

      const avbrytKnapp = screen.getByRole('button', { name: 'Avbryt' });
      await user.click(avbrytKnapp);

      const begrunnelseFeltEtterAvbryt = screen.getByRole('textbox', { name: 'Vilkårsvurdering' });
      expect(begrunnelseFeltEtterAvbryt).toHaveValue('Dette er min vurdering som er bekreftet');
    });
  });

  describe('Felter', () => {
    it('har et felt hvor saksbehandler skal begrunne om brukeren har arbeidsevne', async () => {
      render(<FastsettArbeidsevne readOnly={false} behandlingVersjon={0} grunnlag={grunnlagUtenVurdering} />);
      await åpneVilkårskort();
      await klikkPåNyVurdering();
      expect(screen.getByRole('textbox', { name: 'Vilkårsvurdering' })).toBeVisible();
    });

    it('begrunnelsesfeltet har en beskrivelse', async () => {
      render(<FastsettArbeidsevne readOnly={false} behandlingVersjon={0} grunnlag={grunnlagUtenVurdering} />);
      await åpneVilkårskort();
      await klikkPåNyVurdering();
      expect(
        screen.getByText(
          'Vurder om brukeren har en arbeidsevne som ikke er utnyttet. Hvis det ikke legges inn en vurdering, har brukeren rett på full ytelse.'
        )
      ).toBeVisible();
    });

    it('har et felt for å angi arbeidsevne', async () => {
      render(<FastsettArbeidsevne readOnly={false} behandlingVersjon={0} grunnlag={grunnlagUtenVurdering} />);
      await åpneVilkårskort();
      await klikkPåNyVurdering();
      expect(
        screen.getByRole('textbox', {
          name: 'Oppgi arbeidsevnen som ikke er utnyttet i prosent',
        })
      ).toBeVisible();
    });

    it('har et felt for å angi når arbeidsevnen gjelder fra', async () => {
      render(<FastsettArbeidsevne readOnly={false} behandlingVersjon={0} grunnlag={grunnlagUtenVurdering} />);
      await åpneVilkårskort();
      await klikkPåNyVurdering();
      expect(screen.getByRole('textbox', { name: 'Vurderingen gjelder fra' })).toBeVisible();
    });

    it('viser feilmelding dersom begrunnelse ikke er fylt ut', async () => {
      render(<FastsettArbeidsevne readOnly={false} behandlingVersjon={0} grunnlag={grunnlagUtenVurdering} />);
      await åpneVilkårskort();
      await klikkPåNyVurdering();
      await klikkPåBekreft();
      expect(screen.getByText('Du må begrunne vurderingen din')).toBeVisible();
    });

    it('viser feilmelding når arbeidsevne ikke er besvart', async () => {
      render(<FastsettArbeidsevne readOnly={false} behandlingVersjon={0} grunnlag={grunnlagUtenVurdering} />);
      await åpneVilkårskort();
      await klikkPåNyVurdering();
      await klikkPåBekreft();
      expect(screen.getByText('Du må angi hvor stor arbeidsevne brukeren har')).toBeVisible();
    });

    it('viser feilmelding dersom datoen da arbeidsevnen gjelder fra ikke er besvart', async () => {
      render(<FastsettArbeidsevne readOnly={false} behandlingVersjon={0} grunnlag={grunnlagUtenVurdering} />);
      await åpneVilkårskort();
      await klikkPåNyVurdering();
      await klikkPåBekreft();
      expect(screen.getByText('Du må angi datoen arbeidsevnen gjelder fra')).toBeVisible();
    });

    describe('mellomlagring', () => {
      const mellomlagring: MellomlagretVurderingResponse = {
        mellomlagretVurdering: {
          avklaringsbehovkode: Behovstype.VURDER_TREKK_AV_SØKNAD_KODE,
          behandlingId: { id: 1 },
          data: '{"arbeidsevnevurderinger": [{"begrunnelse":"Dette er min vurdering som er mellomlagret"}]}',
          vurdertDato: '2025-08-21T12:00:00.000',
          vurdertAv: 'Jan T. Loven',
        },
      };

      const grunnlagMedVurdering: ArbeidsevneGrunnlag = {
        harTilgangTilÅSaksbehandle: true,
        vurderinger: [
          {
            arbeidsevne: 20,
            begrunnelse: 'Dette er min vurdering som er bekreftet',
            fraDato: '2025-08-21',
            vurderingsTidspunkt: '2025-08-21',
            vurdertAv: {
              ident: 'Saksbehandler',
              dato: '2025-08-21',
            },
          },
        ],
      };

      it('Skal vise en tekst om hvem som har gjort vurderingen dersom det finnes en mellomlagring', () => {
        render(
          <FastsettArbeidsevne
            readOnly={false}
            behandlingVersjon={0}
            grunnlag={grunnlagUtenVurdering}
            initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
          />
        );
        const tekst = screen.getByText('Utkast lagret 21.08.2025 12:00 (Jan T. Loven)');
        expect(tekst).toBeVisible();
      });

      it('Skal vise en tekst om hvem som har lagret vurdering dersom bruker trykker på lagre mellomlagring', async () => {
        render(<FastsettArbeidsevne readOnly={false} behandlingVersjon={0} grunnlag={grunnlagUtenVurdering} />);

        await åpneVilkårskort();
        await klikkPåNyVurdering();

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
          <FastsettArbeidsevne
            readOnly={false}
            behandlingVersjon={0}
            grunnlag={grunnlagUtenVurdering}
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
          <FastsettArbeidsevne
            readOnly={false}
            behandlingVersjon={0}
            grunnlag={grunnlagUtenVurdering}
            initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
          />
        );

        const begrunnelseFelt = screen.getByRole('textbox', {
          name: 'Vilkårsvurdering',
        });

        expect(begrunnelseFelt).toHaveValue('Dette er min vurdering som er mellomlagret');
      });

      it('Skal bruke bekreftet vurdering fra grunnlag som defaultValue i skjema dersom mellomlagring ikke finnes', () => {
        render(<FastsettArbeidsevne readOnly={false} behandlingVersjon={0} grunnlag={grunnlagMedVurdering} />);

        const begrunnelseFelt = screen.getByRole('textbox', {
          name: 'Vilkårsvurdering',
        });

        expect(begrunnelseFelt).toHaveValue('Dette er min vurdering som er bekreftet');
      });

      it('Skal resette skjema til tomt skjema dersom det ikke finnes en bekreftet vurdering og bruker sletter mellomlagring', async () => {
        render(
          <FastsettArbeidsevne
            readOnly={false}
            behandlingVersjon={0}
            grunnlag={grunnlagUtenVurdering}
            initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
          />
        );

        await user.type(screen.getByRole('textbox', { name: 'Vilkårsvurdering' }), ' her er ekstra tekst');

        expect(screen.getByRole('textbox', { name: 'Vilkårsvurdering' })).toHaveValue(
          'Dette er min vurdering som er mellomlagret her er ekstra tekst'
        );

        const slettKnapp = screen.getByRole('button', { name: 'Slett utkast' });

        await user.click(slettKnapp);

        expect(screen.queryByRole('textbox', { name: 'Vilkårsvurdering' })).not.toBeInTheDocument();
      });

      it('Skal resette skjema til bekreftet vurdering dersom det finnes en bekreftet vurdering og bruker sletter mellomlagring', async () => {
        render(
          <FastsettArbeidsevne
            readOnly={false}
            behandlingVersjon={0}
            grunnlag={grunnlagMedVurdering}
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
          <FastsettArbeidsevne
            readOnly={true}
            behandlingVersjon={0}
            grunnlag={grunnlagMedVurdering}
            initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
          />
        );

        const lagreKnapp = screen.queryByRole('button', { name: 'Lagre utkast' });
        expect(lagreKnapp).not.toBeInTheDocument();
        const slettKnapp = screen.queryByRole('button', { name: 'Slett utkast' });
        expect(slettKnapp).not.toBeInTheDocument();
      });

      it('Vilkårskortet skal være default åpen dersom det finnes en mellomlagret vurdering', () => {
        render(
          <FastsettArbeidsevne
            readOnly={true}
            behandlingVersjon={0}
            grunnlag={grunnlagUtenVurdering}
            initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
          />
        );

        expect(screen.getByRole('textbox', { name: 'Vilkårsvurdering' })).toBeVisible();
      });
    });
  });

  async function klikkPåNyVurdering() {
    await user.click(screen.getByRole('button', { name: 'Legg til ny vurdering' }));
  }

  async function klikkPåBekreft() {
    const bekreftKnapp = screen.getByRole('button', { name: 'Bekreft' });
    await user.click(bekreftKnapp);
  }

  async function åpneVilkårskort() {
    const region = screen.getByRole('region', {
      name: '§ 11-23 andre ledd. Arbeidsevne som ikke er utnyttet (valgfritt)',
    });
    const button = within(region).getByRole('button');
    await user.click(button);
  }
});
