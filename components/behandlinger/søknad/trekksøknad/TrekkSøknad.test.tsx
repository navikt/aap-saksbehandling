import { describe, expect, it, vi } from 'vitest';
import { render, screen } from 'lib/test/CustomRender';
import { userEvent } from '@testing-library/user-event';
import { TrekkSøknad } from 'components/behandlinger/søknad/trekksøknad/TrekkSøknad';
import { MellomlagretVurderingResponse, TrukketSøknadGrunnlag } from 'lib/types/types';
import { FetchResponse } from 'lib/utils/api';
import { Behovstype } from 'lib/utils/form';
import createFetchMock from 'vitest-fetch-mock';

const fetchMock = createFetchMock(vi);
fetchMock.enableMocks();
const user = userEvent.setup();

describe('Trekk søknad', () => {
  describe('Generelt', () => {
    it('har en overskrift', () => {
      render(<TrekkSøknad grunnlag={{ vurderinger: [] }} readOnly={false} behandlingVersjon={1} />);
      expect(screen.getByRole('heading', { name: 'Trekk søknad', level: 3 })).toBeVisible();
    });

    it('har et felt for å begrunne hvorfor søknaden skal trekkes', () => {
      render(<TrekkSøknad grunnlag={{ vurderinger: [] }} readOnly={false} behandlingVersjon={1} />);
      expect(screen.getByRole('textbox', { name: 'Begrunnelse' })).toBeVisible();
    });

    it('viser en feilmelding dersom man forsøker å bekrefte uten å ha skrevet en begrunnelse', async () => {
      render(<TrekkSøknad grunnlag={{ vurderinger: [] }} readOnly={false} behandlingVersjon={1} />);
      await user.click(screen.getByRole('button', { name: 'Bekreft' }));
      expect(await screen.findByText('Du må begrunne hvorfor søknaden skal trekkes')).toBeVisible();
    });
  });

  describe('mellomlagring', () => {
    const mellomlagring: MellomlagretVurderingResponse = {
      mellomlagretVurdering: {
        avklaringsbehovkode: Behovstype.VURDER_TREKK_AV_SØKNAD_KODE,
        behandlingId: { id: 1 },
        data: '{"begrunnelse":"Dette er min vurdering som er mellomlagret"}',
        vurdertDato: '2025-08-21T12:00:00.000',
        vurdertAv: 'Jan T. Loven',
      },
    };

    const trukketSøknadGrunnlagMedVurdering: TrukketSøknadGrunnlag = {
      vurderinger: [
        {
          begrunnelse: 'Dette er min vurdering som er bekreftet',
          vurdertAv: 'Kjell T. Ringen',
          vurdertDato: '2025-08-21',
          journalpostId: '123',
        },
      ],
    };

    const trukketSøknadGrunnlagUtenVurdering: TrukketSøknadGrunnlag = {
      vurderinger: [],
    };

    it('Skal vise en tekst om hvem som har gjort vurderingen dersom det finnes en mellomlagring', () => {
      render(
        <TrekkSøknad
          readOnly={false}
          behandlingVersjon={0}
          grunnlag={trukketSøknadGrunnlagUtenVurdering}
          initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
        />
      );
      const tekst = screen.getByText('Utkast lagret 21.08.2025 12:00 (Jan T. Loven)');
      expect(tekst).toBeVisible();
    });

    it('Skal vise en tekst om hvem som har lagret vurdering dersom bruker trykker på lagre mellomlagring', async () => {
      render(<TrekkSøknad readOnly={false} behandlingVersjon={0} grunnlag={trukketSøknadGrunnlagUtenVurdering} />);

      await user.type(
        screen.getByRole('textbox', { name: 'Begrunnelse' }),
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
        <TrekkSøknad
          readOnly={false}
          behandlingVersjon={0}
          grunnlag={trukketSøknadGrunnlagUtenVurdering}
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
        <TrekkSøknad
          readOnly={false}
          behandlingVersjon={0}
          grunnlag={trukketSøknadGrunnlagUtenVurdering}
          initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
        />
      );

      const begrunnelseFelt = screen.getByRole('textbox', {
        name: /begrunnelse/i,
      });

      expect(begrunnelseFelt).toHaveValue('Dette er min vurdering som er mellomlagret');
    });

    it('Skal bruke bekreftet vurdering fra grunnlag som defaultValue i skjema dersom mellomlagring ikke finnes', () => {
      render(<TrekkSøknad readOnly={false} behandlingVersjon={0} grunnlag={trukketSøknadGrunnlagMedVurdering} />);

      const begrunnelseFelt = screen.getByRole('textbox', {
        name: /begrunnelse/i,
      });

      expect(begrunnelseFelt).toHaveValue('Dette er min vurdering som er bekreftet');
    });

    it('Skal resette skjema til tomt skjema dersom det ikke finnes en bekreftet vurdering og bruker sletter mellomlagring', async () => {
      render(
        <TrekkSøknad
          readOnly={false}
          behandlingVersjon={0}
          grunnlag={trukketSøknadGrunnlagUtenVurdering}
          initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
        />
      );

      await user.type(screen.getByRole('textbox', { name: 'Begrunnelse' }), ' her er ekstra tekst');

      expect(screen.getByRole('textbox', { name: 'Begrunnelse' })).toHaveValue(
        'Dette er min vurdering som er mellomlagret her er ekstra tekst'
      );

      const slettKnapp = screen.getByRole('button', { name: 'Slett utkast' });

      await user.click(slettKnapp);

      expect(screen.getByRole('textbox', { name: 'Begrunnelse' })).toHaveValue('');
    });

    it('Skal resette skjema til bekreftet vurdering dersom det finnes en bekreftet vurdering og bruker sletter mellomlagring', async () => {
      render(
        <TrekkSøknad
          readOnly={false}
          behandlingVersjon={0}
          grunnlag={trukketSøknadGrunnlagMedVurdering}
          initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
        />
      );

      await user.type(screen.getByRole('textbox', { name: 'Begrunnelse' }), ' her er ekstra tekst');

      expect(screen.getByRole('textbox', { name: 'Begrunnelse' })).toHaveValue(
        'Dette er min vurdering som er mellomlagret her er ekstra tekst'
      );

      const slettKnapp = screen.getByRole('button', { name: 'Slett utkast' });

      await user.click(slettKnapp);

      expect(screen.getByRole('textbox', { name: 'Begrunnelse' })).toHaveValue(
        'Dette er min vurdering som er bekreftet'
      );
    });
  });
});
