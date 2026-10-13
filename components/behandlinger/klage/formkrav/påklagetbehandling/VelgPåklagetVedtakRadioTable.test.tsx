import { describe, expect, it, vi } from 'vitest';
import { render, screen } from 'lib/test/CustomRender';
import { VelgPåklagetVedtakRadioTable } from './VelgPåklagetVedtakRadioTable';

const baseOption = {
  saksnummer: '1234',
  value: 'uuid-tilbake',
  vedtaksdato: new Date('2024-01-02'),
  behandlingstype: 'Tilbakekreving',
  vurderingsbehov: [],
};

describe('VelgPåklagetVedtakRadioTable', () => {
  it('Skal vise klikkbar lenke for tilbakekreving med gyldig ekstern URL', () => {
    render(
      <VelgPåklagetVedtakRadioTable
        options={[{ ...baseOption, eksternSaksbehandlingUrl: 'http://ekstern-url' }]}
        value={undefined}
        onChange={vi.fn()}
        readOnly={false}
        ref={null}
      />
    );

    const link = screen.getByRole('link', { name: 'Tilbakekreving' });
    expect(link).toBeVisible();
    expect(link).toHaveAttribute('href', 'http://ekstern-url');
  });

  it('Skal vise deaktivert tekst for tilbakekreving uten ekstern URL', () => {
    render(
      <VelgPåklagetVedtakRadioTable
        options={[{ ...baseOption, eksternSaksbehandlingUrl: undefined }]}
        value={undefined}
        onChange={vi.fn()}
        readOnly={false}
        ref={null}
      />
    );

    expect(screen.queryByRole('link', { name: 'Tilbakekreving' })).not.toBeInTheDocument();
    expect(screen.getByText('Tilbakekreving')).toBeVisible();
  });
});
