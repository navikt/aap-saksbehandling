import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FastsettBeregning } from 'components/behandlinger/grunnlag/fastsettberegning/FastsettBeregning';

describe('Fastsett beregning', () => {
  it('Skal ha heading', () => {
    render(<FastsettBeregning readOnly={false} behandlingVersjon={0} />);
    const heading = screen.getByText('Fastsett beregning');
    expect(heading).toBeVisible();
  });
});
