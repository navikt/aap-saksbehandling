import { beforeEach, describe, expect, it, test, vi } from 'vitest';
import { Helseinstitusjon } from 'components/behandlinger/etannetsted/helseinstitusjon/Helseinstitusjon';
import { render, screen, within } from 'lib/test/CustomRender';
import { userEvent } from '@testing-library/user-event';
import { HelseinstitusjonGrunnlag, MellomlagretVurderingResponse } from 'lib/types/types';
import { Behovstype } from 'lib/utils/form';
import { FetchResponse } from 'lib/utils/api';
import createFetchMock from 'vitest-fetch-mock';

const fetchMock = createFetchMock(vi);
fetchMock.enableMocks();
const user = userEvent.setup();

const grunnlagUtenVurdering: HelseinstitusjonGrunnlag = {
  harTilgangTilÅSaksbehandle: true,
  opphold: [
    {
      institusjonstype: 'Helseinstitusjon',
      oppholdstype: 'Heldøgnpasient',
      status: 'AKTIV',
      oppholdFra: '2022-10-24',
      avsluttetDato: '2025-10-24',
      kildeinstitusjon: 'St. Mungos Hospital',
    },
  ],
  vurderinger: [
    {
      periode: {
        fom: '2022-10-24',
        tom: '2024-10-23',
      },
      vurderinger: [],
      status: 'UAVKLART',
    },
  ],
};

const grunnlagMedVurdering: HelseinstitusjonGrunnlag = {
  harTilgangTilÅSaksbehandle: true,
  opphold: [
    {
      institusjonstype: 'Helseinstitusjon',
      oppholdstype: 'Heldøgnpasient',
      status: 'AKTIV',
      oppholdFra: '2022-10-24',
      avsluttetDato: '2025-10-24',
      kildeinstitusjon: 'St. Mungos Hospital',
    },
  ],
  vurderinger: [
    {
      periode: {
        fom: '2022-10-24',
        tom: '2024-10-23',
      },
      vurderinger: [
        {
          begrunnelse: 'Dette er min vurdering som er bekreftet',
          periode: {
            fom: '2022-10-24',
            tom: '2024-10-23',
          },
          faarFriKostOgLosji: true,
        },
      ],
      status: 'UAVKLART',
    },
  ],
};

