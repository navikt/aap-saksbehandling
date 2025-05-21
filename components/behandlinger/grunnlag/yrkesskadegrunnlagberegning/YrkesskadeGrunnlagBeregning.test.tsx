import { describe, expect, it } from 'vitest';
import { render, screen } from 'lib/test/CustomRender';
import { userEvent } from '@testing-library/user-event';
import { YrkesskadeGrunnlagBeregning } from './YrkesskadeGrunnlagBeregning';

const user = userEvent.setup();

describe('YrkesskadeGrunnlagBeregning', () => {
  it('skal ha instruksjoner', () => {
    render(
      <YrkesskadeGrunnlagBeregning
        readOnly={false}
        behandlingVersjon={0}
        yrkeskadeBeregningGrunnlag={{
          harTilgangTilÅSaksbehandle: true,
          skalVurderes: [{ referanse: 'ABCDE', skadeDato: '1989-02-13', grunnbeløp: { verdi: 200000 } }],
          vurderinger: [],
        }}
      />
    );
    const heading = screen.getByText(
      'Beregn antatt årlig arbeidsinntekt ved skadetidspunktet etter § 11-22. Inntekten skal ikke G-justeres.'
    );
    expect(heading).toBeVisible();
  });

  it('validering på manglende begrunnelse', async () => {
    render(
      <YrkesskadeGrunnlagBeregning
        readOnly={false}
        behandlingVersjon={0}
        yrkeskadeBeregningGrunnlag={{
          harTilgangTilÅSaksbehandle: true,
          skalVurderes: [{ referanse: 'ABCDE', skadeDato: '1989-02-13', grunnbeløp: { verdi: 200000 } }],
          vurderinger: [],
        }}
      />
    );

    await velgBekreft();
    const feilmelding = screen.getByText('Du må oppgi en begrunnelse for anslått arbeidsinntekt.');
    expect(feilmelding).toBeVisible();

    const tekstFelt = screen.getByRole('textbox');
    await user.type(tekstFelt, 'en begrunnelse');

    await velgBekreft();

    const manglendeFeilmelding = screen.queryByText('Du må oppgi en begrunnelse for anslått arbeidsinntekt.');
    expect(manglendeFeilmelding).toBeNull();
  });
});

async function velgBekreft() {
  const bekreftKnapp = screen.getByRole('button', { name: 'Bekreft' });
  await user.click(bekreftKnapp);
}
