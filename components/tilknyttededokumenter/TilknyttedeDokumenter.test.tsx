import { render, screen } from '@testing-library/react';
import { TilknyttedeDokumenter } from 'components/tilknyttededokumenter/TilknyttedeDokumenter';

describe('Tilknyttede dokumenter', () => {
  it('skal ha en tittel', () => {
    render(<TilknyttedeDokumenter dokumenter={['Mitt dokument']} />);
    const tittel = screen.getByText('Tilknyttede dokumenter');
    expect(tittel).toBeVisible();
  });

  it('skal vise dokumenter som er valgt', () => {
    render(<TilknyttedeDokumenter dokumenter={['Mitt dokument']} />);
    const dokument = screen.getByText(/mitt dokument/i);
    expect(dokument).toBeVisible();
  });

  it('skal vise tekst om at ingen dokumenter er valgt dersom ingen dokumenter er valgt', () => {
    render(<TilknyttedeDokumenter />);
    const tekst = screen.getByText(/Ingen dokumenter er valgt/i);
    expect(tekst).toBeVisible();
  });
});
