import { beforeEach, describe, expect, it, test, vi } from 'vitest';
import { Helseinstitusjon } from 'components/behandlinger/institusjonsopphold/helseinstitusjon/Helseinstitusjon';
import { render, screen, within } from 'lib/test/CustomRender';
import { userEvent } from '@testing-library/user-event';
import { HelseinstitusjonGrunnlag, MellomlagretVurderingResponse } from 'lib/types/types';
import { Behovstype } from 'lib/utils/form';
import { FetchResponse } from 'lib/utils/api';
import createFetchMock from 'vitest-fetch-mock';
import { defaultFlytResponse, setMockFlytResponse } from 'vitestSetup';

const fetchMock = createFetchMock(vi);
fetchMock.enableMocks();
const user = userEvent.setup();

const grunnlagUtenVurdering: HelseinstitusjonGrunnlag = {
  harTilgangTilÅSaksbehandle: true,
  vedtatteVurderinger: [],
  opphold: [
    {
      institusjonstype: 'Helseinstitusjon',
      oppholdstype: 'Heldøgnpasient',
      oppholdId: '123',
      status: 'AKTIV',
      oppholdFra: '2025-01-01',
      avsluttetDato: '2025-08-01',
      kildeinstitusjon: 'St. Mungos Hospital',
    },
  ],
  vurderinger: [
    {
      oppholdId: '123',
      periode: {
        fom: '2022-10-24',
        tom: '2024-10-23',
      },
      vurderinger: [],
    },
  ],
};

const grunnlagMedVurdering: HelseinstitusjonGrunnlag = {
  harTilgangTilÅSaksbehandle: true,
  vedtatteVurderinger: [],
  opphold: [
    {
      institusjonstype: 'Helseinstitusjon',
      oppholdstype: 'Heldøgnpasient',
      status: 'AKTIV',
      oppholdFra: '2022-10-24',
      oppholdId: '123',
      avsluttetDato: '2025-10-24',
      kildeinstitusjon: 'St. Mungos Hospital',
    },
  ],
  vurderinger: [
    {
      oppholdId: '123',
      periode: {
        fom: '2022-10-24',
        tom: '2024-10-23',
      },
      vurderinger: [
        {
          oppholdId: '123',
          begrunnelse: 'Dette er min vurdering som er bekreftet',
          periode: {
            fom: '2022-10-24',
            tom: '2024-10-23',
          },
          faarFriKostOgLosji: false,
        },
      ],
    },
  ],
};

beforeEach(() => {
  setMockFlytResponse({ ...defaultFlytResponse, aktivtSteg: 'DU_ER_ET_ANNET_STED' });
});

