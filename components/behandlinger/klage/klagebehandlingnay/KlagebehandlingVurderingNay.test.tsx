import { beforeEach, describe, expect, it, vi } from 'vitest';
import { KlagebehandlingVurderingNay } from './KlagebehandlingVurderingNay';
import { render, screen } from 'lib/test/CustomRender';
import { userEvent } from '@testing-library/user-event';
import { KlagebehandlingNayGrunnlag, MellomlagretVurderingResponse } from 'lib/types/types';
import { Behovstype } from 'lib/utils/form';
import { FetchResponse } from 'lib/utils/api';
import createFetchMock from 'vitest-fetch-mock';
import { defaultFlytResponse, setMockFlytResponse } from 'vitestSetup';

const fetchMock = createFetchMock(vi);
fetchMock.enableMocks();
const user = userEvent.setup();

beforeEach(() => {
  setMockFlytResponse({ ...defaultFlytResponse, aktivtSteg: 'KLAGEBEHANDLING_NAY' });
});

describe('Klage - vurdering nay', () => {
  it('Skal ha en overskrift', () => {
    render(<KlagebehandlingVurderingNay readOnly={false} behandlingVersjon={0} typeBehandling={'Klage'} />);

    const heading = screen.getByText('Behandle klage');
    expect(heading).toBeVisible();
  });

  it('Skal ha felt for vurdering', () => {
    render(
      <KlagebehandlingVurderingNay
        grunnlag={{
          vurdering: {
            begrunnelse: 'Min begrunnelse',
            notat: 'Test notat',
            innstilling: 'OMGJØR',
            vilkårSomOmgjøres: ['FOLKETRYGDLOVEN_11_5'],
            vilkårSomOpprettholdes: [],
            vurdertAv: {
              ident: 'ident',
              dato: '2025-01-01',
              ansattnavn: 'Ine',
              enhetsnavn: 'Kontor',
            },
          },
          harTilgangTilÅSaksbehandle: true,
        }}
        readOnly={false}
        behandlingVersjon={0}
        typeBehandling={'Klage'}
      />
    );
    const begrunnelse = screen.getByRole('textbox', { name: 'Vurder klage' });
    expect(begrunnelse).toBeVisible();
    expect(begrunnelse).toHaveValue('Min begrunnelse');
  });

  it('Skal vise valideringsfeil når man velger en ikke-implementert hjemmel', async () => {
    render(<KlagebehandlingVurderingNay readOnly={false} behandlingVersjon={0} typeBehandling={'Klage'} />);

    // Fyll ut obligatoriske felt og velg hjemme 11-3 i dropdown, denne er ikke implementert enda
    const begrunnelse = screen.getByRole('textbox', { name: 'Vurder klage' });
    await user.type(begrunnelse, 'Test begrunnelse');

    const omgjørRadio = screen.getByRole('radio', { name: 'Vedtak omgjøres' });
    await user.click(omgjørRadio);

    const combobox = screen.getByRole('combobox', { name: 'Hvilke vilkår skal omgjøres?' });
    await user.click(combobox);

    const option = screen.getByRole('option', { name: '§ 11-3' });
    await user.click(option);

    const bekreftKnapp = screen.getByRole('button', { name: 'Bekreft' });
    await user.click(bekreftKnapp);

    expect(screen.getByText(/Det er ikke mulig å opprette revurdering på/)).toBeVisible();
    expect(combobox).toHaveAttribute('aria-invalid');
  });

  it('Skal ikke vise valideringsfeil når man velger en implementert hjemmel', async () => {
    render(<KlagebehandlingVurderingNay readOnly={false} behandlingVersjon={0} typeBehandling={'Klage'} />);

    // Fyll ut obligatoriske felt og velg en hjemme som er implementert i dropdownen (11-5)
    const begrunnelse = screen.getByRole('textbox', { name: 'Vurder klage' });
    await user.type(begrunnelse, 'Test begrunnelse');

    const omgjørRadio = screen.getByRole('radio', { name: 'Vedtak omgjøres' });
    await user.click(omgjørRadio);

    const combobox = screen.getByRole('combobox', { name: 'Hvilke vilkår skal omgjøres?' });
    await user.click(combobox);

    const option = screen.getByRole('option', { name: '§ 11-5' });
    await user.click(option);

    const bekreftKnapp = screen.getByRole('button', { name: 'Bekreft' });
    await user.click(bekreftKnapp);

    expect(screen.queryByText(/Det er ikke mulig å opprette revurdering på/)).not.toBeInTheDocument();
    expect(combobox).not.toHaveAttribute('aria-invalid');
  });
});

