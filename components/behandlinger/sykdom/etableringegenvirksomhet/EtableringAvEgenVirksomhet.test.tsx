import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, within } from 'lib/test/CustomRender';
import { EtableringAvEgenVirksomhetNy } from 'components/behandlinger/sykdom/etableringegenvirksomhet/EtableringAvEgenVirksomhetNy';
import { EtableringEgenVirksomhetGrunnlagResponse, EtableringEgenVirksomhetVurderingResponse } from 'lib/types/types';
import { userEvent } from '@testing-library/user-event';
import { defaultFlytResponse, setMockFlytResponse } from 'vitestSetup';
import { getDefaultValuesFromGrunnlag } from './etablering-av-egen-virksomhet-utils-ny';
import * as clientApi from 'lib/clientApi';

const løsAvklaringsbehov = vi.fn();

vi.mock('hooks/saksbehandling/løsavklaringsbehov/useLøsAvklaringsbehov', () => ({
  useLøsAvklaringsbehov: () => ({
    løsAvklaringsbehovError: undefined,
    løsAvklaringsbehovStatus: undefined,
    løsAvklaringsbehovIsLoading: false,
    løsAvklaringsbehov,
  }),
}));

const user = userEvent.setup();

const tomtGrunnlag: EtableringEgenVirksomhetGrunnlagResponse = {
  ikkeRelevantePerioder: [],
  nyeVurderinger: [],
  sisteVedtatteVurderinger: [],
  harTilgangTilÅSaksbehandle: true,
  behøverVurderinger: [],
  kanVurderes: [],
  vurderingerMeta: {},
};

const avslagFraBackend: EtableringEgenVirksomhetVurderingResponse = {
  versjon: 'V0',
  fom: '2025-01-01',
  begrunnelse: 'Vurdert som ikke oppfylt av backend',
  virksomhetErNy: true,
  foreliggerFagligVurdering: true,
  brukerEierVirksomheten: 'EIER_MINST_50_PROSENT',
  kanFøreTilSelvforsørget: true,
  oppfylt: false,
  fase: 'UTVIKLING',
  jobberBrukerAktivMedVirksomheten: false,
  virksomhetNavn: 'Min virksomhet',
  vurderingerMeta: {},
};

