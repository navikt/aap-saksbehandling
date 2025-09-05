import { describe, expect, it, vi } from 'vitest';
import { render, screen } from 'lib/test/CustomRender';
import { FastsettBeregning } from 'components/behandlinger/grunnlag/fastsettberegning/FastsettBeregning';
import { userEvent } from '@testing-library/user-event';
import { BeregningTidspunktGrunnlag, MellomlagretVurderingResponse } from 'lib/types/types';
import { addDays, format, subDays } from 'date-fns';
import { FetchResponse } from 'lib/utils/api';
import { Behovstype } from 'lib/utils/form';
import createFetchMock from 'vitest-fetch-mock';

const fetchMock = createFetchMock(vi);
fetchMock.enableMocks();
const user = userEvent.setup();

const grunnlagUtenVurdering: BeregningTidspunktGrunnlag = {
  harTilgangTilÅSaksbehandle: true,
  skalVurdereYtterligere: true,
  historiskeVurderinger: [],
};

describe('Generelt', () => {
  it('skal ha korrekt heading for vilkårskortet dersom det ikke skal vurderes ytterligere nedsatt arbeidsevne', () => {
    render(
      <FastsettBeregning
        readOnly={false}
        behandlingVersjon={0}
        grunnlag={{ ...grunnlagUtenVurdering, skalVurdereYtterligere: false }}
      />
    );
    const heading = screen.getByText('§ 11-19 Tidspunktet da arbeidsevnen ble nedsatt, jf. § 11-5');
    expect(heading).toBeVisible();
  });

  it('skal ha korrekt heading for vilkårskortet dersom det skal vurderes ytterligere nedsatt arbeidsevne', () => {
    render(<FastsettBeregning readOnly={false} behandlingVersjon={0} grunnlag={grunnlagUtenVurdering} />);
    const heading = screen.getByText('§ 11-19 Tidspunktet da arbeidsevnen ble nedsatt, jf. § 11-5 og § 11-28');
    expect(heading).toBeVisible();
  });

  it('skal ha en overskrift for ytterlige nedsatt arbeidsevne', () => {
    render(<FastsettBeregning readOnly={false} behandlingVersjon={0} grunnlag={grunnlagUtenVurdering} />);
    const heading = screen.getByText('Tidspunkt arbeidsevne ble ytterligere nedsatt § 11-28');
    expect(heading).toBeVisible();
  });

  it('skal vise alert dersom beregningstidspunkt er etter virkningstidspunkt', async () => {
    render(<FastsettBeregning readOnly={false} behandlingVersjon={0} grunnlag={grunnlagUtenVurdering} />);
    const felt = screen.getByRole('textbox', { name: 'Dato når arbeidsevnen ble nedsatt' });

    const imorgen = format(addDays(Date.now(), 1), 'dd.MM.yyyy');
    await user.type(felt, imorgen);

    const alert = screen.getByText(
      'Sjekk om beregningstidspunkt skal være datert etter tidspunkt for foreløpig virkningstidspunkt'
    );
    expect(alert).toBeVisible();
  });

  it('skal ikke vise alert dersom beregningstidspunkt er før virkningstidspunkt', async () => {
    render(<FastsettBeregning readOnly={false} behandlingVersjon={0} grunnlag={grunnlagUtenVurdering} />);
    const felt = screen.getByRole('textbox', { name: 'Dato når arbeidsevnen ble nedsatt' });

    const igår = format(subDays(Date(), 1), 'dd.MM.yyyy');
    await user.type(felt, igår);

    const alert = screen.queryByText(
      'Sjekk om beregningstidspunkt skal være datert etter tidspunkt for foreløpig virkningstidspunkt'
    );
    expect(alert).not.toBeInTheDocument();
  });
});

