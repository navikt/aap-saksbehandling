import { describe, expect, it } from 'vitest';
import { render, screen } from 'lib/test/CustomRender';
import { OppgittYrkesskadeUtenRegistertreffInfo } from 'components/behandlinger/sykdom/yrkesskade/OppgittYrkesskadeUtenRegistertreffInfo';
import { YrkesskadeVurderingGrunnlag } from 'lib/types/types';

const grunnlagMedOppgittYrkesskade: YrkesskadeVurderingGrunnlag = {
  harTilgangTilÅSaksbehandle: true,
  opplysninger: {
    innhentedeYrkesskader: [],
    oppgittYrkesskadeISøknad: true,
  },
};

const grunnlagUtenOppgittYrkesskade: YrkesskadeVurderingGrunnlag = {
  harTilgangTilÅSaksbehandle: true,
  opplysninger: {
    innhentedeYrkesskader: [],
    oppgittYrkesskadeISøknad: false,
  },
};

describe('OppgittYrkesskadeUtenRegistertreffInfo', () => {
  it('skal vise korrekt heading', () => {
    render(<OppgittYrkesskadeUtenRegistertreffInfo grunnlag={grunnlagMedOppgittYrkesskade} />);
    expect(screen.getByRole('heading', { name: '§ 11-22 AAP ved yrkesskade' })).toBeVisible();
  });

  it('skal vise "Ja" når oppgittYrkesskadeISøknad er true', () => {
    render(<OppgittYrkesskadeUtenRegistertreffInfo grunnlag={grunnlagMedOppgittYrkesskade} />);
    expect(
      screen.getByText(/Har du yrkesskade eller yrkessykdom som påvirker hvor mye du kan arbeide\? Ja/)
    ).toBeVisible();
  });

  it('skal vise "Nei" når oppgittYrkesskadeISøknad er false', () => {
    render(<OppgittYrkesskadeUtenRegistertreffInfo grunnlag={grunnlagUtenOppgittYrkesskade} />);
    expect(
      screen.getByText(/Har du yrkesskade eller yrkessykdom som påvirker hvor mye du kan arbeide\? Nei/)
    ).toBeVisible();
  });

  it('skal vise info-alert om ingen registrerte yrkesskader', () => {
    render(<OppgittYrkesskadeUtenRegistertreffInfo grunnlag={grunnlagMedOppgittYrkesskade} />);
    expect(
      screen.getByText(
        'Vi finner ingen godkjente yrkesskader eller yrkessykdommer i yrkesskaderegisteret. Beslutter vil legge inn en forklaring til brukeren i vedtaksbrevet.'
      )
    ).toBeVisible();
  });
});
