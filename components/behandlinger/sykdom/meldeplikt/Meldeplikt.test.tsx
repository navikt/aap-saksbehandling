import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, within } from 'lib/test/CustomRender';
import userEvent from '@testing-library/user-event';
import { Meldeplikt } from 'components/behandlinger/sykdom/meldeplikt/Meldeplikt';
import { FritakMeldepliktGrunnlag, MellomlagretVurderingResponse } from 'lib/types/types';
import { Behovstype } from 'lib/utils/form';
import { FetchResponse } from 'lib/utils/api';
import createFetchMock from 'vitest-fetch-mock';
import { defaultFlytResponse, setMockFlytResponse } from 'vitestSetup';

const fetchMock = createFetchMock(vi);
fetchMock.enableMocks();
const user = userEvent.setup();

beforeEach(() => {
  setMockFlytResponse({ ...defaultFlytResponse, aktivtSteg: 'FRITAK_MELDEPLIKT' });
});

describe('Meldeplikt', () => {
  describe('generelt', () => {
    it('har overskrift for å identifisere steget', () => {
      render(<Meldeplikt behandlingVersjon={0} readOnly={false} />);
      expect(screen.getByRole('heading', { name: '§ 11-10 tredje ledd. Unntak fra meldeplikt' })).toBeVisible();
    });

    it('er lukket initielt', () => {
      render(<Meldeplikt behandlingVersjon={0} readOnly={false} />);
      expect(screen.queryByRole('textbox', { name: 'Vilkårsvurdering' })).not.toBeInTheDocument();
    });

    it('vises som åpent når det skal kvalitetssikres (readOnly er true og minst en vurdering finnes)', () => {
      const meldepliktGrunnlag: FritakMeldepliktGrunnlag = {
        harTilgangTilÅSaksbehandle: true,
        vurderinger: [
          {
            begrunnelse: 'Grunn',
            fraDato: '2024-08-10',
            harFritak: true,
            vurdertAv: { ident: 'saksbehandler', dato: '2024-08-10' },
            vurderingsTidspunkt: '2024-08-10',
          },
        ],
        gjeldendeVedtatteVurderinger: [],
        historikk: [],
      };
      render(<Meldeplikt behandlingVersjon={0} readOnly={true} grunnlag={meldepliktGrunnlag} />);
      expect(screen.queryByRole('textbox', { name: 'Vilkårsvurdering' })).toBeVisible();
    });

    it('skal resette state i felt dersom Avbryt-knappen blir trykket', async () => {
      const grunnlagMedVurdering: FritakMeldepliktGrunnlag = {
        harTilgangTilÅSaksbehandle: true,
        vurderinger: [
          {
            begrunnelse: 'en god begrunnelse',
            fraDato: '2024-08-10',
            harFritak: true,
            vurdertAv: { ident: 'saksbehandler', dato: '2024-08-10' },
            vurderingsTidspunkt: '2024-08-10',
          },
        ],
        gjeldendeVedtatteVurderinger: [],
        historikk: [],
      };

      setMockFlytResponse({ ...defaultFlytResponse, aktivtSteg: 'AVKLAR_SYKDOM' });

      render(<Meldeplikt grunnlag={grunnlagMedVurdering} readOnly={false} behandlingVersjon={0} />);

      const endreKnapp = screen.getByRole('button', { name: 'Endre' });
      await user.click(endreKnapp);

      const begrunnelseFelt = screen.getByRole('textbox', { name: 'Vilkårsvurdering' });
      await user.clear(begrunnelseFelt);
      await user.type(begrunnelseFelt, 'Dette er en ny begrunnelse');
      expect(begrunnelseFelt).toHaveValue('Dette er en ny begrunnelse');

      const avbrytKnapp = screen.getByRole('button', { name: 'Avbryt' });
      await user.click(avbrytKnapp);

      const begrunnelseFeltEtterAvbryt = screen.getByRole('textbox', { name: 'Vilkårsvurdering' });
      expect(begrunnelseFeltEtterAvbryt).toHaveValue('en god begrunnelse');
    });
  });

  describe('felter', () => {
    it('har et felt for begrunnelse', async () => {
      render(<Meldeplikt behandlingVersjon={0} readOnly={false} />);
      await åpneVilkårskort();
      await klikkPåNyPeriode();
      expect(screen.getByRole('textbox', { name: 'Vilkårsvurdering' })).toBeVisible();
    });

    it('har valg for å avgjøre om brukeren skal få fritak fra meldeplikt eller ikke', async () => {
      render(<Meldeplikt behandlingVersjon={0} readOnly={false} />);
      await åpneVilkårskort();
      await klikkPåNyPeriode();
      expect(screen.getByRole('group', { name: 'Skal brukeren få fritak fra meldeplikt?' })).toBeVisible();
    });

    it('har et valg for å si at brukeren skal få fritak fra meldeplikt', async () => {
      render(<Meldeplikt behandlingVersjon={0} readOnly={false} />);
      await åpneVilkårskort();
      await klikkPåNyPeriode();
      const fritakGruppe = screen.getByRole('group', { name: 'Skal brukeren få fritak fra meldeplikt?' });
      expect(within(fritakGruppe).getByRole('radio', { name: 'Ja' })).toBeVisible();
    });

    it('har et valg for å si at brukeren ikke skal ha fritak fra meldeplikt', async () => {
      render(<Meldeplikt behandlingVersjon={0} readOnly={false} />);
      await åpneVilkårskort();
      await klikkPåNyPeriode();
      const fritakGruppe = screen.getByRole('group', { name: 'Skal brukeren få fritak fra meldeplikt?' });
      expect(within(fritakGruppe).getByRole('radio', { name: 'Nei' })).toBeVisible();
    });

    it('har et felt for å fylle inn en dato for når vurderingen gjelder fra', async () => {
      render(<Meldeplikt behandlingVersjon={0} readOnly={false} />);
      await åpneVilkårskort();
      await klikkPåNyPeriode();
      expect(screen.getByRole('textbox', { name: 'Vurderingen gjelder fra' })).toBeVisible();
    });
  });

  describe('mellomlagring', () => {
    const mellomlagring: MellomlagretVurderingResponse = {
      mellomlagretVurdering: {
        avklaringsbehovkode: Behovstype.VURDER_TREKK_AV_SØKNAD_KODE,
        behandlingId: { id: 1 },
        data: '{"fritaksvurderinger": [{"begrunnelse":"Dette er min vurdering som er mellomlagret"}]}',
        vurdertDato: '2025-08-21T12:00:00.000',
        vurdertAv: 'Jan T. Loven',
      },
    };
    const grunnlagMedVurdering: FritakMeldepliktGrunnlag = {
      gjeldendeVedtatteVurderinger: [],
      harTilgangTilÅSaksbehandle: true,
      historikk: [],
      vurderinger: [
        {
          begrunnelse: 'Dette er min vurdering som er bekreftet',
          fraDato: '2025-08-21',
          harFritak: true,
          vurderingsTidspunkt: '2025-08-21',
          vurdertAv: {
            dato: '2025-08-21',
            ident: 'Saksbehandler',
          },
        },
      ],
    };

    const grunnlagUtenVurdering: FritakMeldepliktGrunnlag = {
      gjeldendeVedtatteVurderinger: [],
      harTilgangTilÅSaksbehandle: true,
      historikk: [],
      vurderinger: [],
    };

    it('Skal vise en tekst om hvem som har gjort vurderingen dersom det finnes en mellomlagring', () => {
      render(
        <Meldeplikt
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
      render(<Meldeplikt readOnly={false} behandlingVersjon={0} grunnlag={grunnlagUtenVurdering} />);

      await åpneVilkårskort();
      await klikkPåNyPeriode();

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
        <Meldeplikt
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
        <Meldeplikt
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
      render(<Meldeplikt readOnly={false} behandlingVersjon={0} grunnlag={grunnlagMedVurdering} />);

      const begrunnelseFelt = screen.getByRole('textbox', {
        name: 'Vilkårsvurdering',
      });

      expect(begrunnelseFelt).toHaveValue('Dette er min vurdering som er bekreftet');
    });

    it('Skal resette skjema til tomt skjema dersom det ikke finnes en bekreftet vurdering og bruker sletter mellomlagring', async () => {
      render(
        <Meldeplikt
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
        <Meldeplikt
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
        <Meldeplikt
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
        <Meldeplikt
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

async function klikkPåNyPeriode() {
  await user.click(screen.getByRole('button', { name: 'Legg til periode' }));
}

async function åpneVilkårskort() {
  const region = screen.getByRole('region', { name: '§ 11-10 tredje ledd. Unntak fra meldeplikt' });
  const button = within(region).getByRole('button');
  await user.click(button);
}