describe('mellomlagring', () => {
  const mellomlagring: MellomlagretVurderingResponse = {
    mellomlagretVurdering: {
      avklaringsbehovkode: Behovstype.VURDER_KLAGE_KONTOR,
      behandlingId: { id: 1 },
      data: '{"vurdering":"Dette er min vurdering som er mellomlagret"}',
      vurdertDato: '2025-08-21T12:00:00.000',
      vurdertAv: 'Jan T. Loven',
    },
  };

  const grunnlagMedVurdering: KlagebehandlingNayGrunnlag = {
    harTilgangTilÅSaksbehandle: true,
    vurdering: {
      begrunnelse: 'Dette er min vurdering som er bekreftet',
      innstilling: 'OMGJØR',
      notat: '',
      vilkårSomOmgjøres: [],
      vilkårSomOpprettholdes: [],
    },
  };

  it('Skal vise en tekst om hvem som har gjort vurderingen dersom det finnes en mellomlagring', () => {
    render(
      <KlagebehandlingVurderingNay
        typeBehandling={'Førstegangsbehandling'}
        readOnly={false}
        behandlingVersjon={0}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
      />
    );
    const tekst = screen.getByText('Utkast lagret 21.08.2025 12:00 (Jan T. Loven)');
    expect(tekst).toBeVisible();
  });

  it('Skal vise en tekst om hvem som har lagret vurdering dersom bruker trykker på lagre mellomlagring', async () => {
    render(
      <KlagebehandlingVurderingNay behandlingVersjon={0} typeBehandling={'Førstegangsbehandling'} readOnly={false} />
    );
    await user.type(
      screen.getByRole('textbox', { name: 'Vurder klage' }),
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
      <KlagebehandlingVurderingNay
        typeBehandling={'Førstegangsbehandling'}
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
      <KlagebehandlingVurderingNay
        typeBehandling={'Førstegangsbehandling'}
        behandlingVersjon={0}
        readOnly={false}
        grunnlag={grunnlagMedVurdering}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
      />
    );

    const begrunnelseFelt = screen.getByRole('textbox', {
      name: 'Vurder klage',
    });

    expect(begrunnelseFelt).toHaveValue('Dette er min vurdering som er mellomlagret');
  });

  it('Skal bruke bekreftet vurdering fra grunnlag som defaultValue i skjema dersom mellomlagring ikke finnes', () => {
    render(
      <KlagebehandlingVurderingNay
        typeBehandling={'Førstegangsbehandling'}
        behandlingVersjon={0}
        readOnly={false}
        grunnlag={grunnlagMedVurdering}
      />
    );

    const begrunnelseFelt = screen.getByRole('textbox', {
      name: 'Vurder klage',
    });

    expect(begrunnelseFelt).toHaveValue('Dette er min vurdering som er bekreftet');
  });

  it('Skal resette skjema til tomt skjema dersom det ikke finnes en bekreftet vurdering og bruker sletter mellomlagring', async () => {
    render(
      <KlagebehandlingVurderingNay
        typeBehandling={'Førstegangsbehandling'}
        behandlingVersjon={0}
        readOnly={false}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
      />
    );

    await user.type(screen.getByRole('textbox', { name: 'Vurder klage' }), ' her er ekstra tekst');

    expect(screen.getByRole('textbox', { name: 'Vurder klage' })).toHaveValue(
      'Dette er min vurdering som er mellomlagret her er ekstra tekst'
    );

    const slettKnapp = screen.getByRole('button', { name: 'Slett utkast' });

    await user.click(slettKnapp);

    expect(screen.getByRole('textbox', { name: 'Vurder klage' })).toHaveValue('');
  });

  it('Skal resette skjema til bekreftet vurdering dersom det finnes en bekreftet vurdering og bruker sletter mellomlagring', async () => {
    render(
      <KlagebehandlingVurderingNay
        typeBehandling={'Førstegangsbehandling'}
        behandlingVersjon={0}
        readOnly={false}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
        grunnlag={grunnlagMedVurdering}
      />
    );

    await user.type(screen.getByRole('textbox', { name: 'Vurder klage' }), ' her er ekstra tekst');

    expect(screen.getByRole('textbox', { name: 'Vurder klage' })).toHaveValue(
      'Dette er min vurdering som er mellomlagret her er ekstra tekst'
    );

    const slettKnapp = screen.getByRole('button', { name: 'Slett utkast' });

    await user.click(slettKnapp);

    expect(screen.getByRole('textbox', { name: 'Vurder klage' })).toHaveValue(
      'Dette er min vurdering som er bekreftet'
    );
  });

  it('Skal ikke være mulig å lagre eller slette mellomlagring hvis det er readOnly', () => {
    render(
      <KlagebehandlingVurderingNay
        typeBehandling={'Førstegangsbehandling'}
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
