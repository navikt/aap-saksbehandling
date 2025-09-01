import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '../../../../../lib/test/CustomRender';
import { BehandlendeEnhet } from './BehandlendeEnhet';
import { BehandlendeEnhetGrunnlag, MellomlagretVurderingResponse } from 'lib/types/types';
import { within } from '@testing-library/react';
import { FetchResponse } from 'lib/utils/api';
import createFetchMock from 'vitest-fetch-mock';
import userEvent from '@testing-library/user-event';

const fetchMock = createFetchMock(vi);
fetchMock.enableMocks();
const user = userEvent.setup();

describe('Klage - behandlende enhet', () => {
  it('Skal ha en overskrift', () => {
    render(<BehandlendeEnhet grunnlag={undefined} readOnly={false} behandlingVersjon={0} typeBehandling={'Klage'} />);

    const heading = screen.getByText('Klagebehandlende enhet');
    expect(heading).toBeVisible();
  });

  it('Skal vise radio med alternativer', () => {
    render(<BehandlendeEnhet grunnlag={undefined} readOnly={false} behandlingVersjon={0} typeBehandling={'Klage'} />);

    expect(screen.getByRole('radio', { name: /NAY/ })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /Nav-kontor/ })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /Begge/ })).toBeInTheDocument();
  });
});

describe('mellomlagring', () => {
  const mellomlagring: MellomlagretVurderingResponse = {
    mellomlagretVurdering: {
      avklaringsbehovkode: '5006',
      behandlingId: { id: 1 },
      data: '{"hvemSkalBehandle":"NAV_KONTOR"}',
      vurdertDato: '2025-08-21T12:00:00.000',
      vurdertAv: 'Jan T. Loven',
    },
  };

  const grunnlagMedVurdering: BehandlendeEnhetGrunnlag = {
    vurdering: {
      skalBehandlesAvKontor: false,
      skalBehandlesAvNay: true,
    },
    harTilgangTilÅSaksbehandle: true,
  };

  it('Skal vise en tekst om hvem som har gjort vurderingen dersom det finnes en mellomlagring', () => {
    render(
      <BehandlendeEnhet
        readOnly={false}
        behandlingVersjon={0}
        typeBehandling={'Førstegangsbehandling'}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
      />
    );
    const tekst = screen.getByText('Utkast lagret 21.08.2025 12:00 (Jan T. Loven)');
    expect(tekst).toBeVisible();
  });

  it('Skal vise en tekst om hvem som har lagret vurdering dersom bruker trykker på lagre mellomlagring', async () => {
    render(<BehandlendeEnhet behandlingVersjon={0} readOnly={false} typeBehandling={'Førstegangsbehandling'} />);

    await user.click(
      within(
        screen.getByRole('group', {
          name: 'Hvem skal vurdere vilkårene det er klaget på?',
        })
      ).getByRole('radio', { name: 'Nav-kontor' })
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
      <BehandlendeEnhet
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
      <BehandlendeEnhet
        behandlingVersjon={0}
        readOnly={false}
        typeBehandling={'Førstegangsbehandling'}
        grunnlag={grunnlagMedVurdering}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
      />
    );

    const hvemSkalVurdereFelt = within(
      screen.getByRole('group', {
        name: 'Hvem skal vurdere vilkårene det er klaget på?',
      })
    ).getByRole('radio', { name: 'Nav-kontor' });

    expect(hvemSkalVurdereFelt).toBeChecked();
  });

  it('Skal bruke bekreftet vurdering fra grunnlag som defaultValue i skjema dersom mellomlagring ikke finnes', () => {
    render(
      <BehandlendeEnhet
        behandlingVersjon={0}
        readOnly={false}
        typeBehandling={'Førstegangsbehandling'}
        grunnlag={grunnlagMedVurdering}
      />
    );

    const hvemSkalVurdereFelt = within(
      screen.getByRole('group', {
        name: 'Hvem skal vurdere vilkårene det er klaget på?',
      })
    ).getByRole('radio', { name: 'NAY' });

    expect(hvemSkalVurdereFelt).toBeChecked();
  });

  it('Skal resette skjema til tomt skjema dersom det ikke finnes en bekreftet vurdering og bruker sletter mellomlagring', async () => {
    render(
      <BehandlendeEnhet
        behandlingVersjon={0}
        readOnly={false}
        typeBehandling={'Førstegangsbehandling'}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
      />
    );

    const hvemSkalVurdereFelt = within(
      screen.getByRole('group', {
        name: 'Hvem skal vurdere vilkårene det er klaget på?',
      })
    ).getByRole('radio', { name: 'Nav-kontor' });

    await user.click(hvemSkalVurdereFelt);

    expect(
      within(
        screen.getByRole('group', {
          name: 'Hvem skal vurdere vilkårene det er klaget på?',
        })
      ).getByRole('radio', { name: 'Nav-kontor' })
    ).toBeChecked();

    const mockFetchResponseSlettMellomlagring: FetchResponse<object> = { type: 'SUCCESS', status: 202, data: {} };
    fetchMock.mockResponse(JSON.stringify(mockFetchResponseSlettMellomlagring));
    const slettKnapp = screen.getByRole('button', { name: 'Slett utkast' });

    await user.click(slettKnapp);

    expect(
      within(
        screen.getByRole('group', {
          name: 'Hvem skal vurdere vilkårene det er klaget på?',
        })
      ).getByRole('radio', { name: 'Nav-kontor' })
    ).not.toBeChecked();
  });

  it('Skal resette skjema til bekreftet vurdering dersom det finnes en bekreftet vurdering og bruker sletter mellomlagring', async () => {
    render(
      <BehandlendeEnhet
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
          name: 'Hvem skal vurdere vilkårene det er klaget på?',
        })
      ).getByRole('radio', { name: 'Nav-kontor' })
    );

    expect(
      within(
        screen.getByRole('group', {
          name: 'Hvem skal vurdere vilkårene det er klaget på?',
        })
      ).getByRole('radio', { name: 'Nav-kontor' })
    ).toBeChecked();

    const mockFetchResponseSlettMellomlagring: FetchResponse<object> = { type: 'SUCCESS', status: 202, data: {} };
    fetchMock.mockResponse(JSON.stringify(mockFetchResponseSlettMellomlagring));
    const slettKnapp = screen.getByRole('button', { name: 'Slett utkast' });

    await user.click(slettKnapp);

    expect(
      within(
        screen.getByRole('group', {
          name: 'Hvem skal vurdere vilkårene det er klaget på?',
        })
      ).getByRole('radio', { name: 'NAY' })
    ).toBeChecked();
  });

  it('Skal ikke være mulig å lagre eller slette mellomlagring hvis det er readOnly', () => {
    render(
      <BehandlendeEnhet
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