describe('Helseinstitusjonsvurdering', () => {
  beforeEach(() => {
    render(<Helseinstitusjon grunnlag={grunnlagUtenVurdering} behandlingVersjon={0} readOnly={false} />);
  });

  test('viser en liste over institusjonsopphold som er oppdaget', () => {
    expect(
      screen.getByRole('table', { name: 'Brukeren har følgende institusjonsopphold på helseinstitusjon' })
    ).toBeVisible();
  });

  test('har et fritekstfelt for vurdering av vilkåret', () => {
    expect(
      screen.getByRole('textbox', {
        name: 'Vilkårsvurdering',
        description: 'Vurder §11-25 og om det skal gis reduksjon av ytelsen',
      })
    ).toBeVisible();
  });

  test('spør om brukeren forsørger ektefelle dersom det er besvart ja på om bruker får fri kost og losji', async () => {
    await svarPåSpørsmålOmFriKostOgLosji(true, 0);
    expect(screen.getByRole('group', { name: 'Forsørger brukeren ektefelle eller tilsvarende?' })).toBeVisible();
  });

  test('spør om brukeren har faste utgifter for å beholde bolig eller andre eiendeler', async () => {
    await svarPåSpørsmålOmFriKostOgLosji(true, 0);
    await svarPåSpørsmålOmBrukerForsørgerEktefelleEllerTilsvarende(false, 0);
    expect(
      screen.getByRole('group', {
        name: 'Har brukeren faste utgifter nødvendig for å beholde bolig og andre eiendeler?',
      })
    ).toBeVisible();
  });

  describe('validering', () => {
    test('viser feilmelding dersom begrunnelse ikke er fylt ut', async () => {
      await user.click(screen.getByRole('button', { name: 'Bekreft' }));
      expect(screen.getByText('Du må begrunne vurderingen din')).toBeVisible();
    });

    test('viser feilmelding dersom spørsmålet om fri kost og losji  ikke er besvart', async () => {
      await user.click(screen.getByRole('button', { name: 'Bekreft' }));
      expect(screen.getByText('Du må svare på om brukeren får fri kost og losji')).toBeVisible();
    });

    test('viser feilmelding hvis man ikke har svart på om brukeren forsørger ektefelle', async () => {
      await svarPåSpørsmålOmFriKostOgLosji(true, 0);
      await user.click(screen.getByRole('button', { name: 'Bekreft' }));
      expect(screen.getByText('Du må svare på om brukeren forsørger ektefelle eller tilsvarende')).toBeVisible();
    });

    test('viser feilmelding hvis man ikke har svart på om brukeren har faste utgifter', async () => {
      await svarPåSpørsmålOmFriKostOgLosji(true, 0);
      await svarPåSpørsmålOmBrukerForsørgerEktefelleEllerTilsvarende(false, 0);
      await user.click(screen.getByRole('button', { name: 'Bekreft' }));
      expect(
        screen.getByText(
          'Du må svare på om brukeren har faste utgifter nødvendig for å beholde bolig og andre eiendeler'
        )
      ).toBeVisible();
    });

    test('viser feilmelding hvis man skriver inn en dato som er før første tillate reduksjonsdato', async () => {
      await svarReduksjon(0);

      const datoFelt = screen.getByRole('textbox', { name: 'Oppgi dato for reduksjon av AAP' });
      await user.clear(datoFelt);
      await user.type(datoFelt, '01.04.2025');

      await user.click(screen.getByRole('button', { name: 'Bekreft' }));

      const feilmelding = screen.getByText('Tidligste dato for reduksjon er: 01.05.2025');
      expect(feilmelding).toBeVisible();
    });

    test('viser feilmelding dersom vurderingen ikke er i kronologisk rekkefølge', async () => {
      await svarReduksjon(0);

      const datoFelt = screen.getByRole('textbox', { name: 'Oppgi dato for reduksjon av AAP' });
      await user.clear(datoFelt);
      await user.type(datoFelt, '01.05.2025');

      const leggTilVurderingKnapp = screen.getByRole('button', { name: 'Legg til ny vurdering' });
      await user.click(leggTilVurderingKnapp);

      await svarIkkeReduksjon(1);
      const datoFeltForStansAvReduksjon = screen.getByRole('textbox', { name: 'Når skal reduksjonen stoppes?' });
      await user.clear(datoFeltForStansAvReduksjon);
      await user.type(datoFeltForStansAvReduksjon, '01.04.2025');

      await user.click(screen.getByRole('button', { name: 'Bekreft' }));

      const feilmelding = screen.getByText(
        'Dato kan ikke være tidligere eller samme dato som forrige vurdering: 01.05.2025'
      );

      expect(feilmelding).toBeVisible();
    });
  });
});

describe('revurdering', () => {
  const grunnlagMedTidligereVurdering: HelseinstitusjonGrunnlag = {
    ...grunnlagUtenVurdering,
    vedtatteVurderinger: [
      {
        periode: { fom: '2025-01-01', tom: '2025-08-01' },
        oppholdId: '123',
        vurderinger: [
          {
            oppholdId: '123',
            periode: { fom: '2025-01-01', tom: '2025-08-01' },
            faarFriKostOgLosji: false,
            begrunnelse: 'hei og hå',
          },
        ],
      },
    ],
  };

  it('Skal vise tidligere vurdering', async () => {
    render(<Helseinstitusjon grunnlag={grunnlagMedTidligereVurdering} behandlingVersjon={0} readOnly={false} />);
    const tidligereVurdering = screen.getByRole('button', {
      name: /1\. januar 2025 – 1\. august 2025 ikke reduksjon/i,
    });

    expect(tidligereVurdering).toBeVisible();
  });

  it('Skal ikke ha en ny vurdering lagt til initielt', () => {
    render(<Helseinstitusjon grunnlag={grunnlagMedTidligereVurdering} behandlingVersjon={0} readOnly={false} />);
    expect(screen.queryByRole('textbox', { name: 'Vilkårsvurdering' })).not.toBeInTheDocument();
  });

  it('Skal vise dato felt initielt når man legger til ny vurdering', async () => {
    render(<Helseinstitusjon grunnlag={grunnlagMedTidligereVurdering} behandlingVersjon={0} readOnly={false} />);
    const leggTilKnapp = screen.getByRole('button', { name: 'Legg til ny vurdering' });
    await user.click(leggTilKnapp);
    const datoFelt = screen.getByRole('textbox', { name: 'Når skal reduksjonen stoppes?' });
    expect(datoFelt).toBeVisible();
  });

  it('Skal vise fom dato etter siste vedtatte vurdering fom dato når bruker legger til ny vurdering', async () => {
    render(<Helseinstitusjon grunnlag={grunnlagMedTidligereVurdering} behandlingVersjon={0} readOnly={false} />);
    const leggTilKnapp = screen.getByRole('button', { name: 'Legg til ny vurdering' });
    await user.click(leggTilKnapp);

    // Vedtatt vurdering, 1. januar
    const vedtattVurdering = screen.getByRole('button', {
      name: /1\. januar 2025 – 1\. august 20252\. januar 2025 ikke reduksjon/i,
    });
    expect(vedtattVurdering).toBeVisible();

    // 3. januar
    const nyVurdering = screen.getByRole('button', {
      name: /ny vurdering: 3\. januar 2025 – ikke reduksjon/i,
    });
    expect(nyVurdering).toBeVisible();
  });
});

