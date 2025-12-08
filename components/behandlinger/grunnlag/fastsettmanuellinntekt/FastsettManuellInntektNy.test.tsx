import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from 'lib/test/CustomRender';
import { FastsettManuellInntektNy } from 'components/behandlinger/grunnlag/fastsettmanuellinntekt/FastsettManuellInntektNy';
import { ManuellInntektGrunnlag, MellomlagretVurderingResponse } from 'lib/types/types';
import userEvent from '@testing-library/user-event';
import { defaultFlytResponse, setMockFlytResponse } from 'vitestSetup';
import { within } from '@testing-library/react';
import createFetchMock from 'vitest-fetch-mock';
import { FetchResponse } from 'lib/utils/api';
import { FastsettManuellInntektInfo } from 'components/behandlinger/grunnlag/fastsettmanuellinntekt/FastsettManuellInntektInfo';

const user = userEvent.setup();

describe('Manglende pensjonsgivende inntekter / EØS inntekter', () => {
  const heading = 'Manglende pensjonsgivende inntekter / EØS inntekter';

  const grunnlag: ManuellInntektGrunnlag = {
    ar: 2024,
    gverdi: 0,
    harTilgangTilÅSaksbehandle: true,
    historiskeVurderinger: [],
    manuelleVurderinger: {
      årsVurderinger: [{ år: 2022 }, { år: 2023, beløp: 200000, eøsBeløp: 50000 }, { år: 2024, eøsBeløp: 300000 }],
      begrunnelse: '',
      vurdertAv: {
        dato: '2025-11-27',
        ident: 'Saksbehandler',
      },
    },
    registrerteInntekterSisteRelevanteAr: [
      { år: 2022, beløp: 230000 },
      { år: 2023, beløp: 100000 },
    ],
  };

  const grunnlagMedVurdering: ManuellInntektGrunnlag = {
    ar: 2024,
    gverdi: 0,
    harTilgangTilÅSaksbehandle: true,
    historiskeVurderinger: [],
    manuelleVurderinger: {
      årsVurderinger: [{ år: 2022 }, { år: 2023, beløp: 200000 }, { år: 2024 }],
      begrunnelse: 'Dette er en begrunnelse',
      vurdertAv: {
        dato: '2025-11-27',
        ident: 'Saksbehandler',
      },
    },
    registrerteInntekterSisteRelevanteAr: [
      { år: 2022, beløp: 230000 },
      { år: 2023, beløp: 100000 },
    ],
  };

  beforeEach(() => {
    setMockFlytResponse({ ...defaultFlytResponse, aktivtSteg: 'MANGLENDE_LIGNING' });
  });

  describe('Generelt', () => {
    beforeEach(() => {
      render(<FastsettManuellInntektInfo behandlingsversjon={1} grunnlag={grunnlag} readOnly={false} />);
    });

    it('skal vise hovedkort dersom det mangler PGI eller finnes manuelle endringer i grunnlag', () => {
      const felt = screen.getByRole('textbox', { name: 'Begrunnelse for endret arbeidsinntekt' });
      expect(felt).toBeVisible();
    });

    it('skal gi en feilmelding om begrunnelse mangler', async () => {
      const bekreftKnapp = screen.getByRole('button', { name: 'Bekreft' });
      await user.click(bekreftKnapp);

      const feilmelding = screen.getByText('Du må gi en begrunnelse.');
      expect(feilmelding).toBeVisible();
    });

    it('skal gi en feilmelding dersom det mangler utfylt PGI for et år', async () => {
      const bekreftKnapp = screen.getByRole('button', { name: 'Bekreft' });
      await user.click(bekreftKnapp);

      const feilmelding = screen.getByText('Du må fylle inn beregnet PGI');
      expect(feilmelding).toBeVisible();
    });

    it('skal liste opp de tre siste relevante årene i tabell', () => {
      const tabell = screen.getByTestId('inntektstabell');
      const rader = within(tabell).getAllByRole('row');
      expect(rader).toHaveLength(3);
      const årstall = rader.map((rad) => within(rad).getByText(/\d{4}/).textContent);
      expect(årstall).toEqual(['2022', '2023', '2024']);
    });

    it('skal vise ferdig lignet PGI fra grunnlag i tabell', () => {
      const tabell = screen.getByTestId('inntektstabell');
      const rader = within(tabell).getAllByRole('row');
      const ferdigLignetPGI = rader.map((rad) => within(rad).getByTestId('ferdigLignetPGI').textContent);
      expect(ferdigLignetPGI).toEqual(['230 000 kr', '100 000 kr', '-']);
    });

    it('skal vise manuelle inntekter fra grunnlag i tabell', () => {
      const beregnetPGICells = screen.queryAllByTestId('beregnetPGI');
      const beregnetPGIValues = beregnetPGICells.map((cell) => {
        const input = cell.querySelector('input');
        return input ? input.value : '';
      });
      expect(beregnetPGIValues).toEqual(['', '200000', '']);
    });

    it('skal summere inntekter per år og vise totalen', () => {
      const tabell = screen.getByTestId('inntektstabell');
      const rader = within(tabell).getAllByRole('row');
      const totalCells = rader.map((rad) => within(rad).getByTestId('totalt').textContent);
      expect(totalCells).toEqual(['230 000 kr', '250 000 kr', '300 000 kr']);
    });
  });

  // TODO skriv tester for historiske vurderinger

  describe('Mellomlagring', () => {
    const fetchMock = createFetchMock(vi);
    fetchMock.enableMocks();

    const mellomlagring: MellomlagretVurderingResponse = {
      mellomlagretVurdering: {
        avklaringsbehovkode: '7001',
        behandlingId: { id: 1 },
        data: '{"begrunnelse":"Dette er min vurdering som er mellomlagret"}',
        vurdertDato: '2025-08-21T12:00:00.000',
        vurdertAv: 'Jan T. Loven',
      },
    };

    it('Skal vise en tekst om hvem som har gjort vurderingen dersom det finnes en mellomlagring', () => {
      render(
        <FastsettManuellInntektNy
          heading={heading}
          behandlingsversjon={0}
          grunnlag={grunnlag}
          readOnly={false}
          initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
        />
      );

      const tekst = screen.getByText('Utkast lagret 21.08.2025 12:00 (Jan T. Loven)');
      expect(tekst).toBeVisible();
    });

    it('Skal vise en tekst om hvem som har lagret vurdering dersom bruker trykker på lagre mellomlagring', async () => {
      render(
        <FastsettManuellInntektNy heading={heading} behandlingsversjon={0} grunnlag={grunnlag} readOnly={false} />
      );

      await user.type(
        screen.getByRole('textbox', { name: 'Begrunnelse for endret arbeidsinntekt' }),
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
        <FastsettManuellInntektNy
          heading={heading}
          behandlingsversjon={0}
          grunnlag={grunnlag}
          readOnly={false}
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
        <FastsettManuellInntektNy
          heading={heading}
          behandlingsversjon={0}
          grunnlag={grunnlag}
          readOnly={false}
          initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
        />
      );

      const begrunnelseFelt = screen.getByRole('textbox', {
        name: 'Begrunnelse for endret arbeidsinntekt',
      });
      expect(begrunnelseFelt).toHaveValue('Dette er min vurdering som er mellomlagret');
    });

    it('Skal bruke bekreftet vurdering fra grunnlag som defaultValue i skjema dersom mellomlagring ikke finnes', () => {
      render(
        <FastsettManuellInntektNy
          heading={heading}
          behandlingsversjon={0}
          grunnlag={grunnlagMedVurdering}
          readOnly={false}
        />
      );

      const begrunnelseFelt = screen.getByRole('textbox', {
        name: 'Begrunnelse for endret arbeidsinntekt',
      });
      expect(begrunnelseFelt).toHaveValue('Dette er en begrunnelse');
    });

    it('Skal resette skjema til tomt skjema dersom det ikke finnes en bekreftet vurdering og bruker sletter mellomlagring', async () => {
      render(
        <FastsettManuellInntektNy
          heading={heading}
          behandlingsversjon={0}
          grunnlag={grunnlag}
          readOnly={false}
          initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
        />
      );

      const begrunnelseFelt = screen.getByRole('textbox', {
        name: 'Begrunnelse for endret arbeidsinntekt',
      });

      await user.type(begrunnelseFelt, ' her er ekstra tekst');
      expect(begrunnelseFelt).toHaveValue('Dette er min vurdering som er mellomlagret her er ekstra tekst');

      const slettKnapp = screen.getByRole('button', { name: 'Slett utkast' });
      await user.click(slettKnapp);
      expect(begrunnelseFelt).toHaveValue('');
    });

    it('Skal resette skjema til bekreftet vurdering dersom det finnes en bekreftet vurdering og bruker sletter mellomlagring', async () => {
      render(
        <FastsettManuellInntektNy
          heading={heading}
          behandlingsversjon={0}
          grunnlag={grunnlagMedVurdering}
          readOnly={false}
          initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
        />
      );

      const begrunnelseFelt = screen.getByRole('textbox', {
        name: 'Begrunnelse for endret arbeidsinntekt',
      });

      await user.type(begrunnelseFelt, ' her er ekstra tekst');
      expect(begrunnelseFelt).toHaveValue('Dette er min vurdering som er mellomlagret her er ekstra tekst');

      const slettKnapp = screen.getByRole('button', { name: 'Slett utkast' });
      await user.click(slettKnapp);
      expect(begrunnelseFelt).toHaveValue('Dette er en begrunnelse');
    });

    it('Skal ikke være mulig å lagre eller slette mellomlagring hvis det er readOnly', () => {
      render(<FastsettManuellInntektNy heading={heading} behandlingsversjon={0} grunnlag={grunnlag} readOnly={true} />);

      const lagreKnapp = screen.queryByRole('button', { name: 'Lagre utkast' });
      expect(lagreKnapp).not.toBeInTheDocument();

      const slettKnapp = screen.queryByRole('button', { name: 'Slett utkast' });
      expect(slettKnapp).not.toBeInTheDocument();
    });
  });
});
