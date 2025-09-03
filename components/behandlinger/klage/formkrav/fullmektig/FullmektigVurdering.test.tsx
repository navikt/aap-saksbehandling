import { describe, expect, it, vi } from 'vitest';

import { FullmektigVurdering } from './FullmektigVurdering';
import { FullmektigGrunnlag, MellomlagretVurderingResponse } from 'lib/types/types';
import { FetchResponse } from 'lib/utils/api';
import createFetchMock from 'vitest-fetch-mock';

import { render, screen } from 'lib/test/CustomRender';
import userEvent from '@testing-library/user-event';
import { within } from '@testing-library/react';

const fetchMock = createFetchMock(vi);
fetchMock.enableMocks();
const user = userEvent.setup();

describe('Klage', () => {
  it('Skal ha en overskrift', () => {
    render(<FullmektigVurdering readOnly={false} behandlingVersjon={0} typeBehandling={'Klage'} />);

    const heading = screen.getByText('Fullmektig/verge');
    expect(heading).toBeVisible();
  });

  it('Skal ha felt for å velge hvorvidt det finnes verge/fullmektig', () => {
    render(<FullmektigVurdering readOnly={false} behandlingVersjon={0} typeBehandling={'Klage'} />);
    const fullmektig = screen.getByRole('group', { name: 'Finnes det fullmektig eller verge i klagesaken?' });
    expect(fullmektig).toBeVisible();
  });
});

describe('mellomlagring', () => {
  const mellomlagring: MellomlagretVurderingResponse = {
    mellomlagretVurdering: {
      avklaringsbehovkode: '5006',
      behandlingId: { id: 1 },
      data: '{"harFullmektig":"nei"}',
      vurdertDato: '2025-08-21T12:00:00.000',
      vurdertAv: 'Jan T. Loven',
    },
  };

  const grunnlagMedVurdering: FullmektigGrunnlag = {
    vurdering: {
      harFullmektig: true,
    },
    harTilgangTilÅSaksbehandle: true,
  };

  it('Skal vise en tekst om hvem som har gjort vurderingen dersom det finnes en mellomlagring', () => {
    render(
      <FullmektigVurdering
        readOnly={false}
        behandlingVersjon={0}
        typeBehandling={'Førstegangsbehandling'}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
      />
    );
    const tekst = screen.getByText('Utkast lagret 21.08.2025 12:00 (Jan T. Loven)');
    expect(tekst).toBeVisible();
  });

  it(
    'Skal vise en tekst om hvem som har lagret vurdering dersom bruker trykker på lagre ' + 'mellomlagring',
    async () => {
      render(<FullmektigVurdering behandlingVersjon={0} readOnly={false} typeBehandling={'Førstegangsbehandling'} />);

      await user.click(
        within(
          screen.getByRole('group', {
            name: /finnes det fullmektig eller verge i klagesaken\?/i,
          })
        ).getByRole('radio', { name: 'Ja' })
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
    }
  );

  it('Skal ikke vise tekst om hvem som har gjort mellomlagring dersom bruker trykker på slett mellomlagring', async () => {
    render(
      <FullmektigVurdering
        behandlingVersjon={0}
        readOnly={false}
        typeBehandling={'Førstegangsbehandling'}
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
      <FullmektigVurdering
        behandlingVersjon={0}
        readOnly={false}
        typeBehandling={'Førstegangsbehandling'}
        grunnlag={grunnlagMedVurdering}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
      />
    );

    const finnesDetFullmektigEllerVergeIKlagesakenFelt = within(
      screen.getByRole('group', {
        name: /finnes det fullmektig eller verge i klagesaken\?/i,
      })
    ).getByRole('radio', { name: 'Nei' });

    expect(finnesDetFullmektigEllerVergeIKlagesakenFelt).toBeChecked();
  });

  it('Skal bruke bekreftet vurdering fra grunnlag som defaultValue i skjema dersom mellomlagring ikke finnes', () => {
    render(
      <FullmektigVurdering
        behandlingVersjon={0}
        readOnly={false}
        typeBehandling={'Førstegangsbehandling'}
        grunnlag={grunnlagMedVurdering}
      />
    );

    const finnesDetFullmektigEllerVergeIKlagesakenFelt = within(
      screen.getByRole('group', {
        name: /finnes det fullmektig eller verge i klagesaken\?/i,
      })
    ).getByRole('radio', { name: 'Ja' });

    expect(finnesDetFullmektigEllerVergeIKlagesakenFelt).toBeChecked();
  });

  it('Skal resette skjema til tomt skjema dersom det ikke finnes en bekreftet vurdering og bruker sletter mellomlagring', async () => {
    render(
      <FullmektigVurdering
        behandlingVersjon={0}
        readOnly={false}
        typeBehandling={'Førstegangsbehandling'}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
      />
    );

    const finnesDetFullmektigEllerVergeIKlagesakenFelt = within(
      screen.getByRole('group', {
        name: /finnes det fullmektig eller verge i klagesaken\?/i,
      })
    ).getByRole('radio', { name: 'Ja' });

    await user.click(finnesDetFullmektigEllerVergeIKlagesakenFelt);

    expect(
      within(
        screen.getByRole('group', {
          name: /finnes det fullmektig eller verge i klagesaken\?/i,
        })
      ).getByRole('radio', { name: 'Ja' })
    ).toBeChecked();

    const mockFetchResponseSlettMellomlagring: FetchResponse<object> = { type: 'SUCCESS', status: 202, data: {} };
    fetchMock.mockResponse(JSON.stringify(mockFetchResponseSlettMellomlagring));
    const slettKnapp = screen.getByRole('button', { name: 'Slett utkast' });

    await user.click(slettKnapp);

    expect(
      within(
        screen.getByRole('group', {
          name: /finnes det fullmektig eller verge i klagesaken\?/i,
        })
      ).getByRole('radio', { name: 'Ja' })
    ).not.toBeChecked();
  });

  it('Skal resette skjema til bekreftet vurdering dersom det finnes en bekreftet vurdering og bruker sletter mellomlagring', async () => {
    render(
      <FullmektigVurdering
        behandlingVersjon={0}
        readOnly={false}
        typeBehandling={'Førstegangsbehandling'}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
        grunnlag={grunnlagMedVurdering}
      />
    );

    await user.click(
      within(
        screen.getByRole('group', {
          name: /finnes det fullmektig eller verge i klagesaken\?/i,
        })
      ).getByRole('radio', { name: 'Nei' })
    );

    expect(
      within(
        screen.getByRole('group', {
          name: /finnes det fullmektig eller verge i klagesaken\?/i,
        })
      ).getByRole('radio', { name: 'Nei' })
    ).toBeChecked();

    const mockFetchResponseSlettMellomlagring: FetchResponse<object> = { type: 'SUCCESS', status: 202, data: {} };
    fetchMock.mockResponse(JSON.stringify(mockFetchResponseSlettMellomlagring));
    const slettKnapp = screen.getByRole('button', { name: 'Slett utkast' });

    await user.click(slettKnapp);

    expect(
      within(
        screen.getByRole('group', {
          name: /finnes det fullmektig eller verge i klagesaken\?/i,
        })
      ).getByRole('radio', { name: 'Ja' })
    ).toBeChecked();
  });

  it('Skal ikke være mulig å lagre eller slette mellomlagring hvis det er readOnly', () => {
    render(
      <FullmektigVurdering
        behandlingVersjon={0}
        readOnly={true}
        typeBehandling={'Førstegangsbehandling'}
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
