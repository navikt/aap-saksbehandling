import { userEvent } from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, within } from 'lib/test/CustomRender';
import { LovvalgMedlemskapGrunnlag, MellomlagretVurderingResponse } from 'lib/types/types';
import { FetchResponse } from 'lib/utils/api';
import createFetchMock from 'vitest-fetch-mock';
import { LovvalgOgMedlemskapVedSøknadstidspunkt } from './LovvalgOgMedlemskapVedSøknadstidspunkt';
import { Behovstype } from 'lib/utils/form';
import { defaultFlytResponse, setMockFlytResponse } from 'vitestSetup';

const fetchMock = createFetchMock(vi);
fetchMock.enableMocks();
const user = userEvent.setup();

const grunnlagUtenVurdering: LovvalgMedlemskapGrunnlag = {
  harTilgangTilÅSaksbehandle: true,
  historiskeManuelleVurderinger: [],
};

const grunnlagMedVurdering: LovvalgMedlemskapGrunnlag = {
  vurdering: {
    lovvalgVedSøknadsTidspunkt: {
      begrunnelse: 'Dette er min vurdering som er bekreftet',
      lovvalgsEØSLandEllerLandMedAvtale: 'NOR',
    },
    overstyrt: false,
    vurdertAv: { ident: 'TESTER', dato: '2025-08-19' },
  },
  harTilgangTilÅSaksbehandle: true,
  historiskeManuelleVurderinger: [],
};

beforeEach(() => {
  setMockFlytResponse({ ...defaultFlytResponse, aktivtSteg: 'VURDER_LOVVALG' });
});

