import { describe, expect, it } from 'vitest';
import { render, screen } from 'lib/test/CustomRender';

import { RimeligGrunnMeldepliktGrunnlag } from 'lib/types/types';
import { IkkeOppfyltMeldeplikt } from 'components/behandlinger/underveis/ikkeoppfyltmeldeplikt/IkkeOppfyltMeldeplikt';

import { userEvent } from '@testing-library/user-event';

const user = userEvent.setup();

describe('IkkeOppfyltMeldeplikt', () => {
  const grunnlag: RimeligGrunnMeldepliktGrunnlag = {
    harTilgangTilÅSaksbehandle: true,
    historikk: [],
    perioderIkkeMeldt: [{ fom: '2023-01-01', tom: '2023-01-15' }],
    perioderRimeligGrunn: [{ fom: '2023-01-15', tom: '2023-01-28' }],
    gjeldendeVedtatteVurderinger: [],
    vurderinger: [
      {
        fraDato: '2023-01-15',
        begrunnelse: 'Vurdering 2',
        harRimeligGrunn: true,
        vurderingsTidspunkt: '2024-08-10',
        vurdertAv: { ident: 'saksbehandler', dato: '2024-08-10' },
      },
    ],
  };

  it('viser overskrift for å identifisere steget', () => {
    render(<IkkeOppfyltMeldeplikt behandlingVersjon={1} readOnly={false} grunnlag={grunnlag} />);
    expect(
      screen.getByRole('heading', { name: 'Perioder uten oppfylt meldeplikt (§ 11-10 andre ledd)' })
    ).toBeVisible();
  });

  it('skal ikke vises hvis det ikke finnes perioder uten oppfylt meldeplikt eller rimelig grunn', () => {
    const tomtGrunnlag: RimeligGrunnMeldepliktGrunnlag = {
      harTilgangTilÅSaksbehandle: true,
      historikk: [],
      perioderIkkeMeldt: [],
      perioderRimeligGrunn: [],
      gjeldendeVedtatteVurderinger: [],
      vurderinger: [],
    };

    render(<IkkeOppfyltMeldeplikt behandlingVersjon={1} readOnly={false} grunnlag={tomtGrunnlag} />);
    expect(
      screen.queryByRole('heading', { name: 'Perioder uten oppfylt meldeplikt (§ 11-10 andre ledd)' })
    ).not.toBeInTheDocument();
  });

  it('skal vise vurderingene gjort i denne behandlingen dersom de finnes', async () => {
    const vurderingerGrunnlag: RimeligGrunnMeldepliktGrunnlag = {
      harTilgangTilÅSaksbehandle: true,
      historikk: [],
      perioderIkkeMeldt: [{ fom: '2023-01-01', tom: '2023-01-15' }],
      perioderRimeligGrunn: [{ fom: '2023-01-15', tom: '2023-01-28' }],
      gjeldendeVedtatteVurderinger: [],
      vurderinger: [
        {
          fraDato: '2023-01-15',
          begrunnelse: 'Vurdering 2',
          harRimeligGrunn: true,
          vurderingsTidspunkt: '2024-08-10',
          vurdertAv: { ident: 'saksbehandler', dato: '2024-08-10' },
        },
      ],
    };
    render(<IkkeOppfyltMeldeplikt behandlingVersjon={1} readOnly={false} grunnlag={vurderingerGrunnlag} />);
    await user.click(screen.getByRole('button', { name: /Overstyr/ }));
    expect(screen.getByRole('row', { name: '01.01.2023 - 15.01.2023 Ikke oppfylt' })).toBeVisible();
    expect(
      screen.getByRole('row', { name: '15.01.2023 - 28.01.2023 Rimelig grunn Vurdering 2 saksbehandler 10.08.2024' })
    ).toBeVisible();
  });
});
