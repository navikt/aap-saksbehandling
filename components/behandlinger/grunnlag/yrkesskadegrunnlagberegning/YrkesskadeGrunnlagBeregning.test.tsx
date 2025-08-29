import { describe, expect, it, vi } from 'vitest';
import { render, screen } from 'lib/test/CustomRender';
import { userEvent } from '@testing-library/user-event';
import { YrkesskadeGrunnlagBeregning } from './YrkesskadeGrunnlagBeregning';
import { MellomlagretVurderingResponse, YrkeskadeBeregningGrunnlag } from 'lib/types/types';
import { Behovstype } from 'lib/utils/form';
import { FetchResponse } from 'lib/utils/api';
import createFetchMock from 'vitest-fetch-mock';

const fetchMock = createFetchMock(vi);
fetchMock.enableMocks();
const user = userEvent.setup();

describe('YrkesskadeGrunnlagBeregning', () => {
  it('skal ha instruksjoner', () => {
    render(
      <YrkesskadeGrunnlagBeregning
        readOnly={false}
        behandlingVersjon={0}
        yrkeskadeBeregningGrunnlag={{
          harTilgangTilÅSaksbehandle: true,
          skalVurderes: [
            {
              referanse: 'ABCDE',
              saksnummer: 1234,
              kilde: 'INFOTRYGD',
              skadeDato: '1989-02-13',
              grunnbeløp: { verdi: 200000 },
            },
          ],
          vurderinger: [],
          historiskeVurderinger: [],
        }}
      />
    );
    const heading = screen.getByText(
      'Beregn antatt årlig arbeidsinntekt ved skadetidspunktet etter § 11-22. Inntekten skal ikke G-justeres.'
    );
    expect(heading).toBeVisible();
  });

  it('validering på manglende begrunnelse', async () => {
    render(
      <YrkesskadeGrunnlagBeregning
        readOnly={false}
        behandlingVersjon={0}
        yrkeskadeBeregningGrunnlag={{
          harTilgangTilÅSaksbehandle: true,
          skalVurderes: [
            {
              referanse: 'ABCDE',
              saksnummer: 1234,
              kilde: 'INFOTRYGD',
              skadeDato: '1989-02-13',
              grunnbeløp: { verdi: 200000 },
            },
          ],
          vurderinger: [],
          historiskeVurderinger: [],
        }}
      />
    );

    await velgBekreft();
    const feilmelding = screen.getByText('Du må oppgi en begrunnelse for anslått arbeidsinntekt.');
    expect(feilmelding).toBeVisible();

    const tekstFelt = screen.getByRole('textbox');
    await user.type(tekstFelt, 'en begrunnelse');

    await velgBekreft();

    const manglendeFeilmelding = screen.queryByText('Du må oppgi en begrunnelse for anslått arbeidsinntekt.');
    expect(manglendeFeilmelding).toBeNull();
  });
});

