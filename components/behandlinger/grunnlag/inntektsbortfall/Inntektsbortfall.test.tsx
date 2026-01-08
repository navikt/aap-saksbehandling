import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from 'lib/test/CustomRender';
import { defaultFlytResponse, setMockFlytResponse } from 'vitestSetup';
import { Inntektsbortfall } from './Inntektsbortfall';

beforeEach(() => {
  setMockFlytResponse({ ...defaultFlytResponse, aktivtSteg: 'MANGLENDE_LIGNING' });
});

describe('Inntektsbortfall', () => {
  beforeEach(() =>
    render(
      <Inntektsbortfall
        behandlingVersjon={1}
        readOnly={true}
        grunnlag={{
          harTilgangTilÅSaksbehandle: true,
          grunnlag: {
            kanBehandlesAutomatisk: true,
            gjennomsnittInntektSiste3ÅrOver3G: { resultat: true, gverdi: 4 },
            inntektSisteÅrOver1G: { resultat: true, gverdi: 3 },
            under62ÅrVedSøknadstidspunkt: { resultat: false, alder: 62 },
          },
          vurdering: undefined,
        }}
      />
    )
  );
  it('skal ha en alert', () => {
    const alert = screen.getByText(
      'Brukeren er over 62 år og må vurderes for § 11-4 andre ledd. Det er ikke støttet i Kelvin enda. Saken må settes på vent i påvente av at funksjonaliteten er ferdig utviklet.'
    );
    expect(alert).toBeVisible();
  });
});
