import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Soningsvurdering } from 'components/behandlinger/institusjonsopphold/soning/Soningsvurdering';
import { render, screen } from 'lib/test/CustomRender';
import { MellomlagretVurderingResponse, Soningsgrunnlag } from 'lib/types/types';
import userEvent from '@testing-library/user-event';
import { Behovstype } from 'lib/utils/form';
import { FetchResponse } from 'lib/utils/api';
import createFetchMock from 'vitest-fetch-mock';
import { defaultFlytResponse, setMockFlytResponse } from 'vitestSetup';

const fetchMock = createFetchMock(vi);
fetchMock.enableMocks();
const user = userEvent.setup();

const grunnlagUtenVurdering: Soningsgrunnlag = {
  harTilgangTilÅSaksbehandle: true,
  soningsforhold: [
    {
      institusjonstype: 'Fengsel',
      oppholdId: '123',
      oppholdstype: 'Soningsfange',
      status: 'AKTIV',
      oppholdFra: '2022-10-23',
      avsluttetDato: '2025-10-23',
      kildeinstitusjon: 'Azkaban',
    },
  ],
  vurderinger: [
    {
      vurderingsdato: '2022-10-23',
      vurdering: undefined,
      status: 'UAVKLART',
    },
  ],
};

const grunnlagMedVurdering: Soningsgrunnlag = {
  harTilgangTilÅSaksbehandle: true,
  soningsforhold: [
    {
      institusjonstype: 'Fengsel',
      oppholdId: '123',
      oppholdstype: 'Soningsfange',
      status: 'AKTIV',
      oppholdFra: '2022-10-23',
      avsluttetDato: '2025-10-23',
      kildeinstitusjon: 'Azkaban',
    },
  ],
  vurderinger: [
    {
      vurderingsdato: '2022-10-23',
      vurdering: { begrunnelse: 'Dette er min vurdering som er bekreftet', skalOpphøre: true, fraDato: '2022-10-23' },
      status: 'UAVKLART',
    },
  ],
};

beforeEach(() => {
  setMockFlytResponse({ ...defaultFlytResponse, aktivtSteg: 'DU_ER_ET_ANNET_STED' });
});

describe('Soningsvurdering', () => {
  it('har overskrift på nivå 3', () => {
    render(<Soningsvurdering grunnlag={grunnlagUtenVurdering} readOnly={false} behandlingsversjon={0} />);
    expect(screen.getByRole('heading', { level: 3, name: '§ 11-26 Soning' })).toBeVisible();
  });

  it('har en tekst som informerer om at brukeren har soningsforhold', () => {
    render(<Soningsvurdering grunnlag={grunnlagUtenVurdering} readOnly={false} behandlingsversjon={0} />);
    expect(screen.getByText('Brukeren har følgende soningsforhold')).toBeVisible();
  });

  it('har en beskrivelse av hvordan vilkåret skal vurderes', () => {
    render(<Soningsvurdering grunnlag={grunnlagUtenVurdering} readOnly={false} behandlingsversjon={0} />);
    expect(
      screen.getByText(
        'Under opphold i fengsel har ikke brukeren rett på AAP. Om man soner utenfor fengsel eller arbeider utenfor anstalt har man likevel rett på AAP'
      )
    ).toBeVisible();
  });

  it('har en tabell som lister opp soningsopphold', () => {
    render(<Soningsvurdering grunnlag={grunnlagUtenVurdering} readOnly={false} behandlingsversjon={0} />);
    expect(screen.getAllByRole('row')).toHaveLength(2);
  });

  it('har et felt for begrunnelse', () => {
    render(<Soningsvurdering grunnlag={grunnlagUtenVurdering} readOnly={false} behandlingsversjon={0} />);
    expect(
      screen.getByRole('textbox', {
        name: 'Vurder om brukeren soner i frihet eller jobber for en arbeidsgiver utenfor anstalten, og dermed har rett på AAP under soning',
      })
    ).toBeVisible();
  });

  it('har et for å avgjøre om ytelsen skal stanses', () => {
    render(<Soningsvurdering grunnlag={grunnlagUtenVurdering} readOnly={false} behandlingsversjon={0} />);
    expect(screen.getByRole('group', { name: 'Skal ytelsen stoppes på grunn av soning?' })).toBeVisible();
  });

  it('datofelt for når vurderingen skal gjelde fra vises ikke på den første vurderingen', () => {
    render(<Soningsvurdering grunnlag={grunnlagUtenVurdering} readOnly={false} behandlingsversjon={0} />);
    expect(screen.queryByRole('textbox', { name: 'Vurderingen skal gjelde fra dato' })).not.toBeInTheDocument();
  });

  it('dato for når vurderingen skal gjelde fra vises som ren tekst på den første vurderingen', () => {
    render(<Soningsvurdering grunnlag={grunnlagUtenVurdering} readOnly={false} behandlingsversjon={0} />);
    expect(screen.getByText('Vurderingen gjelder fra')).toBeVisible();
    expect(screen.getAllByText('23.10.2022')[1]).toBeVisible(); // Det finnes en lik dato i tabellen også
  });

  it('viser et datofelt for når vurderingen skal gjelde fra så lenge det ikke er den første vurderingen', async () => {
    render(<Soningsvurdering grunnlag={grunnlagUtenVurdering} readOnly={false} behandlingsversjon={0} />);
    const leggTilNyVurderingKnapp = screen.getByRole('button', { name: /legg til ny vurdering/i });
    await user.click(leggTilNyVurderingKnapp);
    expect(screen.getByRole('textbox', { name: 'Vurderingen gjelder fra' })).toBeVisible();
  });
});

