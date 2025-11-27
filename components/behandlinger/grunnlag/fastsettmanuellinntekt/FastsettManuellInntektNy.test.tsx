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
      aarsVurderinger: [
        { ar: 2022, belop: null, eosBelop: null, gverdi: 0 },
        { ar: 2023, belop: null, eosBelop: null, gverdi: 0 },
        { ar: 2024, belop: null, eosBelop: null, gverdi: 0 },
      ],
      begrunnelse: '',
      vurdertAv: {
        dato: '2025-11-27',
        ident: 'Saksbehandler',
      },
    },
    registrerteInntekterSisteRelevanteAr: [{ ar: 2023, belop: null, eosBelop: null, gverdi: 0 }],
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

  // TODO fiks denne testen
  it.skip('skal gi en feilmelding dersom det mangler utfylt PGI for et år', async () => {
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

  // TODO fiks denne testen
  it.skip('skal vise ferdig lignet PGI fra grunnlag i tabell', () => {
    const tabell = screen.getByTestId('inntektstabell');
    const rader = within(tabell).getAllByRole('row');
    const ferdigLignetPGI = rader.map((rad) => within(rad).getByTestId('ferdigLignetPGI').textContent);
    expect(ferdigLignetPGI).toEqual(['-', '520 000 kr', '-']);
  });

  // TODO fiks denne testen
  it.skip('skal vise manuelle inntekter fra grunnlag i tabell', () => {
    const beregnetPGICells = screen.queryAllByTestId('beregnetPGI');
    const beregnetPGIValues = beregnetPGICells.map((cell) => {
      const input = cell.querySelector('input');
      return input ? input.value : '';
    });
    expect(beregnetPGIValues).toEqual(['', '100000', '200000']);
  });

  // TODO skriv denne testen
  it.skip('skal summere inntekter per år og vise totalen', () => {});

  // TODO skriv tester for historiske vurderinger
  // TODO skriv tester for mellomlagring
});
