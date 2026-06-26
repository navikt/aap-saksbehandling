import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from 'lib/test/CustomRender';
import { FastsettManuellInntekt } from 'components/behandlinger/grunnlag/fastsettmanuellinntekt/FastsettManuellInntekt';
import { ManuellInntektGrunnlag, MellomlagretVurderingResponse } from 'lib/types/types';
import userEvent from '@testing-library/user-event';
import { defaultFlytResponse, setMockFlytResponse } from 'vitestSetup';
import { within } from '@testing-library/react';
import createFetchMock from 'vitest-fetch-mock';
import { FetchResponse } from 'lib/utils/api';

const user = userEvent.setup();

describe('Manglende pensjonsgivende inntekt / EØS-beregnet inntekt', () => {
  const grunnlag: ManuellInntektGrunnlag = {
    manglerInntektForÅr: [2022, 2024],
    sisteRelevanteÅr: 2024,
    alleRelevanteÅr: [2022, 2023, 2024],
    manglendeMånedsInntekter: [],
    harTilgangTilÅSaksbehandle: true,
    manuelleVurderinger: {
      årsVurderinger: [{ år: 2022 }, { år: 2023, beløp: 200000, eøsBeløp: 50000 }, { år: 2024, eøsBeløp: 300000 }],
      begrunnelse: '',
      vurderingerMeta: {
        vurdertAv: {
          dato: '2025-11-27',
          ident: 'Saksbehandler',
        },
      },
    },
    registrerteInntekterSisteRelevanteAr: [
      { år: 2022, beløp: 230000 },
      { år: 2023, beløp: 100000 },
    ],
  };

  const grunnlagMedVurdering: ManuellInntektGrunnlag = {
    sisteRelevanteÅr: 2024,
    manglerInntektForÅr: [2024, 2023, 2021],
    alleRelevanteÅr: [2022, 2024],
    manglendeMånedsInntekter: [],
    harTilgangTilÅSaksbehandle: true,
    manuelleVurderinger: {
      årsVurderinger: [{ år: 2022 }, { år: 2023, beløp: 200000 }, { år: 2024 }],
      begrunnelse: 'Dette er en begrunnelse',
      vurderingerMeta: {
        vurdertAv: {
          dato: '2025-11-27',
          ident: 'Saksbehandler',
        },
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
      render(
        <FastsettManuellInntekt
          behandlingsversjon={1}
          grunnlag={grunnlag}
          readOnly={false}
          behandlingErRevurdering={false}
        />
      );
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
      // Det mangler inntekter for to år
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

    it('skal oppdatere total-kolonnen når bruker taster inn verdier', async () => {
      const tabell = screen.getByTestId('inntektstabell');
      const rader = within(tabell).getAllByRole('row');

      // Rad 3 (2024) har ingen ferdig lignet PGI, så beregnetPGI og eøsInntekt er redigerbare
      const beregnetPGIInput = within(rader[2]).getByTestId('beregnetPGI').querySelector('input')!;
      const eøsInntektInput = within(rader[2]).getByTestId('eøsInntekt').querySelector('input')!;

      await user.clear(beregnetPGIInput);
      await user.type(beregnetPGIInput, '400000');
      await user.clear(eøsInntektInput);
      await user.type(eøsInntektInput, '100000');

      expect(within(rader[2]).getByTestId('totalt').textContent).toBe('500 000 kr');
    });
  });

  // TODO skriv tester for historiske vurderinger

  describe('Endring i uføregrad (delperioder)', () => {
    const grunnlagMedDelperioder: ManuellInntektGrunnlag = {
      sisteRelevanteÅr: 2024,
      alleRelevanteÅr: [2022, 2023, 2024],
      manglerInntektForÅr: [2022],
      harTilgangTilÅSaksbehandle: true,
      registrerteInntekterSisteRelevanteAr: [
        { år: 2022, beløp: 640500 },
        { år: 2023, beløp: 500000 },
        { år: 2024, beløp: 300000 },
      ],
      manglendeMånedsInntekter: [
        { periode: { fom: '2022-01-01', tom: '2022-02-28' }, uføregrad: 0 },
        { periode: { fom: '2022-03-01', tom: '2022-12-31' }, uføregrad: 50 },
      ],
    };

    beforeEach(() => {
      render(
        <FastsettManuellInntekt
          behandlingsversjon={1}
          grunnlag={grunnlagMedDelperioder}
          readOnly={false}
          behandlingErRevurdering={false}
        />
      );
    });

    it('skal vise advarsel om endring i uføregrad med segmentene', () => {
      expect(screen.getByText(/Brukeren har hatt endring i uføregrad i løpet av 2022/)).toBeVisible();
      expect(screen.getByText('01.01.2022 - 0%')).toBeVisible();
      expect(screen.getByText('01.03.2022 - 50%')).toBeVisible();
    });

    it('skal vise informasjonsrad for split-året og én rad per delperiode', () => {
      const tabell = screen.getByTestId('inntektstabell');
      const rader = within(tabell).getAllByRole('row');
      const etiketter = rader.map((rad) => within(rad).getAllByRole('cell')[0].textContent);
      expect(etiketter).toEqual(['2022', '2022 jan.-feb.', '2022 mars-des.', '2023', '2024']);
    });

    it('split-årets informasjonsrad har ingen input, mens delperiode-radene er redigerbare', () => {
      const tabell = screen.getByTestId('inntektstabell');
      const rader = within(tabell).getAllByRole('row');

      // Rad 0 = 2022 (informasjonsrad): ingen input for beregnet PGI
      expect(within(rader[0]).getByTestId('beregnetPGI').querySelector('input')).toBeNull();
      // Rad 1 = 2022 jan-feb (delperiode): har input
      expect(within(rader[1]).getByTestId('beregnetPGI').querySelector('input')).not.toBeNull();
      expect(within(rader[2]).getByTestId('beregnetPGI').querySelector('input')).not.toBeNull();
    });

    it('skal vise avviksadvarsel når sum av beregnet PGI avviker fra ferdig lignet PGI', async () => {
      const tabell = screen.getByTestId('inntektstabell');
      const rader = within(tabell).getAllByRole('row');

      const janFeb = within(rader[1]).getByTestId('beregnetPGI').querySelector('input')!;
      const marDes = within(rader[2]).getByTestId('beregnetPGI').querySelector('input')!;

      const advarselTekst =
        'Beregnet pensjonsgivende inntekt avviker fra ferdig lignet pensjonsgivende inntekt. Er du sikker på at beregnet inntekt er riktig?';

      expect(screen.queryByText(advarselTekst)).not.toBeInTheDocument();

      await user.type(janFeb, '100000');
      await user.type(marDes, '500000');

      expect(screen.getByText(advarselTekst)).toBeVisible();
    });

    it('skal ikke vise avviksadvarsel når sum av beregnet PGI er lik ferdig lignet PGI', async () => {
      const tabell = screen.getByTestId('inntektstabell');
      const rader = within(tabell).getAllByRole('row');

      const janFeb = within(rader[1]).getByTestId('beregnetPGI').querySelector('input')!;
      const marDes = within(rader[2]).getByTestId('beregnetPGI').querySelector('input')!;

      await user.type(janFeb, '140500');
      await user.type(marDes, '500000');

      expect(
        screen.queryByText(
          'Beregnet pensjonsgivende inntekt avviker fra ferdig lignet pensjonsgivende inntekt. Er du sikker på at beregnet inntekt er riktig?'
        )
      ).not.toBeInTheDocument();
    });
  });

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
        <FastsettManuellInntekt
          behandlingsversjon={0}
          grunnlag={grunnlag}
          readOnly={false}
          initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
          behandlingErRevurdering={false}
        />
      );

      const tekst = screen.getByText('Utkast lagret 21.08.2025 12:00 (Jan T. Loven)');
      expect(tekst).toBeVisible();
    });

    it('Skal ikke vise tekst om hvem som har gjort mellomlagring dersom bruker trykker på slett mellomlagring', async () => {
      render(
        <FastsettManuellInntekt
          behandlingsversjon={0}
          grunnlag={grunnlag}
          readOnly={false}
          initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
          behandlingErRevurdering={false}
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
        <FastsettManuellInntekt
          behandlingsversjon={0}
          grunnlag={grunnlag}
          readOnly={false}
          initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
          behandlingErRevurdering={false}
        />
      );

      const begrunnelseFelt = screen.getByRole('textbox', {
        name: 'Begrunnelse for endret arbeidsinntekt',
      });
      expect(begrunnelseFelt).toHaveValue('Dette er min vurdering som er mellomlagret');
    });

    it('Skal bruke bekreftet vurdering fra grunnlag som defaultValue i skjema dersom mellomlagring ikke finnes', () => {
      render(
        <FastsettManuellInntekt
          behandlingsversjon={0}
          grunnlag={grunnlagMedVurdering}
          readOnly={false}
          behandlingErRevurdering={false}
        />
      );

      const begrunnelseFelt = screen.getByRole('textbox', {
        name: 'Begrunnelse for endret arbeidsinntekt',
      });
      expect(begrunnelseFelt).toHaveValue('Dette er en begrunnelse');
    });

    it('Skal resette skjema til tomt skjema dersom det ikke finnes en bekreftet vurdering og bruker sletter mellomlagring', async () => {
      render(
        <FastsettManuellInntekt
          behandlingsversjon={0}
          grunnlag={grunnlag}
          readOnly={false}
          initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
          behandlingErRevurdering={false}
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
        <FastsettManuellInntekt
          behandlingsversjon={0}
          grunnlag={grunnlagMedVurdering}
          readOnly={false}
          initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
          behandlingErRevurdering={false}
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

    it('Skal ikke være mulig å slette mellomlagring hvis det er readOnly', () => {
      render(
        <FastsettManuellInntekt
          behandlingsversjon={0}
          grunnlag={grunnlag}
          readOnly={true}
          behandlingErRevurdering={false}
        />
      );

      const slettKnapp = screen.queryByRole('button', { name: 'Slett utkast' });
      expect(slettKnapp).not.toBeInTheDocument();
    });
  });
});
