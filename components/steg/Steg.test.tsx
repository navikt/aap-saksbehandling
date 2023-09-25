import { render, screen } from '@testing-library/react';
import { Steg } from './Steg';

jest.mock('next/navigation', () => ({
  useParams: jest
    .fn()
    .mockReturnValue({ saksId: '123', behandlingsReferanse: '123', behandlingsType: 'AVKLAR_SYKDOM' }),
}));

describe('Steg', () => {
  it('skal skal ha riktig navn', () => {
    render(<Steg navn="AVKLAR_SYKDOM" erFullført={false} aktivtSteg={false} />);
    expect(screen.getByText('Sykdomsvurdering')).toBeVisible();
  });
  it('skal ha riktig url', () => {
    render(<Steg navn="AVKLAR_SYKDOM" erFullført={false} aktivtSteg={false} />);
    expect(screen.getByRole('link', { name: 'Sykdomsvurdering' })).toHaveAttribute(
      'href',
      '/sak/123/123/AVKLAR_SYKDOM'
    );
  });
  it('skal ha checkmark for fullført steg', () => {
    render(<Steg navn="AVKLAR_SYKDOM" erFullført={true} aktivtSteg={false} />);
    expect(screen.getByRole('img')).toBeVisible();
    expect(screen.getByTitle('Fullført')).toBeInTheDocument();
  });
});
