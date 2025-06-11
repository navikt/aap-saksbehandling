import { describe, expect, it } from 'vitest';
import { render, screen } from 'lib/test/CustomRender';
import { PåklagetBehandling } from './PåklagetBehandling';
import { PåklagetBehandlingGrunnlag } from 'lib/types/types';

const grunnlag: PåklagetBehandlingGrunnlag = {
  kravMottatt: '2025-05-19',
  behandlinger: [
    {
      referanse: 'uuid-1',
      opprettetTidspunkt: '2024-01-01T00:00:00Z',
      typeBehandling: 'Førstegangsbehandling',
      status: 'AVSLUTTET',
      vedtakstidspunkt: '2024-02-02T00:00:00Z',
      virkningstidspunkt: null,
      årsaker: ['FRITAK_MELDEPLIKT'],
      saksnummer: '1234',
    },
    {
      saksnummer: '1223',
      årsaker: ['MOTTATT_SØKNAD'],
      referanse: 'uuid-2',
      opprettetTidspunkt: '2024-01-01T00:00:00Z',
      typeBehandling: 'Førstegangsbehandling',
      status: 'AVSLUTTET',
      vedtakstidspunkt: '2024-02-02T00:00:00Z',
      virkningstidspunkt: null,
    },
  ],
};

describe('Klage', () => {
  it('Skal ha en overskrift', () => {
    render(
      <PåklagetBehandling
        grunnlag={undefined}
        erAktivtSteg={true}
        readOnly={false}
        behandlingVersjon={0}
        typeBehandling={'Klage'}
      />
    );

    const heading = screen.getByText('Klage på vedtak');
    expect(heading).toBeVisible();
  });

  it('Skal ha 1 valg per behandling', () => {
    render(
      <PåklagetBehandling
        grunnlag={grunnlag}
        erAktivtSteg={true}
        readOnly={false}
        behandlingVersjon={0}
        typeBehandling={'Klage'}
      />
    );

    const radios = screen.getAllByRole('radio');
    const radioValues = radios.map((r) => r.getAttribute('value'));

    expect(radios).toHaveLength(2);
    expect(radioValues).toContain('uuid-1');
    expect(radioValues).toContain('uuid-2');
  });
});
