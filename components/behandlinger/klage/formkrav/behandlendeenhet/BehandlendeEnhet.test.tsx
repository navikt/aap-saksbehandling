import { describe, expect, it } from 'vitest';
import { render, screen } from '../../../../../lib/test/CustomRender';
import { BehandlendeEnhet } from './BehandlendeEnhet';

describe('Klage - behandlende enhet', () => {
  it('Skal ha en overskrift', () => {
    render(
      <BehandlendeEnhet
        grunnlag={undefined}
        erAktivtSteg={true}
        readOnly={false}
        behandlingVersjon={0}
        typeBehandling={'Klage'}
      />
    );

    const heading = screen.getByText('Klagebehandlende enhet');
    expect(heading).toBeVisible();
  });

  it('Skal vise radio med alternativer', () => {
    render(
      <BehandlendeEnhet
        grunnlag={undefined}
        erAktivtSteg={true}
        readOnly={false}
        behandlingVersjon={0}
        typeBehandling={'Klage'}
      />
    );

    expect(screen.getByRole('radio', { name: /NAY/ })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /Nav-kontor/ })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /Begge/ })).toBeInTheDocument();
  });
});
