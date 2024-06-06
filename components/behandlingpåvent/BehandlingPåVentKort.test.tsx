import { render, screen } from '@testing-library/react';
import { BehandlingPåVentKort } from 'components/behandlingpåvent/BehandlingPåVentKort';
import { VenteInformasjon } from 'lib/types/types';

const informasjon: VenteInformasjon = {
  grunn: 'ET_ELLER_ANNET',
  frist: new Date('2020-10-02').toDateString(),
  begrunnelse: 'Venter på legeerklæring',
};

describe('behandlingPåVentKort', () => {
  beforeEach(() => render(<BehandlingPåVentKort behandlingVersjon={1} informasjon={informasjon} />));

  it('skal vise begrunnelse', () => {
    const begrunnelseLabel = screen.getByText('Begrunnelse');
    expect(begrunnelseLabel).toBeVisible();

    const begrunnelseVerdi = screen.getByText('Venter på legeerklæring');
    expect(begrunnelseVerdi).toBeVisible();
  });

  it('skal vise grunn', () => {
    const årsakLabel = screen.getByText('Årsak');
    expect(årsakLabel).toBeVisible();
    const årsakValue = screen.getByText(/et_eller_annet/i);
    expect(årsakValue).toBeVisible();
  });

  it('skal vise fristen som er satt', () => {
    const fristLabel = screen.getByText('Frem til');
    expect(fristLabel).toBeVisible();
    const fristValue = screen.getByText('02.10.2020');
    expect(fristValue).toBeVisible();
  });
});
