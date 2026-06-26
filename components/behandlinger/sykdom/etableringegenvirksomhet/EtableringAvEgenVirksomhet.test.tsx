import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from 'lib/test/CustomRender';
import { EtableringAvEgenVirksomhet } from 'components/behandlinger/sykdom/etableringegenvirksomhet/EtableringAvEgenVirksomhet';
import { EtableringEgenVirksomhetGrunnlagResponse } from 'lib/types/types';
import { userEvent } from '@testing-library/user-event';
import { defaultFlytResponse, setMockFlytResponse } from 'vitestSetup';

const løsPeriodisertBehovOgGåTilNesteStegMock = vi.fn();

vi.mock('hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook', () => ({
  useLøsBehovOgGåTilNesteSteg: () => ({
    løsPeriodisertBehovOgGåTilNesteSteg: løsPeriodisertBehovOgGåTilNesteStegMock,
    isLoading: false,
    status: undefined,
    løsBehovOgGåTilNesteStegError: undefined,
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

describe('EtableringAvEgenVirksomhet', () => {
  beforeEach(() => {
    setMockFlytResponse({ ...defaultFlytResponse, aktivtSteg: 'ETABLERING_EGEN_VIRKSOMHET' });
    løsPeriodisertBehovOgGåTilNesteStegMock.mockReset();
  });

  it('skal ikke kalle backend ved submit uten vurderinger', async () => {
    render(
      <EtableringAvEgenVirksomhet grunnlag={tomtGrunnlag} readOnly={false} behandlingVersjon={0} />
    );

    await user.click(screen.getByRole('button', { name: 'Bekreft' }));

    expect(løsPeriodisertBehovOgGåTilNesteStegMock).not.toHaveBeenCalled();
  });

  it('skal kalle backend ved submit med vurderinger', async () => {
    const grunnlagMedVurdering: EtableringEgenVirksomhetGrunnlagResponse = {
      ...tomtGrunnlag,
      nyeVurderinger: [
        {
          fom: '2025-01-01',
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

    render(
      <EtableringAvEgenVirksomhet grunnlag={grunnlagMedVurdering} readOnly={false} behandlingVersjon={0} />
    );

    await user.click(screen.getByRole('button', { name: 'Bekreft' }));

    expect(løsPeriodisertBehovOgGåTilNesteStegMock).toHaveBeenCalledOnce();
  });
});
