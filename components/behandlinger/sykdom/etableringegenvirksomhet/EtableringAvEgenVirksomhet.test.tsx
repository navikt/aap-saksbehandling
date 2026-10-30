import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, within } from 'lib/test/CustomRender';
import { EtableringAvEgenVirksomhet } from 'components/behandlinger/sykdom/etableringegenvirksomhet/EtableringAvEgenVirksomhet';
import { EtableringEgenVirksomhetGrunnlagResponse, EtableringEgenVirksomhetVurderingResponse } from 'lib/types/types';
import { userEvent } from '@testing-library/user-event';
import { defaultFlytResponse, setMockFlytResponse } from 'vitestSetup';
import { getDefaultValuesFromGrunnlag } from './etablering-av-egen-virksomhet-utils';
import * as clientApi from 'lib/clientApi';
import type { useLøsAvklaringsbehov } from 'hooks/saksbehandling/løsavklaringsbehov/useLøsAvklaringsbehov';

const løsPeriodisertAvklaringsbehov =
  vi.fn<ReturnType<typeof useLøsAvklaringsbehov>['løsPeriodisertAvklaringsbehov']>();

vi.mock('hooks/saksbehandling/løsavklaringsbehov/useLøsAvklaringsbehov', () => ({
  useLøsAvklaringsbehov: () => ({
    løsAvklaringsbehovError: undefined,
    løsAvklaringsbehovStatus: undefined,
    løsAvklaringsbehovIsLoading: false,
    løsPeriodisertAvklaringsbehov: løsPeriodisertAvklaringsbehov,
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
  oppstartsPeriode: [],
  utviklingsPeriode: [],
  virksomhetNavn: 'Min virksomhet',
  vurderingerMeta: {},
};

describe('EtableringAvEgenVirksomhet', () => {
  beforeEach(() => {
    setMockFlytResponse({ ...defaultFlytResponse, aktivtSteg: 'ETABLERING_EGEN_VIRKSOMHET' });
    løsPeriodisertAvklaringsbehov.mockReset();
  });

  it('viser backendens avslag for vedtatte vurderinger selv om de gamle grunnvilkårene er oppfylt', () => {
    render(
      <EtableringAvEgenVirksomhet
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
      <EtableringAvEgenVirksomhet
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
      <EtableringAvEgenVirksomhet
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

    expect(løsPeriodisertAvklaringsbehov.mock.lastCall?.[0]).toMatchObject({
      behov: {
        løsningerForPerioder: [{ versjon: 'V0' }],
      },
    });
    expect(løsPeriodisertAvklaringsbehov.mock.lastCall?.[1]).toBeTypeOf('function');
  });

  it('viser backendens avslag etter at et eksisterende utkast avbrytes', async () => {
    setMockFlytResponse({ ...defaultFlytResponse, aktivtSteg: 'AVKLAR_OPPFØLGING' });
    const slettMellomlagring = vi.spyOn(clientApi, 'clientSlettMellomlagring').mockResolvedValue({
      type: 'SUCCESS',
      data: undefined,
    });
    const grunnlag = { ...tomtGrunnlag, nyeVurderinger: [avslagFraBackend] };

    render(
      <EtableringAvEgenVirksomhet
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

    expect(screen.getByText('Oppfylt')).toBeVisible();
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
      <EtableringAvEgenVirksomhet
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

    expect(løsPeriodisertAvklaringsbehov.mock.lastCall?.[0]).toMatchObject({
      behov: {
        løsningerForPerioder: (slettFørste ? ['V1'] : ['V0', 'V1']).map((versjon) => ({ versjon })),
      },
    });
    expect(løsPeriodisertAvklaringsbehov.mock.lastCall?.[1]).toBeTypeOf('function');
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
          oppfylt: false,
          oppstartsPeriode: [],
          utviklingsPeriode: [],
          virksomhetNavn: 'Min virksomhet',
          vurderingerMeta: {},
        },
      ],
    };

    render(<EtableringAvEgenVirksomhet grunnlag={grunnlagMedVurdering} readOnly={false} behandlingVersjon={0} />);

    await user.click(screen.getByRole('button', { name: 'Bekreft' }));

    expect(løsPeriodisertAvklaringsbehov).toHaveBeenCalledOnce();
  });
});