describe('Felt for å skrive begrunnelse for nedsatt arbeidsevne', () => {
  it('skal være synlig', () => {
    render(<FastsettBeregning readOnly={false} behandlingVersjon={0} grunnlag={grunnlagUtenVurdering} />);
    const felt = screen.getByRole('textbox', { name: 'Vilkårsvurdering' });
    expect(felt).toBeVisible();
  });

  it('skal vise feilmelding hvis ikke besvart', async () => {
    render(<FastsettBeregning readOnly={false} behandlingVersjon={0} grunnlag={grunnlagUtenVurdering} />);
    await velgBekreft();
    const feilmelding = screen.getByText('Du må skrive en begrunnelse for når brukeren fikk nedsatt arbeidsevne');
    expect(feilmelding).toBeVisible();
  });

  it('skal vise feilmelding hvis satt frem i tid', async () => {
    render(<FastsettBeregning readOnly={false} behandlingVersjon={0} grunnlag={grunnlagUtenVurdering} />);

    const nedsattDato = screen.getByRole('textbox', { name: 'Dato når arbeidsevnen ble nedsatt' });

    const imorgen = format(addDays(Date.now(), 1), 'dd.MM.yyyy');
    await user.type(nedsattDato, imorgen);

    await velgBekreft();
    const feilmelding = screen.getByText('Du kan ikke registrere tidspunkt frem i tid.');
    expect(feilmelding).toBeVisible();
  });
});

describe('Felt for å sette dato for nedsatt arbeidsevne', () => {
  it('skal være synlig', () => {
    render(<FastsettBeregning readOnly={false} behandlingVersjon={0} grunnlag={grunnlagUtenVurdering} />);
    const felt = screen.getByRole('textbox', { name: 'Dato når arbeidsevnen ble nedsatt' });
    expect(felt).toBeVisible();
  });

  it('skal vise feilmelding hvis ikke besvart', async () => {
    render(<FastsettBeregning readOnly={false} behandlingVersjon={0} grunnlag={grunnlagUtenVurdering} />);
    await velgBekreft();
    const feilmelding = screen.getAllByText('Du må sette en dato')[0];
    expect(feilmelding).toBeVisible();
  });
});

describe('Felt for å skrive begrunnelse for ytterligere nedsatt arbeidsevne', () => {
  it('skal være synlig dersom flagget for å vurdere ytterligere nedsatt arbeidsevne er satt til true', () => {
    render(<FastsettBeregning readOnly={false} behandlingVersjon={0} grunnlag={grunnlagUtenVurdering} />);
    const felt = screen.getByRole('textbox', { name: 'Vurder når brukeren fikk ytterligere nedsatt arbeidsevne' });
    expect(felt).toBeVisible();
  });

  it('skal vise feilmelding hvis ikke besvart', async () => {
    render(<FastsettBeregning readOnly={false} behandlingVersjon={0} grunnlag={grunnlagUtenVurdering} />);
    await velgBekreft();
    const feilmelding = screen.getByText(
      'Du må skrive en begrunnelse for når brukeren fikk ytterligere nedsatt arbeidsevne'
    );
    expect(feilmelding).toBeVisible();
  });
});
describe('Felt for å sette dato for ytterligere nedsatt arbeidsevne', () => {
  it('skal være synlig dersom flagget for å vurdere ytterligere nedsatt arbeidsevne er satt til true', () => {
    render(<FastsettBeregning readOnly={false} behandlingVersjon={0} grunnlag={grunnlagUtenVurdering} />);
    const felt = screen.getByRole('textbox', { name: 'Datoen da arbeidsevnen ble ytterligere nedsatt' });
    expect(felt).toBeVisible();
  });

  it('skal vise feilmelding hvis ikke besvart', async () => {
    render(<FastsettBeregning readOnly={false} behandlingVersjon={0} grunnlag={grunnlagUtenVurdering} />);
    await velgBekreft();
    const feilmelding = screen.getAllByText('Du må sette en dato')[0];
    expect(feilmelding).toBeVisible();
  });

  it('skal vise feilmelding dersom ytterligere nedsatt dato er før datoen arbeidsevnen ble nedsatt', async () => {
    render(<FastsettBeregning readOnly={false} behandlingVersjon={0} grunnlag={grunnlagUtenVurdering} />);
    const nedsattDato = screen.getByRole('textbox', { name: 'Dato når arbeidsevnen ble nedsatt' });
    await user.type(nedsattDato, '11.11.2011');

    const ytterligereNedsattDato = screen.getByRole('textbox', {
      name: 'Datoen da arbeidsevnen ble ytterligere nedsatt',
    });
    await user.type(ytterligereNedsattDato, '11.11.2010');

    await velgBekreft();
    const feilmelding = screen.getByText('Ytterligere nedsatt dato kan ikke være før datoen arbeidsevnen ble nedsatt');
    expect(feilmelding).toBeVisible();
  });
});