describe('EtableringAvEgenVirksomhet', () => {
  beforeEach(() => {
    setMockFlytResponse({ ...defaultFlytResponse, aktivtSteg: 'ETABLERING_EGEN_VIRKSOMHET' });
    løsAvklaringsbehov.mockReset();
  });

  it('viser backendens avslag for vedtatte vurderinger selv om de gamle grunnvilkårene er oppfylt', () => {
    render(
      <EtableringAvEgenVirksomhetNy
        grunnlag={{ ...tomtGrunnlag, sisteVedtatteVurderinger: [avslagFraBackend] }}
        readOnly={true}
        behandlingVersjon={0}
      />
    );

    expect(screen.getByText('Ikke oppfylt')).toBeVisible();
    expect(screen.queryByText('Oppfylt')).not.toBeInTheDocument();
  });

  it('viser backendens avslag for lagrede vurderinger i skrivebeskyttet visning', () => {
    render(
      <EtableringAvEgenVirksomhetNy
        grunnlag={{ ...tomtGrunnlag, nyeVurderinger: [avslagFraBackend] }}
        readOnly={true}
        behandlingVersjon={0}
      />
    );

    expect(screen.getByText('Ikke oppfylt')).toBeVisible();
    expect(screen.queryByText('Oppfylt')).not.toBeInTheDocument();
  });

  it('sender lagrede vurderinger med eksplisitt versjon', async () => {
    render(
      <EtableringAvEgenVirksomhetNy
        grunnlag={{
          ...tomtGrunnlag,
          nyeVurderinger: [
            {
              ...avslagFraBackend,
              foreliggerFagligVurdering: false,
            },
          ],
        }}
        readOnly={false}
        behandlingVersjon={0}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Bekreft' }));

    expect(løsAvklaringsbehov).toHaveBeenCalledWith(
      expect.objectContaining({
        behov: expect.objectContaining({
          løsningerForPerioder: [
            expect.objectContaining({
              versjon: 'V0',
            }),
          ],
        }),
      }),
      expect.any(Function)
    );
  });

  it('viser backendens avslag etter at et eksisterende utkast avbrytes', async () => {
    setMockFlytResponse({ ...defaultFlytResponse, aktivtSteg: 'AVKLAR_OPPFØLGING' });
    const slettMellomlagring = vi.spyOn(clientApi, 'clientSlettMellomlagring').mockResolvedValue({
      type: 'SUCCESS',
      data: undefined,
    });
    const grunnlag = { ...tomtGrunnlag, nyeVurderinger: [avslagFraBackend] };

    render(
      <EtableringAvEgenVirksomhetNy
        grunnlag={grunnlag}
        readOnly={false}
        behandlingVersjon={0}
        initialMellomlagretVurdering={{
          avklaringsbehovkode: '5058',
          behandlingId: { id: 1 },
          data: JSON.stringify(getDefaultValuesFromGrunnlag(grunnlag)),
          vurdertAv: 'Saksbehandler',
          vurdertDato: '2025-02-01T12:00:00',
        }}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Avbryt' }));

    expect(await screen.findByText('Ikke oppfylt')).toBeVisible();
    expect(screen.queryByText('Oppfylt')).not.toBeInTheDocument();
    expect(slettMellomlagring).toHaveBeenCalledOnce();
    slettMellomlagring.mockRestore();
  });

  it.each([false, true])('beholder versjon per vurdering når første vurdering slettes: %s', async (slettFørste) => {
    const defaults = getDefaultValuesFromGrunnlag({
      ...tomtGrunnlag,
      nyeVurderinger: [{ ...avslagFraBackend, foreliggerFagligVurdering: false }],
    });

    render(
      <EtableringAvEgenVirksomhetNy
        grunnlag={tomtGrunnlag}
        readOnly={false}
        behandlingVersjon={0}
        initialMellomlagretVurdering={{
          avklaringsbehovkode: '5058',
          behandlingId: { id: 1 },
          data: JSON.stringify({
            ...defaults,
            vurderinger: [
              { ...defaults.vurderinger[0], versjon: 'V0' },
              { ...defaults.vurderinger[0], fraDato: '01.02.2025', versjon: 'V1' },
            ],
          }),
          vurdertAv: 'Saksbehandler',
          vurdertDato: '2025-02-01T12:00:00',
        }}
      />
    );

    if (slettFørste) {
      await user.click(screen.getAllByRole('button', { name: 'Fjern vurdering' })[0]);
      await user.click(
        within(screen.getByRole('dialog', { name: 'Slett vurdering' })).getByRole('button', {
          name: /^Slett$/,
        })
      );
    }

    await user.click(screen.getByRole('button', { name: 'Bekreft' }));

    expect(løsAvklaringsbehov).toHaveBeenCalledWith(
      expect.objectContaining({
        behov: expect.objectContaining({
          løsningerForPerioder: (slettFørste ? ['V1'] : ['V0', 'V1']).map((versjon) =>
            expect.objectContaining({ versjon })
          ),
        }),
      }),
      expect.any(Function)
    );
  });

  it('skal kalle backend ved submit', async () => {
    const grunnlagMedVurdering: EtableringEgenVirksomhetGrunnlagResponse = {
      ...tomtGrunnlag,
      nyeVurderinger: [
        {
          fom: '2025-01-01',
          versjon: 'V0',
          begrunnelse: 'En begrunnelse',
          virksomhetErNy: false,
          foreliggerFagligVurdering: false,
          brukerEierVirksomheten: null,
          kanFøreTilSelvforsørget: null,
          fase: 'UTVIKLING',
          jobberBrukerAktivMedVirksomheten: true,
          oppfylt: false,
          virksomhetNavn: 'Min virksomhet',
          vurderingerMeta: {},
        },
      ],
    };

    render(<EtableringAvEgenVirksomhetNy grunnlag={grunnlagMedVurdering} readOnly={false} behandlingVersjon={0} />);

    await user.click(screen.getByRole('button', { name: 'Bekreft' }));

    expect(løsAvklaringsbehov).toHaveBeenCalledOnce();
  });
});
