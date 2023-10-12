import { render, screen } from '@testing-library/react';
import { GruppeElement } from './GruppeElement';

describe('Steg', () => {
  it('skal skal ha riktig navn', () => {
    render(<GruppeElement navn="SYKDOM" erFullført={false} aktivtSteg={false} nummer={1} kanNavigeresTil={true} />);
    expect(screen.getByText('Sykdom')).toBeVisible();
  });

  it('skal ha riktig url', () => {
    render(<GruppeElement navn="SYKDOM" erFullført={false} aktivtSteg={true} nummer={1} kanNavigeresTil={true} />);
    expect(screen.getByRole('link', { name: 'Sykdom' })).toHaveAttribute('href', '/sak/123/123/SYKDOM');
  });

  it('skal ikke være en link hvis gruppe steget ikke er fullført, ikke er aktivt eller ikke kan navigeres til', () => {
    render(<GruppeElement navn="SYKDOM" erFullført={false} aktivtSteg={false} nummer={1} kanNavigeresTil={false} />);
    const link = screen.queryByRole('link', { name: 'Sykdom' });
    expect(link).not.toBeInTheDocument();

    expect(screen.getByText('Sykdom')).toBeVisible();
  });

  it('skal ha checkmark for fullført steg', () => {
    render(<GruppeElement navn="SYKDOM" erFullført={true} aktivtSteg={false} nummer={1} kanNavigeresTil={true} />);
    expect(screen.getByRole('img')).toBeVisible();
    expect(screen.getByTitle('Fullført')).toBeInTheDocument();
  });

  it('Skal vise nummer dersom gruppesteget ikke er fullført', () => {
    render(<GruppeElement navn="SYKDOM" erFullført={false} aktivtSteg={false} nummer={1} kanNavigeresTil={true} />);
    const nummer = screen.getByText('1');
    expect(nummer).toBeVisible();
  });
});
