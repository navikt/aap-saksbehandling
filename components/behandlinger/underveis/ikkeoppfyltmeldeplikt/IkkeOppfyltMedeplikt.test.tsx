import { describe, expect, it } from 'vitest';
import { render, screen } from 'lib/test/CustomRender';

import { OverstyringMeldepliktGrunnlag } from 'lib/types/types';
import { IkkeOppfyltMeldeplikt } from 'components/behandlinger/underveis/ikkeoppfyltmeldeplikt/IkkeOppfyltMeldeplikt';

describe('IkkeOppfyltMeldeplikt', () => {
  const grunnlag: OverstyringMeldepliktGrunnlag = {
    harTilgangTilÅSaksbehandle: true,
    perioderIkkeMeldt: [{ fom: '2023-01-01', tom: '2023-01-15' }],
    overstyringsvurderinger: [],
    gjeldendeVedtatteOversyringsvurderinger: [
      {
        fraDato: '2023-01-15',
        tilDato: '2023-01-29',
        begrunnelse: 'Vurdering 2',
        vurdertIBehandling: '123',
        meldepliktOverstyringStatus: 'RIMELIG_GRUNN',
        vurderingsTidspunkt: '2024-08-10',
        vurdertAv: { ident: 'saksbehandler', dato: '2024-08-10' },
      },
    ],
  };

  it('viser overskrift for å identifisere steget', () => {
    render(<IkkeOppfyltMeldeplikt behandlingVersjon={1} readOnly={false} grunnlag={grunnlag} />);
    expect(
      screen.getByRole('heading', { name: '§ 11-10 andre ledd. Perioder uten overholdt meldeplikt' })
    ).toBeVisible();
  });

  it('skal ikke vises hvis det ikke finnes Perioder uten overholdt meldeplikt eller rimelig grunn', () => {
    const tomtGrunnlag: OverstyringMeldepliktGrunnlag = {
      harTilgangTilÅSaksbehandle: true,
      perioderIkkeMeldt: [],
      gjeldendeVedtatteOversyringsvurderinger: [],
      overstyringsvurderinger: [],
    };

    render(<IkkeOppfyltMeldeplikt behandlingVersjon={1} readOnly={false} grunnlag={tomtGrunnlag} />);
    expect(
      screen.queryByRole('heading', { name: '§ 11-10 andre ledd. Perioder uten overholdt meldeplikt' })
    ).not.toBeInTheDocument();
  });

  it('skal vise vurderingene gjort i denne behandlingen dersom de finnes', async () => {
    const vurderingerGrunnlag: OverstyringMeldepliktGrunnlag = {
      harTilgangTilÅSaksbehandle: true,
      perioderIkkeMeldt: [{ fom: '2023-01-01', tom: '2023-01-15' }],
      overstyringsvurderinger: [
        {
          fraDato: '2023-01-01',
          tilDato: '2023-01-15',
          begrunnelse: 'Vurdering 2',
          vurdertIBehandling: '123',
          meldepliktOverstyringStatus: 'RIMELIG_GRUNN',
          vurderingsTidspunkt: '2024-08-10',
          vurdertAv: { ident: 'saksbehandler', dato: '2024-08-10' },
        },
      ],
      gjeldendeVedtatteOversyringsvurderinger: [],
    };
    render(<IkkeOppfyltMeldeplikt behandlingVersjon={1} readOnly={false} grunnlag={vurderingerGrunnlag} />);
    expect(screen.getByText('Vurdering av periode 01.01.2023 - 15.01.2023')).toBeVisible();
  });
});
