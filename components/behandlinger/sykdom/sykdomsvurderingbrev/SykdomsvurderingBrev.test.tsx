import { describe, expect, it, vi } from 'vitest';
import { render, screen } from 'lib/test/CustomRender';
import { userEvent } from '@testing-library/user-event';
import { MellomlagretVurderingResponse, SykdomsvurderingBrevGrunnlag } from 'lib/types/types';
import { SykdomsvurderingBrev } from 'components/behandlinger/sykdom/sykdomsvurderingbrev/SykdomsvurderingBrev';
import { Behovstype } from 'lib/utils/form';
import { FetchResponse } from 'lib/utils/api';
import createFetchMock from 'vitest-fetch-mock';

const fetchMock = createFetchMock(vi);
fetchMock.enableMocks();
const user = userEvent.setup();

const grunnlag: SykdomsvurderingBrevGrunnlag = {
  vurdering: undefined,
  historiskeVurderinger: [],
  kanSaksbehandle: true,
};

describe('sykdomsvurdering for brev', () => {
  it('Skal vise vurderingsfelt', async () => {
    render(
      <SykdomsvurderingBrev
        grunnlag={grunnlag}
        typeBehandling={'Førstegangsbehandling'}
        readOnly={false}
        behandlingVersjon={0}
      />
    );
    const textbox = screen.getByRole('textbox', { name: 'Derfor får du AAP / Derfor får du ikke AAP' });
    expect(textbox).toBeVisible();
  });

  it('Skal vise feilmelding dersom vurderingsfeltet ikke har blitt besvart', async () => {
    render(
      <SykdomsvurderingBrev
        grunnlag={grunnlag}
        typeBehandling={'Førstegangsbehandling'}
        readOnly={false}
        behandlingVersjon={0}
      />
    );
    const button = screen.getByRole('button', { name: 'Bekreft' });
    await user.click(button);

    expect(await screen.findByText('Du må skrive en individuell begrunnelse')).toBeVisible();
  });
});

const mellomlagring: MellomlagretVurderingResponse = {
  mellomlagretVurdering: {
    avklaringsbehovkode: Behovstype.SYKDOMSVURDERING_BREV_KODE,
    behandlingId: { id: 1 },
    data: '{"vurdering":"Dette er min vurdering som er mellomlagret", "vurderingSkalFyllesUt": "ja"}',
    vurdertDato: '2025-08-21T12:00:00.000',
    vurdertAv: 'Jan T. Loven',
  },
};

const grunnlagMedVurdering: SykdomsvurderingBrevGrunnlag = {
  historiskeVurderinger: [],
  kanSaksbehandle: true,
  vurdering: {
    vurdering: 'Dette er min vurdering som er bekreftet',
    vurdertAv: { ident: 'Saksbehandler', dato: '2025-08-21' },
  },
};

const grunnlagUtenVurdering: SykdomsvurderingBrevGrunnlag = {
  historiskeVurderinger: [],
  kanSaksbehandle: true,
};

it('Skal vise en tekst om hvem som har gjort vurderingen dersom det finnes en mellomlagring', () => {
  render(
    <SykdomsvurderingBrev
      typeBehandling={'Førstegangsbehandling'}
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
  render(
    <SykdomsvurderingBrev
      typeBehandling={'Førstegangsbehandling'}
      readOnly={false}
      behandlingVersjon={0}
      grunnlag={grunnlagUtenVurdering}
    />
  );

  await user.type(
    screen.getByRole('textbox', { name: 'Derfor får du AAP / Derfor får du ikke AAP' }),
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
    <SykdomsvurderingBrev
      typeBehandling={'Førstegangsbehandling'}
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
    <SykdomsvurderingBrev
      typeBehandling={'Førstegangsbehandling'}
      readOnly={false}
      behandlingVersjon={0}
      grunnlag={grunnlagUtenVurdering}
      initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
    />
  );

  const begrunnelseFelt = screen.getByRole('textbox', {
    name: 'Derfor får du AAP / Derfor får du ikke AAP',
  });

  expect(begrunnelseFelt).toHaveValue('Dette er min vurdering som er mellomlagret');
});

it('Skal bruke bekreftet vurdering fra grunnlag som defaultValue i skjema dersom mellomlagring ikke finnes', () => {
  render(
    <SykdomsvurderingBrev
      typeBehandling={'Førstegangsbehandling'}
      readOnly={false}
      behandlingVersjon={0}
      grunnlag={grunnlagMedVurdering}
    />
  );

  const begrunnelseFelt = screen.getByRole('textbox', {
    name: 'Derfor får du AAP / Derfor får du ikke AAP',
  });

  expect(begrunnelseFelt).toHaveValue('Dette er min vurdering som er bekreftet');
});

it('Skal resette skjema til tomt skjema dersom det ikke finnes en bekreftet vurdering og bruker sletter mellomlagring', async () => {
  render(
    <SykdomsvurderingBrev
      typeBehandling={'Førstegangsbehandling'}
      readOnly={false}
      behandlingVersjon={0}
      grunnlag={grunnlagUtenVurdering}
      initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
    />
  );

  await user.type(
    screen.getByRole('textbox', { name: 'Derfor får du AAP / Derfor får du ikke AAP' }),
    ' her er ekstra tekst'
  );

  expect(screen.getByRole('textbox', { name: 'Derfor får du AAP / Derfor får du ikke AAP' })).toHaveValue(
    'Dette er min vurdering som er mellomlagret her er ekstra tekst'
  );

  const slettUtkastKnapp = screen.getByRole('button', { name: 'Slett utkast' });
  await user.click(slettUtkastKnapp);

  // TODO AAP-1354 Legg til test for tomt vurderingsfelt etter sletting av utkast
});

// TODO Ta inn denne når mellomlagring er i produksjon
it.skip('Skal resette skjema til bekreftet vurdering dersom det finnes en bekreftet vurdering og bruker sletter mellomlagring', async () => {
  render(
    <SykdomsvurderingBrev
      typeBehandling={'Førstegangsbehandling'}
      readOnly={false}
      behandlingVersjon={0}
      grunnlag={grunnlagMedVurdering}
      initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
    />
  );

  await user.type(
    screen.getByRole('textbox', { name: 'Derfor får du AAP / Derfor får du ikke AAP' }),
    ' her er ekstra tekst'
  );

  expect(screen.getByRole('textbox', { name: 'Derfor får du AAP / Derfor får du ikke AAP' })).toHaveValue(
    'Dette er min vurdering som er mellomlagret her er ekstra tekst'
  );

  const mockFetchResponseSlettMellomlagring: FetchResponse<object> = { type: 'SUCCESS', status: 202, data: {} };
  fetchMock.mockResponse(JSON.stringify(mockFetchResponseSlettMellomlagring));

  const slettKnapp = screen.getByRole('button', {
    name: /slett utkast/i,
  });

  await user.click(slettKnapp);

  expect(screen.getByRole('textbox', { name: 'Derfor får du AAP / Derfor får du ikke AAP' })).toHaveValue(
    'Dette er min vurdering som er bekreftet'
  );
});

it('Skal ikke være mulig å lagre eller slette mellomlagring hvis det er readOnly', () => {
  render(
    <SykdomsvurderingBrev
      typeBehandling={'Førstegangsbehandling'}
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