describe('form med reduksjon', () => {
  it('Skal ikke vise datofelt for når reduksjon skal stoppes hvis det er første vurdering', async () => {
    render(<Helseinstitusjon grunnlag={grunnlagUtenVurdering} behandlingVersjon={0} readOnly={false} />);
    await svarIkkeReduksjon(0);

    const datoFelt = screen.queryByRole('textbox', { name: 'Når skal reduksjonen stoppes?' });
    expect(datoFelt).not.toBeInTheDocument();
  });

  it('viser ikke datofelt for stopp av reduksjon når vurderinger gir samme svar', async () => {
    render(<Helseinstitusjon grunnlag={grunnlagUtenVurdering} behandlingVersjon={0} readOnly={false} />);
    await svarIkkeReduksjon(0); // På første vurdering

    const datoFelt = screen.queryAllByRole('textbox', { name: 'Når skal reduksjonen stoppes?' });
    expect(datoFelt.length).toBe(0);

    const leggTilVurderingKnapp = screen.getByRole('button', { name: 'Legg til ny vurdering' });
    await user.click(leggTilVurderingKnapp);

    await svarIkkeReduksjon(1);
    const datoFeltEtterNyBesvarelse = screen.queryAllByRole('textbox', { name: 'Når skal reduksjonen stoppes?' });
    expect(datoFeltEtterNyBesvarelse.length).toBe(0);
  });

  it('Viser ikke datofelt for start av reduksjon når vurderinger er lik forrige', async () => {
    render(<Helseinstitusjon grunnlag={grunnlagUtenVurdering} behandlingVersjon={0} readOnly={false} />);
    await svarReduksjon(0); // På første vurdering

    const datoFelt = screen.getByRole('textbox', { name: 'Oppgi dato for reduksjon av AAP' });
    expect(datoFelt).toBeVisible();

    const leggTilVurderingKnapp = screen.getByRole('button', { name: 'Legg til ny vurdering' });
    await user.click(leggTilVurderingKnapp);

    await svarReduksjon(1);
    const datoFeltEtterNyBesvarelse = screen.queryAllByRole('textbox', { name: 'Oppgi dato for reduksjon av AAP' });
    expect(datoFeltEtterNyBesvarelse.length).toBe(1); // Vi forventer bare datofelt på den første vurderingen
  });
});

async function svarPåSpørsmålOmFriKostOgLosji(value: boolean, index: number) {
  const gruppe = screen.getAllByRole('group', {
    name: 'Får brukeren fri kost og losji?',
  })[index];

  await user.click(within(gruppe).getByRole('radio', { name: value ? 'Ja' : 'Nei' }));
}

async function svarPåSpørsmålOmBrukerForsørgerEktefelleEllerTilsvarende(value: boolean, index: number) {
  const gruppe = screen.getAllByRole('group', {
    name: 'Forsørger brukeren ektefelle eller tilsvarende?',
  });

  await user.click(within(gruppe[index]).getByRole('radio', { name: value ? 'Ja' : 'Nei' }));
}

async function svarPåSpørsmålOmBrukerHarFasteUtgifter(value: boolean, index: number) {
  const gruppe = screen.getAllByRole('group', {
    name: 'Har brukeren faste utgifter nødvendig for å beholde bolig og andre eiendeler?',
  })[index];

  await user.click(within(gruppe).getByRole('radio', { name: value ? 'Ja' : 'Nei' }));
}

async function svarReduksjon(index: number) {
  await svarPåSpørsmålOmFriKostOgLosji(true, index);
  await svarPåSpørsmålOmBrukerForsørgerEktefelleEllerTilsvarende(false, index);
  await svarPåSpørsmålOmBrukerHarFasteUtgifter(false, index);
}

async function svarIkkeReduksjon(index: number) {
  await svarPåSpørsmålOmFriKostOgLosji(false, index);
}