describe('mellomlagring', () => {
  const mellomlagring: MellomlagretVurderingResponse = {
    mellomlagretVurdering: {
      avklaringsbehovkode: Behovstype.FASTSETT_BEREGNINGSTIDSPUNKT_KODE,
      behandlingId: { id: 1 },
      data: '{"nedsattArbeidsevneDatobegrunnelse":"Dette er min vurdering som er mellomlagret"}',
      vurdertDato: '2025-08-21T12:00:00.000',
      vurdertAv: 'Jan T. Loven',
    },
  };
  const grunnlagMedVurdering: BeregningTidspunktGrunnlag = {
    harTilgangTilÅSaksbehandle: true,
    historiskeVurderinger: [],
    skalVurdereYtterligere: false,
    vurdering: {
      begrunnelse: 'Dette er min vurdering som er bekreftet',
      nedsattArbeidsevneDato: '2025-08-21',
      vurdertAv: {
        ident: 'Saksbehandler',
        dato: '2025-08-21',
      },
    },
  };

  it('Skal vise en tekst om hvem som har gjort vurderingen dersom det finnes en mellomlagring', () => {
    render(
      <FastsettBeregning
        readOnly={false}
        behandlingVersjon={0}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
      />
    );
    const tekst = screen.getByText('Utkast lagret 21.08.2025 12:00 (Jan T. Loven)');
    expect(tekst).toBeVisible();
  });

  it('Skal vise en tekst om hvem som har lagret vurdering dersom bruker trykker på lagre mellomlagring', async () => {
    render(<FastsettBeregning behandlingVersjon={0} readOnly={false} />);

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
      <FastsettBeregning
        behandlingVersjon={0}
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
      <FastsettBeregning
        behandlingVersjon={0}
        readOnly={false}
        grunnlag={grunnlagMedVurdering}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
      />
    );

    const begrunnelseFelt = screen.getByRole('textbox', {
      name: /vilkårsvurdering/i,
    });

    expect(begrunnelseFelt).toHaveValue('Dette er min vurdering som er mellomlagret');
  });

  it('Skal bruke bekreftet vurdering fra grunnlag som defaultValue i skjema dersom mellomlagring ikke finnes', () => {
    render(<FastsettBeregning behandlingVersjon={0} readOnly={false} grunnlag={grunnlagMedVurdering} />);

    const begrunnelseFelt = screen.getByRole('textbox', {
      name: /vilkårsvurdering/i,
    });

    expect(begrunnelseFelt).toHaveValue('Dette er min vurdering som er bekreftet');
  });

  it('Skal resette skjema til tomt skjema dersom det ikke finnes en bekreftet vurdering og bruker sletter mellomlagring', async () => {
    render(
      <FastsettBeregning
        behandlingVersjon={0}
        readOnly={false}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
      />
    );

    await user.type(screen.getByRole('textbox', { name: 'Vilkårsvurdering' }), ' her er ekstra tekst');

    expect(screen.getByRole('textbox', { name: 'Vilkårsvurdering' })).toHaveValue(
      'Dette er min vurdering som er mellomlagret her er ekstra tekst'
    );

    const slettKnapp = screen.getByRole('button', { name: 'Slett utkast' });

    await user.click(slettKnapp);

    expect(screen.getByRole('textbox', { name: 'Vilkårsvurdering' })).toHaveValue('');
  });

  it('Skal resette skjema til bekreftet vurdering dersom det finnes en bekreftet vurdering og bruker sletter mellomlagring', async () => {
    render(
      <FastsettBeregning
        behandlingVersjon={0}
        readOnly={false}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
        grunnlag={grunnlagMedVurdering}
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
      <FastsettBeregning
        behandlingVersjon={0}
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
async function velgBekreft() {
  const bekreftKnapp = screen.getByRole('button', { name: 'Bekreft' });
  await user.click(bekreftKnapp);
}
