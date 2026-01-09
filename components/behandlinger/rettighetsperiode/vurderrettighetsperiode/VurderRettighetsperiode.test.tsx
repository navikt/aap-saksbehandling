import { beforeEach, describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MellomlagretVurderingResponse, RettighetsperiodeGrunnlag } from 'lib/types/types';
import { Behovstype } from 'lib/utils/form';
import { VurderRettighetsperiode } from 'components/behandlinger/rettighetsperiode/vurderrettighetsperiode/VurderRettighetsperiode';
import { FetchResponse } from 'lib/utils/api';
import { customRender } from 'lib/test/CustomRender';
import createFetchMock from 'vitest-fetch-mock';
import { defaultFlytResponse, setMockFlytResponse } from 'vitestSetup';

const fetchMock = createFetchMock(vi);
fetchMock.enableMocks();
const user = userEvent.setup();

beforeEach(() => {
  setMockFlytResponse({ ...defaultFlytResponse, aktivtSteg: 'VURDER_RETTIGHETSPERIODE' });
});

describe('Vurder rettighetsperiode', () => {
  describe('mellomlagring', () => {
    const mellomlagring: MellomlagretVurderingResponse = {
      mellomlagretVurdering: {
        avklaringsbehovkode: Behovstype.VURDER_RETTIGHETSPERIODE,
        behandlingId: { id: 1 },
        data: '{"begrunnelse":"Dette er min vurdering som er mellomlagret"}',
        vurdertDato: '2025-08-21T12:00:00.000',
        vurdertAv: 'Jan T. Loven',
      },
    };

    const RettighetsperiodeGrunnlagMedVurdering: RettighetsperiodeGrunnlag = {
      harTilgangTilÅSaksbehandle: false,
      vurdering: {
        harRett: 'Nei',
        begrunnelse: 'Dette er min vurdering som er bekreftet',
        vurdertAv: { ident: 'Kjell T. Ringen', dato: '2025-08-21' },
      },
    };

    const RettighetsperiodeGrunnlagUtenVurdering: RettighetsperiodeGrunnlag = {
      harTilgangTilÅSaksbehandle: true,
    };

    it('Skal vise en tekst om hvem som har gjort vurderingen dersom det finnes en mellomlagring', () => {
      customRender(
        <VurderRettighetsperiode
          readOnly={false}
          behandlingVersjon={0}
          grunnlag={RettighetsperiodeGrunnlagUtenVurdering}
          initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
        />
      );
      const tekst = screen.getByText('Utkast lagret 21.08.2025 12:00 (Jan T. Loven)');
      expect(tekst).toBeVisible();
    });

    it('Skal vise en tekst om hvem som har lagret vurdering dersom bruker trykker på lagre mellomlagring', async () => {
      customRender(
        <VurderRettighetsperiode
          readOnly={false}
          behandlingVersjon={0}
          grunnlag={RettighetsperiodeGrunnlagUtenVurdering}
        />
      );

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
      customRender(
        <VurderRettighetsperiode
          readOnly={false}
          behandlingVersjon={0}
          grunnlag={RettighetsperiodeGrunnlagUtenVurdering}
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
      customRender(
        <VurderRettighetsperiode
          readOnly={false}
          behandlingVersjon={0}
          grunnlag={RettighetsperiodeGrunnlagUtenVurdering}
          initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
        />
      );

      const begrunnelseFelt = screen.getByRole('textbox', {
        name: /Vilkårsvurdering/i,
      });

      expect(begrunnelseFelt).toHaveValue('Dette er min vurdering som er mellomlagret');
    });

    it('Skal bruke bekreftet vurdering fra grunnlag som defaultValue i skjema dersom mellomlagring ikke finnes', () => {
      customRender(
        <VurderRettighetsperiode
          readOnly={false}
          behandlingVersjon={0}
          grunnlag={RettighetsperiodeGrunnlagMedVurdering}
        />
      );

      const begrunnelseFelt = screen.getByRole('textbox', {
        name: /Vilkårsvurdering/i,
      });

      expect(begrunnelseFelt).toHaveValue('Dette er min vurdering som er bekreftet');
    });

    it('Skal resette skjema til tomt skjema dersom det ikke finnes en bekreftet vurdering og bruker sletter mellomlagring', async () => {
      customRender(
        <VurderRettighetsperiode
          readOnly={false}
          behandlingVersjon={0}
          grunnlag={RettighetsperiodeGrunnlagUtenVurdering}
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
      customRender(
        <VurderRettighetsperiode
          readOnly={false}
          behandlingVersjon={0}
          grunnlag={RettighetsperiodeGrunnlagMedVurdering}
          initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
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
      customRender(
        <VurderRettighetsperiode
          readOnly={true}
          behandlingVersjon={0}
          grunnlag={RettighetsperiodeGrunnlagMedVurdering}
          initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
        />
      );
      const lagreKnapp = screen.queryByRole('button', { name: 'Lagre utkast' });
      expect(lagreKnapp).not.toBeInTheDocument();
      const slettKnapp = screen.queryByRole('button', { name: 'Slett utkast' });
      expect(slettKnapp).not.toBeInTheDocument();
    });
  });
});
