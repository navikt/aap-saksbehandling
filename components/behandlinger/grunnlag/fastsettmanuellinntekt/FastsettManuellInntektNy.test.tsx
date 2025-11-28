import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from 'lib/test/CustomRender';
import { FastsettManuellInntektNy } from 'components/behandlinger/grunnlag/fastsettmanuellinntekt/FastsettManuellInntektNy';
import { ManuellInntektGrunnlag } from 'lib/types/types';
import userEvent from '@testing-library/user-event';
import { defaultFlytResponse, setMockFlytResponse } from 'vitestSetup';
import { within } from '@testing-library/react';

const user = userEvent.setup();

describe('Manglende pensjonsgivende inntekter / EØS inntekter', () => {
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

  beforeEach(() => {
    setMockFlytResponse({ ...defaultFlytResponse, aktivtSteg: 'MANGLENDE_LIGNING' });
    render(
      <FastsettManuellInntektNy
        heading={'Manglende pensjonsgivende inntekter / EØS inntekter'}
        behandlingsversjon={1}
        grunnlag={grunnlag}
        readOnly={false}
      />
    );
  });

  it('skal ha et felt for begrunnelse', () => {
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

  // TODO skriv tester for historiske vurderinger
  // TODO skriv tester for mellomlagring
});
