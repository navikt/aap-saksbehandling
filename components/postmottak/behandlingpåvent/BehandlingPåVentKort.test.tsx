import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BehandlingPåVentKort } from 'components/postmottak/behandlingpåvent/BehandlingPåVentKort';
import { Venteinformasjon } from 'lib/types/postmottakTypes';

const informasjon: Venteinformasjon = {
  grunn: 'VENTER_PÅ_MEDISINSKE_OPPLYSNINGER',
  frist: new Date('2020-10-02').toDateString(),
  begrunnelse: 'Venter på legeerklæring',
};

describe('behandlingPåVentKort', () => {
  beforeEach(() => {
    render(<BehandlingPåVentKort informasjon={informasjon} />);
  });

  it('skal vise begrunnelse', () => {
    const begrunnelseLabel = screen.getByText('Begrunnelse');
    expect(begrunnelseLabel).toBeVisible();

    const begrunnelseVerdi = screen.getByText('Venter på legeerklæring');
    expect(begrunnelseVerdi).toBeVisible();
  });

  it('skal vise grunn', () => {
    const årsakLabel = screen.getByText('Årsak');
    expect(årsakLabel).toBeVisible();
    const årsakValue = screen.getByText(/venter på medisinske opplysninger/i);
    expect(årsakValue).toBeVisible();
  });

  it('skal vise fristen som er satt', () => {
    const fristLabel = screen.getByText('Frem til');
    expect(fristLabel).toBeVisible();
    const fristValue = screen.getByText('02.10.2020');
    expect(fristValue).toBeVisible();
  });
});
