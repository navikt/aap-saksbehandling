import { describe, expect, it } from 'vitest';
import { render, screen } from 'lib/test/CustomRender';
import { SvarFraAndreinstans } from 'components/behandlinger/svarfraandreinstans/SvarFraAndreinstans';

describe('Svar fra andreinstans', () => {
  it('Skal ha en overskrift', () => {
    render(<SvarFraAndreinstans readOnly={false} behandlingVersjon={0} />);

    const heading = screen.getByText('Vurder konsekvens av svar fra Nav Klageinstans');
    expect(heading).toBeVisible();
  });

  it('Skal vise type svar og begrunnelse for feilregistrering', () => {
    render(
      <SvarFraAndreinstans
        readOnly={false}
        behandlingVersjon={0}
        grunnlag={{
          svarFraAndreinstans: {
            type: 'BEHANDLING_FEILREGISTRERT',
            utfall: null,
            feilregistrertBegrunnelse: 'Dette er en begrunnelse for feilregistrering.',
          },
          harTilgangTilÅSaksbehandle: true,
        }}
      />
    );
    const type = screen.getByText('Behandling feilregistrert');
    const begrunnelse = screen.getByText('Dette er en begrunnelse for feilregistrering.');
    expect(type).toBeVisible();
    expect(begrunnelse).toBeVisible();
  });

  it('Skal vise type svar og utfall for klagebehandling', () => {
    render(
      <SvarFraAndreinstans
        readOnly={false}
        behandlingVersjon={0}
        grunnlag={{
          svarFraAndreinstans: {
            type: 'KLAGEBEHANDLING_AVSLUTTET',
            utfall: 'AVVIST',
          },
          harTilgangTilÅSaksbehandle: true,
        }}
      />
    );
    const type = screen.getByText('Klagebehandling avsluttet');
    const utfall = screen.getByText('Avvist');
    expect(type).toBeVisible();
    expect(utfall).toBeVisible();
  });
});