describe.skip('mellomlagring', () => {
  const mellomlagring: MellomlagretVurderingResponse = {
    mellomlagretVurdering: {
      avklaringsbehovkode: Behovstype.AVKLAR_HELSEINSTITUSJON,
      behandlingId: { id: 1 },
      data: '{"helseinstitusjonsvurderinger": [{"begrunnelse": "Dette er min vurdering som er mellomlagret", "periode": {"fom": "2022-10-24", "tom": "2024-10-23"}}]}',
      vurdertDato: '2025-08-21T12:00:00.000',
      vurdertAv: 'Jan T. Loven',
    },
  };

  it('Skal vise en tekst om hvem som har gjort vurderingen dersom det finnes en mellomlagring', () => {
    render(
      <Helseinstitusjon
        grunnlag={grunnlagUtenVurdering}
        behandlingVersjon={1}
        readOnly={false}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
      />
    );
    const tekst = screen.getByText('Utkast lagret 21.08.2025 12:00 (Jan T. Loven)');
    expect(tekst).toBeVisible();
  });

  it('Skal vise en tekst om hvem som har lagret vurdering dersom bruker trykker på lagre mellomlagring', async () => {
    render(<Helseinstitusjon behandlingVersjon={1} grunnlag={grunnlagUtenVurdering} readOnly={false} />);
    await user.type(
      screen.getByRole('textbox', {
        name: 'Vurder §11-25 og om det skal gis reduksjon av ytelsen',
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
      <Helseinstitusjon
        behandlingVersjon={1}
        readOnly={false}
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
      <Helseinstitusjon
        behandlingVersjon={1}
        readOnly={false}
        grunnlag={grunnlagMedVurdering}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
      />
    );

    const begrunnelseFelt = screen.getByRole('textbox', {
      name: 'Vurder §11-25 og om det skal gis reduksjon av ytelsen',
    });

    expect(begrunnelseFelt).toHaveValue('Dette er min vurdering som er mellomlagret');
  });

  it('Skal bruke bekreftet vurdering fra grunnlag som defaultValue i skjema dersom mellomlagring ikke finnes', () => {
    render(<Helseinstitusjon behandlingVersjon={1} readOnly={false} grunnlag={grunnlagMedVurdering} />);
    const begrunnelseFelt = screen.getByRole('textbox', {
      name: 'Vurder §11-25 og om det skal gis reduksjon av ytelsen',
    });

    expect(begrunnelseFelt).toHaveValue('Dette er min vurdering som er bekreftet');
  });

  it('Skal resette skjema til tomt skjema dersom det ikke finnes en bekreftet vurdering og bruker sletter mellomlagring', async () => {
    render(
      <Helseinstitusjon
        behandlingVersjon={1}
        readOnly={false}
        grunnlag={grunnlagUtenVurdering}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
      />
    );

    await user.type(
      screen.getByRole('textbox', {
        name: 'Vurder §11-25 og om det skal gis reduksjon av ytelsen',
      }),
      ' her er ekstra tekst'
    );

    expect(
      screen.getByRole('textbox', {
        name: 'Vurder §11-25 og om det skal gis reduksjon av ytelsen',
      })
    ).toHaveValue('Dette er min vurdering som er mellomlagret her er ekstra tekst');

    const slettKnapp = screen.getByRole('button', { name: 'Slett utkast' });

    await user.click(slettKnapp);

    expect(
      screen.getByRole('textbox', {
        name: 'Vurder §11-25 og om det skal gis reduksjon av ytelsen',
      })
    ).toHaveValue('');
  });

  it('Skal resette skjema til bekreftet vurdering dersom det finnes en bekreftet vurdering og bruker sletter mellomlagring', async () => {
    render(
      <Helseinstitusjon
        behandlingVersjon={1}
        readOnly={false}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
        grunnlag={grunnlagMedVurdering}
      />
    );

    await user.type(
      screen.getByRole('textbox', {
        name: 'Vurder §11-25 og om det skal gis reduksjon av ytelsen',
      }),
      ' her er ekstra tekst'
    );

    expect(
      screen.getByRole('textbox', {
        name: 'Vurder §11-25 og om det skal gis reduksjon av ytelsen',
      })
    ).toHaveValue('Dette er min vurdering som er mellomlagret her er ekstra tekst');

    const slettKnapp = screen.getByRole('button', { name: 'Slett utkast' });

    await user.click(slettKnapp);

    expect(
      screen.getByRole('textbox', {
        name: 'Vurder §11-25 og om det skal gis reduksjon av ytelsen',
      })
    ).toHaveValue('Dette er min vurdering som er bekreftet');
  });

  it('Skal ikke være mulig å lagre eller slette mellomlagring hvis det er readOnly', () => {
    render(
      <Helseinstitusjon
        behandlingVersjon={1}
        readOnly={true}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
        grunnlag={grunnlagMedVurdering}
      />
    );

    const lagreKnapp = screen.queryByRole('button', { name: 'Lagre utkast' });
    expect(lagreKnapp).not.toBeInTheDocument();
    const slettKnapp = screen.queryByRole('button', { name: 'Slett utkast' });
    expect(slettKnapp).not.toBeInTheDocument();
  });
});