describe('Lovvalg og medlemskap ved søknadstidspunkt', () => {
  describe('generelt', () => {
    it('Skal ha en overskrift', () => {
      render(
        <LovvalgOgMedlemskapVedSøknadstidspunkt
          readOnly={false}
          behandlingVersjon={0}
          grunnlag={grunnlagUtenVurdering}
          overstyring={false}
          behovstype={Behovstype.AVKLAR_LOVVALG_MEDLEMSKAP}
        />
      );
      const heading = screen.getByText('Lovvalg og medlemskap ved søknadstidspunkt');
      expect(heading).toBeVisible();
    });

    it('Sender inn riktig behovstype gitt behandlingstype og overstyring i en revurdering', () => {
      render(
        <LovvalgOgMedlemskapVedSøknadstidspunkt
          readOnly={false}
          behandlingVersjon={0}
          grunnlag={grunnlagUtenVurdering}
          overstyring={true}
          behovstype={Behovstype.AVKLAR_LOVVALG_MEDLEMSKAP}
        />
      );
      const heading = screen.getByText('Overstyring av lovvalg og medlemskap ved søknadstidspunkt');
      expect(heading).toBeVisible();
    });

    it('Skal ha riktig overskrift ved overstyring', () => {
      render(
        <LovvalgOgMedlemskapVedSøknadstidspunkt
          readOnly={false}
          behandlingVersjon={0}
          grunnlag={grunnlagUtenVurdering}
          overstyring={true}
          behovstype={Behovstype.MANUELL_OVERSTYRING_LOVVALG}
        />
      );
      const heading = screen.getByText('Overstyring av lovvalg og medlemskap ved søknadstidspunkt');
      expect(heading).toBeVisible();
    });

    it('skal resette state i felt dersom Avbryt-knappen blir trykket', async () => {
      setMockFlytResponse({ ...defaultFlytResponse, aktivtSteg: 'AVKLAR_SYKDOM' });

      render(
        <LovvalgOgMedlemskapVedSøknadstidspunkt
          grunnlag={grunnlagMedVurdering}
          readOnly={false}
          behandlingVersjon={0}
          overstyring={true}
          behovstype={Behovstype.MANUELL_OVERSTYRING_LOVVALG}
        />
      );

      const endreKnapp = screen.getByRole('button', { name: 'Endre' });
      await user.click(endreKnapp);

      const begrunnelseFelt = screen.getByRole('textbox', { name: 'Vurder riktig lovvalg ved søknadstidspunkt' });
      await user.clear(begrunnelseFelt);
      await user.type(begrunnelseFelt, 'Dette er en ny begrunnelse');
      expect(begrunnelseFelt).toHaveValue('Dette er en ny begrunnelse');

      const avbrytKnapp = screen.getByRole('button', { name: 'Avbryt' });
      await user.click(avbrytKnapp);

      const begrunnelseFeltEtterAvbryt = screen.getByRole('textbox', {
        name: 'Vurder riktig lovvalg ved søknadstidspunkt',
      });
      expect(begrunnelseFeltEtterAvbryt).toHaveValue('Dette er min vurdering som er bekreftet');
    });
  });

  describe('felter', () => {
    it('Skal ha felt for begrunnelse', () => {
      render(
        <LovvalgOgMedlemskapVedSøknadstidspunkt
          readOnly={false}
          behandlingVersjon={0}
          grunnlag={grunnlagUtenVurdering}
          overstyring={false}
          behovstype={Behovstype.AVKLAR_LOVVALG_MEDLEMSKAP}
        />
      );
      const begrunnelse = screen.getByRole('textbox', { name: 'Vurder riktig lovvalg ved søknadstidspunkt' });
      expect(begrunnelse).toBeVisible();
    });

    it('Skal ha felt for lovvalg', () => {
      render(
        <LovvalgOgMedlemskapVedSøknadstidspunkt
          readOnly={false}
          behandlingVersjon={0}
          grunnlag={grunnlagUtenVurdering}
          overstyring={false}
          behovstype={Behovstype.AVKLAR_LOVVALG_MEDLEMSKAP}
        />
      );

      const felt = screen.getByRole('group', {
        name: 'Hva er riktig lovvalgsland ved søknadstidspunkt?',
      });
      expect(felt).toBeVisible();
    });

    it('skjuler felt for lovvalgsland hvis lovvalg ikke er Annet land med avtale', async () => {
      render(
        <LovvalgOgMedlemskapVedSøknadstidspunkt
          readOnly={false}
          behandlingVersjon={0}
          grunnlag={grunnlagUtenVurdering}
          overstyring={false}
          behovstype={Behovstype.AVKLAR_LOVVALG_MEDLEMSKAP}
        />
      );
      const lovvalg = screen.getByRole('group', {
        name: 'Hva er riktig lovvalgsland ved søknadstidspunkt?',
      });
      expect(lovvalg).toBeVisible();
      await user.click(within(lovvalg).getByRole('radio', { name: 'Norge' }));
      const lovvalgsland = screen.queryByRole('group', {
        name: 'Velg land som vi vurderer som lovvalgsland',
      });
      expect(lovvalgsland).not.toBeInTheDocument();
    });

    it('viser felt for lovvalgsland hvis lovvalg er Annet land med avtale', async () => {
      render(
        <LovvalgOgMedlemskapVedSøknadstidspunkt
          readOnly={false}
          behandlingVersjon={0}
          grunnlag={grunnlagUtenVurdering}
          overstyring={false}
          behovstype={Behovstype.AVKLAR_LOVVALG_MEDLEMSKAP}
        />
      );
      const lovvalg = screen.getByRole('group', {
        name: 'Hva er riktig lovvalgsland ved søknadstidspunkt?',
      });
      expect(lovvalg).toBeVisible();
      await user.click(within(lovvalg).getByRole('radio', { name: 'Annet land med avtale' }));

      const lovvalgsland = screen.queryByRole('group', {
        name: 'Velg land som vi vurderer som lovvalgsland',
      });
      expect(lovvalgsland).not.toBeInTheDocument();
    });

    it('Skal vise feilmelding dersom feltet for begrunnelse ikke er besvart', async () => {
      render(
        <LovvalgOgMedlemskapVedSøknadstidspunkt
          readOnly={false}
          behandlingVersjon={0}
          grunnlag={grunnlagUtenVurdering}
          overstyring={false}
          behovstype={Behovstype.AVKLAR_LOVVALG_MEDLEMSKAP}
        />
      );
      await trykkPåBekreft();
      const feilmelding = screen.getByText('Du må gi en begrunnelse på lovvalg ved søknadstidspunkt');
      expect(feilmelding).toBeVisible();
    });

    it('Skal vise feilmelding dersom feltet om lovvalg ikke er besvart', async () => {
      render(
        <LovvalgOgMedlemskapVedSøknadstidspunkt
          readOnly={false}
          behandlingVersjon={0}
          grunnlag={grunnlagUtenVurdering}
          overstyring={false}
          behovstype={Behovstype.AVKLAR_LOVVALG_MEDLEMSKAP}
        />
      );
      await trykkPåBekreft();
      const feilmelding = screen.getByText('Du må velge riktig lovvalg ved søknadstidspunkt');
      expect(feilmelding).toBeVisible();
    });

    it('viser felt medlemskapbegrunnelse og vurdering hvis Norge er valgt', async () => {
      render(
        <LovvalgOgMedlemskapVedSøknadstidspunkt
          readOnly={false}
          behandlingVersjon={0}
          grunnlag={grunnlagUtenVurdering}
          overstyring={false}
          behovstype={Behovstype.AVKLAR_LOVVALG_MEDLEMSKAP}
        />
      );
      const lovvalg = screen.getByRole('group', {
        name: 'Hva er riktig lovvalgsland ved søknadstidspunkt?',
      });
      expect(lovvalg).toBeVisible();
      await user.click(within(lovvalg).getByRole('radio', { name: 'Norge' }));

      const begrunnelse = screen.getByRole('textbox', { name: 'Vurder brukerens medlemskap på søknadstidspunktet' });
      const medlemskap = screen.getByRole('group', {
        name: 'Var brukeren medlem av folketrygden ved søknadstidspunktet?',
      });
      expect(begrunnelse).toBeVisible();
      expect(medlemskap).toBeVisible();
    });

    it('skjuler felt for medlemskapsbegrunnelse hvis lovvalgsland er Annet land med avtale', async () => {
      render(
        <LovvalgOgMedlemskapVedSøknadstidspunkt
          readOnly={false}
          behandlingVersjon={0}
          grunnlag={grunnlagUtenVurdering}
          overstyring={false}
          behovstype={Behovstype.AVKLAR_LOVVALG_MEDLEMSKAP}
        />
      );
      const lovvalg = screen.getByRole('group', {
        name: 'Hva er riktig lovvalgsland ved søknadstidspunkt?',
      });
      expect(lovvalg).toBeVisible();
      await user.click(within(lovvalg).getByRole('radio', { name: 'Annet land med avtale' }));
      const begrunnelse = screen.queryByRole('textbox', { name: 'Vurder brukerens medlemskap på søknadstidspunktet' });
      const medlemskap = screen.queryByRole('group', {
        name: 'Var brukeren medlem av folketrygden ved søknadstidspunktet?',
      });
      expect(begrunnelse).not.toBeInTheDocument();
      expect(medlemskap).not.toBeInTheDocument();
    });

    it('Skal vise feilmelding dersom feltet for begrunnelse ikke er besvart', async () => {
      render(
        <LovvalgOgMedlemskapVedSøknadstidspunkt
          readOnly={false}
          behandlingVersjon={0}
          grunnlag={grunnlagUtenVurdering}
          overstyring={false}
          behovstype={Behovstype.AVKLAR_LOVVALG_MEDLEMSKAP}
        />
      );
      const lovvalg = screen.getByRole('group', {
        name: 'Hva er riktig lovvalgsland ved søknadstidspunkt?',
      });
      await user.click(within(lovvalg).getByRole('radio', { name: 'Norge' }));
      await trykkPåBekreft();
      const feilmelding = screen.getByText('Du må begrunne medlemskap på søknadstidspunktet');
      expect(feilmelding).toBeVisible();
    });

    it('Skal vise feilmelding dersom feltet om medlemskap ikke er besvart', async () => {
      render(
        <LovvalgOgMedlemskapVedSøknadstidspunkt
          readOnly={false}
          behandlingVersjon={0}
          grunnlag={grunnlagUtenVurdering}
          overstyring={false}
          behovstype={Behovstype.AVKLAR_LOVVALG_MEDLEMSKAP}
        />
      );
      const lovvalg = screen.getByRole('group', {
        name: 'Hva er riktig lovvalgsland ved søknadstidspunkt?',
      });
      await user.click(within(lovvalg).getByRole('radio', { name: 'Norge' }));
      await trykkPåBekreft();
      const feilmelding = screen.getByText('Du må velge om brukeren var medlem av folketrygden på søknadstidspunkt');
      expect(feilmelding).toBeVisible();
    });
  });

  describe('mellomlagring i lovvalg og medlemskap ved søknadstidspunkt', () => {
    const mellomlagring: MellomlagretVurderingResponse = {
      mellomlagretVurdering: {
        avklaringsbehovkode: '5006',
        behandlingId: { id: 1 },
        data: '{"lovvalgBegrunnelse":"Dette er min vurdering som er mellomlagret"}',
        vurdertDato: '2025-08-21T12:00:00.000',
        vurdertAv: 'Jan T. Loven',
      },
    };

    const grunnlagMedVurdering: LovvalgMedlemskapGrunnlag = {
      vurdering: {
        lovvalgVedSøknadsTidspunkt: {
          begrunnelse: 'Dette er min vurdering som er bekreftet',
          lovvalgsEØSLandEllerLandMedAvtale: 'NOR',
        },
        overstyrt: false,
        vurdertAv: { ident: 'TESTER', dato: '2025-08-19' },
      },
      harTilgangTilÅSaksbehandle: true,
      historiskeManuelleVurderinger: [],
    };

    it('Skal vise en tekst om hvem som har gjort vurderingen dersom det finnes en mellomlagring', () => {
      render(
        <LovvalgOgMedlemskapVedSøknadstidspunkt
          readOnly={false}
          behandlingVersjon={0}
          grunnlag={grunnlagUtenVurdering}
          overstyring={false}
          initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
          behovstype={Behovstype.AVKLAR_LOVVALG_MEDLEMSKAP}
        />
      );
      const tekst = screen.getByText('Utkast lagret 21.08.2025 12:00 (Jan T. Loven)');
      expect(tekst).toBeVisible();
    });

    it('Skal vise en tekst om hvem som har lagret vurdering dersom bruker trykker på lagre mellomlagring', async () => {
      render(
        <LovvalgOgMedlemskapVedSøknadstidspunkt
          readOnly={false}
          behandlingVersjon={0}
          grunnlag={grunnlagUtenVurdering}
          overstyring={false}
          behovstype={Behovstype.AVKLAR_LOVVALG_MEDLEMSKAP}
        />
      );

      await user.type(
        screen.getByRole('textbox', { name: 'Vurder riktig lovvalg ved søknadstidspunkt' }),
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
        <LovvalgOgMedlemskapVedSøknadstidspunkt
          readOnly={false}
          behandlingVersjon={0}
          grunnlag={grunnlagUtenVurdering}
          overstyring={false}
          initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
          behovstype={Behovstype.AVKLAR_LOVVALG_MEDLEMSKAP}
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
        <LovvalgOgMedlemskapVedSøknadstidspunkt
          readOnly={false}
          behandlingVersjon={0}
          grunnlag={grunnlagMedVurdering}
          overstyring={false}
          initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
          behovstype={Behovstype.AVKLAR_LOVVALG_MEDLEMSKAP}
        />
      );
      const begrunnelseFelt = screen.getByRole('textbox', {
        name: 'Vurder riktig lovvalg ved søknadstidspunkt',
      });

      expect(begrunnelseFelt).toHaveValue('Dette er min vurdering som er mellomlagret');
    });

    it('Skal bruke bekreftet vurdering fra grunnlag som defaultValue i skjema dersom mellomlagring ikke finnes', () => {
      render(
        <LovvalgOgMedlemskapVedSøknadstidspunkt
          readOnly={false}
          behandlingVersjon={0}
          grunnlag={grunnlagMedVurdering}
          overstyring={false}
          behovstype={Behovstype.AVKLAR_LOVVALG_MEDLEMSKAP}
        />
      );

      const begrunnelseFelt = screen.getByRole('textbox', {
        name: 'Vurder riktig lovvalg ved søknadstidspunkt',
      });

      expect(begrunnelseFelt).toHaveValue('Dette er min vurdering som er bekreftet');
    });

    it('Skal resette skjema til tomt skjema dersom det ikke finnes en bekreftet vurdering og bruker sletter mellomlagring', async () => {
      render(
        <LovvalgOgMedlemskapVedSøknadstidspunkt
          readOnly={false}
          behandlingVersjon={0}
          grunnlag={grunnlagUtenVurdering}
          overstyring={false}
          initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
          behovstype={Behovstype.AVKLAR_LOVVALG_MEDLEMSKAP}
        />
      );

      await user.type(
        screen.getByRole('textbox', { name: 'Vurder riktig lovvalg ved søknadstidspunkt' }),
        ' her er ekstra tekst'
      );

      expect(screen.getByRole('textbox', { name: 'Vurder riktig lovvalg ved søknadstidspunkt' })).toHaveValue(
        'Dette er min vurdering som er mellomlagret her er ekstra tekst'
      );

      const slettKnapp = screen.getByRole('button', { name: 'Slett utkast' });

      await user.click(slettKnapp);

      expect(screen.getByRole('textbox', { name: 'Vurder riktig lovvalg ved søknadstidspunkt' })).toHaveValue('');
    });

    it('Skal resette skjema til bekreftet vurdering dersom det finnes en bekreftet vurdering og bruker sletter mellomlagring', async () => {
      render(
        <LovvalgOgMedlemskapVedSøknadstidspunkt
          readOnly={false}
          behandlingVersjon={0}
          grunnlag={grunnlagMedVurdering}
          overstyring={false}
          initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
          behovstype={Behovstype.AVKLAR_LOVVALG_MEDLEMSKAP}
        />
      );
      await user.type(
        screen.getByRole('textbox', { name: 'Vurder riktig lovvalg ved søknadstidspunkt' }),
        ' her er ekstra tekst'
      );

      expect(screen.getByRole('textbox', { name: 'Vurder riktig lovvalg ved søknadstidspunkt' })).toHaveValue(
        'Dette er min vurdering som er mellomlagret her er ekstra tekst'
      );

      const slettKnapp = screen.getByRole('button', { name: 'Slett utkast' });

      await user.click(slettKnapp);

      expect(screen.getByRole('textbox', { name: 'Vurder riktig lovvalg ved søknadstidspunkt' })).toHaveValue(
        'Dette er min vurdering som er bekreftet'
      );
    });

    it('Skal ikke være mulig å lagre eller slette mellomlagring hvis det er readOnly', () => {
      render(
        <LovvalgOgMedlemskapVedSøknadstidspunkt
          readOnly={true}
          behandlingVersjon={0}
          grunnlag={grunnlagMedVurdering}
          overstyring={false}
          initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
          behovstype={Behovstype.AVKLAR_LOVVALG_MEDLEMSKAP}
        />
      );

      const lagreKnapp = screen.queryByRole('button', { name: 'Lagre utkast' });
      expect(lagreKnapp).not.toBeInTheDocument();
      const slettKnapp = screen.queryByRole('button', { name: 'Slett utkast' });
      expect(slettKnapp).not.toBeInTheDocument();
    });
  });
});

const trykkPåBekreft = async () => await user.click(screen.getByRole('button', { name: 'Bekreft' }));