describe('Helseinstitusjonsvurdering', () => {
  beforeEach(() => {
    render(<Helseinstitusjon grunnlag={grunnlagUtenVurdering} behandlingVersjon={0} readOnly={false} />);
  });

  test('har overskrift', () => {
    expect(screen.getByRole('heading', { name: '§ 11-25 Helseinstitusjon', level: 3 })).toBeVisible();
  });

  test('viser en liste over institusjonsopphold som er oppdaget', () => {
    expect(
      screen.getByRole('table', { name: 'Brukeren har følgende institusjonsopphold på helseinstitusjon' })
    ).toBeVisible();
  });

  test('har et fritekstfelt for vurdering av vilkåret', () => {
    expect(
      screen.getByRole('textbox', { name: 'Vurder §11-25 og om det skal gis reduksjon av ytelsen' })
    ).toBeVisible();
  });

  test('spør om brukeren forsørger ektefelle', () => {
    expect(screen.getByRole('group', { name: 'Forsørger brukeren ektefelle eller tilsvarende?' })).toBeVisible();
  });

  test('spør om brukeren har faste utgifter for å beholde bolig eller andre eiendeler', () => {
    expect(
      screen.getByRole('group', {
        name: 'Har brukeren faste utgifter nødvendig for å beholde bolig og andre eiendeler?',
      })
    ).toBeVisible();
  });

  test('viser ikke spørsmål om brukeren får fri kost og losji initielt', () => {
    expect(screen.queryByRole('group', { name: 'Får brukeren fri kost og losji?' })).not.toBeInTheDocument();
  });

  test('viser spørsmål om brukeren får fri kost og losji når man svarer nei på om brukeren forsørger ektefelle og har faste utgifter', async () => {
    const forsoergerEktefelleGruppe = screen.getByRole('group', {
      name: 'Forsørger brukeren ektefelle eller tilsvarende?',
    });
    const harFasteUtgifterGruppe = screen.getByRole('group', {
      name: 'Har brukeren faste utgifter nødvendig for å beholde bolig og andre eiendeler?',
    });

    await user.click(within(forsoergerEktefelleGruppe).getByRole('radio', { name: 'Nei' }));
    await user.click(within(harFasteUtgifterGruppe).getByRole('radio', { name: 'Nei' }));

    expect(screen.getByRole('group', { name: /får brukeren fri kost og losji\?/i })).toBeVisible();
  });

  test('viser ikke spørsmål om brukeren får fri kost og losji hvis man svarer ja på at brukeren forsørger ektefelle', async () => {
    const forsoergerEktefelleGruppe = screen.getByRole('group', {
      name: 'Forsørger brukeren ektefelle eller tilsvarende?',
    });
    const harFasteUtgifterGruppe = screen.getByRole('group', {
      name: 'Har brukeren faste utgifter nødvendig for å beholde bolig og andre eiendeler?',
    });

    await user.click(within(forsoergerEktefelleGruppe).getByRole('radio', { name: 'Ja' }));
    await user.click(within(harFasteUtgifterGruppe).getByRole('radio', { name: 'Nei' }));

    expect(screen.queryByRole('group', { name: 'Får brukeren fri kost og losji?' })).not.toBeInTheDocument();
  });

  test('viser ikke spørsmål om brukeren får fri kost og losji hvis man svarer ja på at har faste utgifter', async () => {
    const forsoergerEktefelleGruppe = screen.getByRole('group', {
      name: 'Forsørger brukeren ektefelle eller tilsvarende?',
    });
    const harFasteUtgifterGruppe = screen.getByRole('group', {
      name: 'Har brukeren faste utgifter nødvendig for å beholde bolig og andre eiendeler?',
    });

    await user.click(within(forsoergerEktefelleGruppe).getByRole('radio', { name: 'Nei' }));
    await user.click(within(harFasteUtgifterGruppe).getByRole('radio', { name: 'Ja' }));

    expect(screen.queryByRole('group', { name: 'Får brukeren fri kost og losji?' })).not.toBeInTheDocument();
  });

  test('viser ikke spørsmål om brukeren får fri kost og losji hvis man svarer ja på at har faste utgifter og at de forsørger ektefelle', async () => {
    const forsoergerEktefelleGruppe = screen.getByRole('group', {
      name: 'Forsørger brukeren ektefelle eller tilsvarende?',
    });
    const harFasteUtgifterGruppe = screen.getByRole('group', {
      name: 'Har brukeren faste utgifter nødvendig for å beholde bolig og andre eiendeler?',
    });

    await user.click(within(forsoergerEktefelleGruppe).getByRole('radio', { name: 'Ja' }));
    await user.click(within(harFasteUtgifterGruppe).getByRole('radio', { name: 'Ja' }));

    expect(screen.queryByRole('group', { name: 'Får brukeren fri kost og losji?' })).not.toBeInTheDocument();
  });

  describe('valiering', () => {
    test('viser feilmelding dersom begrunnelse ikke er fylt ut', async () => {
      await user.click(screen.getByRole('button', { name: 'Bekreft' }));
      expect(screen.getByText('Du må begrunne vurderingen din')).toBeVisible();
    });

    test('viser feilmelding hvis man ikke har svart på om brukeren forsørger ektefelle', async () => {
      await user.click(screen.getByRole('button', { name: 'Bekreft' }));
      expect(screen.getByText('Du må svare på om brukeren forsørger ektefelle eller tilsvarende')).toBeVisible();
    });

    test('viser feilmelding hvis man ikke har svart på om brukeren har faste utgifter', async () => {
      await user.click(screen.getByRole('button', { name: 'Bekreft' }));
      expect(
        screen.getByText(
          'Du må svare på om brukeren har faste utgifter nødvendig for å beholde bolig og andre eiendeler'
        )
      ).toBeVisible();
    });

    test('viser feilmelding dersom spørsmålet om fri kost og losji vises men ikke er besvart', async () => {
      const forsoergerEktefelleGruppe = screen.getByRole('group', {
        name: 'Forsørger brukeren ektefelle eller tilsvarende?',
      });
      const harFasteUtgifterGruppe = screen.getByRole('group', {
        name: 'Har brukeren faste utgifter nødvendig for å beholde bolig og andre eiendeler?',
      });

      await user.click(within(forsoergerEktefelleGruppe).getByRole('radio', { name: 'Nei' }));
      await user.click(within(harFasteUtgifterGruppe).getByRole('radio', { name: 'Nei' }));
      await user.click(screen.getByRole('button', { name: 'Bekreft' }));
      expect(screen.getByText('Du må svare på om brukeren får fri kost og losji')).toBeVisible();
    });
  });
});

describe('mellomlagring', () => {
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
