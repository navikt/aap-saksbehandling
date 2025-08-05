import { describe, expect, it } from 'vitest';
import { render, screen } from 'lib/test/CustomRender';

import { RimeligGrunnMeldepliktGrunnlag } from 'lib/types/types';
import { IkkeOppfyltMeldeplikt } from 'components/behandlinger/underveis/ikkeoppfyltmeldeplikt/IkkeOppfyltMeldeplikt';

const grunnlag: RimeligGrunnMeldepliktGrunnlag = {
  harTilgangTilÅSaksbehandle: true,
  historikk: [],
  perioderIkkeMeldt: [{ fom: '2023-01-01', tom: '2023-01-31' }],
  gjeldendeVedtatteVurderinger: [],
  vurderinger: [],
};

describe('IkkeOppfyltMeldeplikt', () => {
  it('viser overskrift for å identifisere steget', () => {
    render(<IkkeOppfyltMeldeplikt grunnlag={grunnlag} />);
    expect(
      screen.getByRole('heading', { name: 'Perioder uten oppfylt meldeplikt (§ 11-10 andre ledd)' })
    ).toBeVisible();
  });

  it('skal ikke vises hvis det ikke finnes perioder uten oppfylt meldeplikt', () => {
    const tomtGrunnlag: RimeligGrunnMeldepliktGrunnlag = {
      ...grunnlag,
      perioderIkkeMeldt: [],
    };
    render(<IkkeOppfyltMeldeplikt grunnlag={tomtGrunnlag} />);
    expect(
      screen.queryByRole('heading', { name: 'Perioder uten oppfylt meldeplikt (§ 11-10 andre ledd)' })
    ).not.toBeInTheDocument();
  });
});
