import { describe, expect, it } from 'vitest';
import { render, screen } from '../../../../../lib/test/CustomRender';
import { PåklagetBehandling } from './PåklagetBehandling';
import { PåklagetBehandlingGrunnlag } from '../../../../../lib/types/types';

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

    const heading = screen.getByText('Påklaget behandling');
    expect(heading).toBeVisible();
    expect(screen.getByText('Krav mottatt')).toBeVisible();
    expect(screen.getByText('Mangler krav mottatt dato')).toBeVisible();
  });

  it('Skal vise select med behandlinger', () => {
    render(
      <PåklagetBehandling
        grunnlag={grunnlag}
        erAktivtSteg={true}
        readOnly={false}
        behandlingVersjon={0}
        typeBehandling={'Klage'}
      />
    );

    const select = screen.getByRole('combobox');
    expect(select).toBeVisible();
    expect(screen.getByRole('option', { name: /Vedtakstidspunkt: 2024-02-02T00:00:00Z/ })).toBeInTheDocument();
    expect(screen.getByText('Krav mottatt')).toBeVisible();
    expect(screen.getByText('19.05.2025')).toBeVisible();
  });
});