describe('mellomlagring', () => {
  const mellomlagring: MellomlagretVurderingResponse = {
    mellomlagretVurdering: {
      avklaringsbehovkode: Behovstype.FASTSETT_YRKESSKADEINNTEKT,
      behandlingId: { id: 1 },
      data: '{"vurderinger": [{"begrunnelse":"Dette er min vurdering som er mellomlagret", "skadetidspunkt": "2025-06-27"}]}',
      vurdertDato: '2025-08-21T12:00:00.000',
      vurdertAv: 'Jan T. Loven',
    },
  };

  const grunnlagUtenVurdering: YrkeskadeBeregningGrunnlag = {
    harTilgangTilÅSaksbehandle: true,
    historiskeVurderinger: [],
    skalVurderes: [
      {
        referanse: 'YRK',
        skadeDato: '2025-06-27',
        grunnbeløp: {
          verdi: 128116,
        },
        kilde: 'INFOTRYGD',
      },
    ],
    vurderinger: [],
  };

  const grunnlagMedVurdering: YrkeskadeBeregningGrunnlag = {
    harTilgangTilÅSaksbehandle: true,
    skalVurderes: [
      {
        referanse: 'YRK',
        skadeDato: '2025-06-27',
        grunnbeløp: {
          verdi: 128116,
        },
        kilde: 'INFOTRYGD',
      },
    ],
    vurderinger: [
      {
        antattÅrligInntekt: {
          verdi: 500000,
        },
        referanse: 'YRK',
        begrunnelse: 'Dette er min vurdering som er bekreftet',
        vurdertAv: {
          ident: 'KVALITETSSIKRER',
          dato: '2025-08-26',
          ansattnavn: 'KVALITETSSIKRER',
          enhetsnavn: 'Lokalenhetsnavn',
        },
      },
    ],
    historiskeVurderinger: [],
  };

  it('Skal vise en tekst om hvem som har gjort vurderingen dersom det finnes en mellomlagring', () => {
    render(
      <YrkesskadeGrunnlagBeregning
        readOnly={false}
        behandlingVersjon={0}
        yrkeskadeBeregningGrunnlag={grunnlagUtenVurdering}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
      />
    );
    const tekst = screen.getByText('Utkast lagret 21.08.2025 12:00 (Jan T. Loven)');
    expect(tekst).toBeVisible();
  });

  it('Skal vise en tekst om hvem som har lagret vurdering dersom bruker trykker på lagre mellomlagring', async () => {
    render(
      <YrkesskadeGrunnlagBeregning
        yrkeskadeBeregningGrunnlag={grunnlagUtenVurdering}
        behandlingVersjon={0}
        readOnly={false}
      />
    );

    await user.type(
      screen.getByRole('textbox', {
        name: 'Begrunnelse for anslått årlig arbeidsinntekt for skadetidspunkt 27.06.2025',
      }),
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
      <YrkesskadeGrunnlagBeregning
        behandlingVersjon={0}
        readOnly={false}
        yrkeskadeBeregningGrunnlag={grunnlagUtenVurdering}
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
      <YrkesskadeGrunnlagBeregning
        behandlingVersjon={0}
        readOnly={false}
        yrkeskadeBeregningGrunnlag={grunnlagMedVurdering}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
      />
    );

    const begrunnelseFelt = screen.getByRole('textbox', {
      name: 'Begrunnelse for anslått årlig arbeidsinntekt for skadetidspunkt 27.06.2025',
    });

    expect(begrunnelseFelt).toHaveValue('Dette er min vurdering som er mellomlagret');
  });

  it('Skal bruke bekreftet vurdering fra grunnlag som defaultValue i skjema dersom mellomlagring ikke finnes', () => {
    render(
      <YrkesskadeGrunnlagBeregning
        behandlingVersjon={0}
        readOnly={false}
        yrkeskadeBeregningGrunnlag={grunnlagMedVurdering}
      />
    );

    const begrunnelseFelt = screen.getByRole('textbox', {
      name: 'Begrunnelse for anslått årlig arbeidsinntekt for skadetidspunkt 27.06.2025',
    });

    expect(begrunnelseFelt).toHaveValue('Dette er min vurdering som er bekreftet');
  });

  it('Skal resette skjema til tomt skjema dersom det ikke finnes en bekreftet vurdering og bruker sletter mellomlagring', async () => {
    render(
      <YrkesskadeGrunnlagBeregning
        behandlingVersjon={0}
        readOnly={false}
        yrkeskadeBeregningGrunnlag={grunnlagUtenVurdering}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
      />
    );

    await user.type(
      screen.getByRole('textbox', {
        name: 'Begrunnelse for anslått årlig arbeidsinntekt for skadetidspunkt 27.06.2025',
      }),
      ' her er ekstra tekst'
    );

    expect(
      screen.getByRole('textbox', {
        name: 'Begrunnelse for anslått årlig arbeidsinntekt for skadetidspunkt 27.06.2025',
      })
    ).toHaveValue('Dette er min vurdering som er mellomlagret her er ekstra tekst');

    const slettKnapp = screen.getByRole('button', { name: 'Slett utkast' });

    await user.click(slettKnapp);

    expect(
      screen.getByRole('textbox', {
        name: 'Begrunnelse for anslått årlig arbeidsinntekt for skadetidspunkt 27.06.2025',
      })
    ).toHaveValue('');
  });

  it('Skal resette skjema til bekreftet vurdering dersom det finnes en bekreftet vurdering og bruker sletter mellomlagring', async () => {
    render(
      <YrkesskadeGrunnlagBeregning
        behandlingVersjon={0}
        readOnly={false}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
        yrkeskadeBeregningGrunnlag={grunnlagMedVurdering}
      />
    );

    await user.type(
      screen.getByRole('textbox', {
        name: 'Begrunnelse for anslått årlig arbeidsinntekt for skadetidspunkt 27.06.2025',
      }),
      ' her er ekstra tekst'
    );

    expect(
      screen.getByRole('textbox', {
        name: 'Begrunnelse for anslått årlig arbeidsinntekt for skadetidspunkt 27.06.2025',
      })
    ).toHaveValue('Dette er min vurdering som er mellomlagret her er ekstra tekst');

    const slettKnapp = screen.getByRole('button', { name: 'Slett utkast' });

    await user.click(slettKnapp);

    expect(
      screen.getByRole('textbox', {
        name: 'Begrunnelse for anslått årlig arbeidsinntekt for skadetidspunkt 27.06.2025',
      })
    ).toHaveValue('Dette er min vurdering som er bekreftet');
  });

  it('Skal ikke være mulig å lagre eller slette mellomlagring hvis det er readOnly', () => {
    render(
      <YrkesskadeGrunnlagBeregning
        behandlingVersjon={0}
        readOnly={true}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
        yrkeskadeBeregningGrunnlag={grunnlagMedVurdering}
      />
    );

    const lagreKnapp = screen.queryByRole('button', { name: 'Lagre utkast' });
    expect(lagreKnapp).not.toBeInTheDocument();
    const slettKnapp = screen.queryByRole('button', { name: 'Slett utkast' });
    expect(slettKnapp).not.toBeInTheDocument();
  });
});

async function velgBekreft() {
  const bekreftKnapp = screen.getByRole('button', { name: 'Bekreft' });
  await user.click(bekreftKnapp);
}