describe('mellomlagring', () => {
  const mellomlagring: MellomlagretVurderingResponse = {
    mellomlagretVurdering: {
      avklaringsbehovkode: Behovstype.AVKLAR_SAMORDNING_ANDRE_STATLIGE_YTELSER,
      behandlingId: { id: 1 },
      data: '{"soningsvurderinger": [{"begrunnelse": "Dette er min vurdering som er mellomlagret"}]}',
      vurdertDato: '2025-08-21T12:00:00.000',
      vurdertAv: 'Jan T. Loven',
    },
  };

  it('Skal vise en tekst om hvem som har gjort vurderingen dersom det finnes en mellomlagring', () => {
    render(
      <Soningsvurdering
        grunnlag={grunnlagUtenVurdering}
        readOnly={false}
        behandlingsversjon={1}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
      />
    );
    const tekst = screen.getByText('Utkast lagret 21.08.2025 12:00 (Jan T. Loven)');
    expect(tekst).toBeVisible();
  });

  it('Skal vise en tekst om hvem som har lagret vurdering dersom bruker trykker på lagre mellomlagring', async () => {
    render(<Soningsvurdering grunnlag={grunnlagUtenVurdering} behandlingsversjon={1} readOnly={false} />);

    await user.type(
      screen.getByRole('textbox', {
        name: 'Vurder om brukeren soner i frihet eller jobber for en arbeidsgiver utenfor anstalten, og dermed har rett på AAP under soning',
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
      <Soningsvurdering
        behandlingsversjon={1}
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
      <Soningsvurdering
        behandlingsversjon={1}
        readOnly={false}
        grunnlag={grunnlagMedVurdering}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
      />
    );

    const begrunnelseFelt = screen.getByRole('textbox', {
      name: 'Vurder om brukeren soner i frihet eller jobber for en arbeidsgiver utenfor anstalten, og dermed har rett på AAP under soning',
    });

    expect(begrunnelseFelt).toHaveValue('Dette er min vurdering som er mellomlagret');
  });

  it('Skal bruke bekreftet vurdering fra grunnlag som defaultValue i skjema dersom mellomlagring ikke finnes', () => {
    render(<Soningsvurdering behandlingsversjon={1} readOnly={false} grunnlag={grunnlagMedVurdering} />);

    const begrunnelseFelt = screen.getByRole('textbox', {
      name: 'Vurder om brukeren soner i frihet eller jobber for en arbeidsgiver utenfor anstalten, og dermed har rett på AAP under soning',
    });

    expect(begrunnelseFelt).toHaveValue('Dette er min vurdering som er bekreftet');
  });

  it('Skal resette skjema til tomt skjema dersom det ikke finnes en bekreftet vurdering og bruker sletter mellomlagring', async () => {
    render(
      <Soningsvurdering
        behandlingsversjon={1}
        readOnly={false}
        grunnlag={grunnlagUtenVurdering}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
      />
    );

    await user.type(
      screen.getByRole('textbox', {
        name: 'Vurder om brukeren soner i frihet eller jobber for en arbeidsgiver utenfor anstalten, og dermed har rett på AAP under soning',
      }),
      ' her er ekstra tekst'
    );

    expect(
      screen.getByRole('textbox', {
        name: 'Vurder om brukeren soner i frihet eller jobber for en arbeidsgiver utenfor anstalten, og dermed har rett på AAP under soning',
      })
    ).toHaveValue('Dette er min vurdering som er mellomlagret her er ekstra tekst');

    const slettKnapp = screen.getByRole('button', { name: 'Slett utkast' });

    await user.click(slettKnapp);

    expect(
      screen.getByRole('textbox', {
        name: 'Vurder om brukeren soner i frihet eller jobber for en arbeidsgiver utenfor anstalten, og dermed har rett på AAP under soning',
      })
    ).toHaveValue('');
  });

  it('Skal resette skjema til bekreftet vurdering dersom det finnes en bekreftet vurdering og bruker sletter mellomlagring', async () => {
    render(
      <Soningsvurdering
        behandlingsversjon={1}
        readOnly={false}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
        grunnlag={grunnlagMedVurdering}
      />
    );

    await user.type(
      screen.getByRole('textbox', {
        name: 'Vurder om brukeren soner i frihet eller jobber for en arbeidsgiver utenfor anstalten, og dermed har rett på AAP under soning',
      }),
      ' her er ekstra tekst'
    );

    expect(
      screen.getByRole('textbox', {
        name: 'Vurder om brukeren soner i frihet eller jobber for en arbeidsgiver utenfor anstalten, og dermed har rett på AAP under soning',
      })
    ).toHaveValue('Dette er min vurdering som er mellomlagret her er ekstra tekst');

    const slettKnapp = screen.getByRole('button', { name: 'Slett utkast' });

    await user.click(slettKnapp);

    expect(
      screen.getByRole('textbox', {
        name: 'Vurder om brukeren soner i frihet eller jobber for en arbeidsgiver utenfor anstalten, og dermed har rett på AAP under soning',
      })
    ).toHaveValue('Dette er min vurdering som er bekreftet');
  });

  it('Skal ikke være mulig å lagre eller slette mellomlagring hvis det er readOnly', () => {
    render(
      <Soningsvurdering
        behandlingsversjon={1}
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
