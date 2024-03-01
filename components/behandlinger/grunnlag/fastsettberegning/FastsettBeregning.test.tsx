import { render, screen } from '@testing-library/react';
import { FastsettBeregning } from 'components/behandlinger/grunnlag/fastsettberegning/FastsettBeregning';

describe('Fastsett beregning', () => {
  it('Skal ha heading', () => {
    render(<FastsettBeregning />);
    const heading = screen.getByText('Fastsett beregning');
    expect(heading).toBeVisible();
  });
});
