import { render, screen } from 'lib/test/setUpTests';
import { GruppeElement } from './GruppeElement';

describe('Steg', () => {
  it('skal skal ha riktig navn', () => {
    render(<GruppeElement navn="SYKDOM" erFullført={false} aktivtSteg={false} />);
    expect(screen.getByText('Sykdom')).toBeVisible();
  });
  it('skal ha riktig url', () => {
    render(<GruppeElement navn="SYKDOM" erFullført={false} aktivtSteg={false} />);
    expect(screen.getByRole('link', { name: 'Sykdom' })).toHaveAttribute('href', '/sak/123/123/SYKDOM');
  });
  it('skal ha checkmark for fullført steg', () => {
    render(<GruppeElement navn="SYKDOM" erFullført={true} aktivtSteg={false} />);
    expect(screen.getByRole('img')).toBeVisible();
    expect(screen.getByTitle('Fullført')).toBeInTheDocument();
  });
});
