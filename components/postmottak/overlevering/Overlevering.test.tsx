import { describe, expect, it } from 'vitest';
import { OverleveringGrunnlag } from 'lib/types/postmottakTypes';
import { render, screen } from '@testing-library/react';
import { Overlevering } from './Overlevering';

describe('Overlevering', () => {
  const grunnlag: OverleveringGrunnlag = {
    vurdering: { skalOverleveres: true },
  };
  it('Skal ha en tittel', () => {
    render(<Overlevering behandlingsVersjon={1} behandlingsreferanse={'123'} grunnlag={grunnlag} readOnly={false} />);
    const heading = screen.getByText('Send dokument');
    expect(heading).toBeVisible();
  });
  it('Har et valg om dokumentet skal overleveres til fagsystem', () => {
    render(<Overlevering behandlingsVersjon={1} behandlingsreferanse={'123'} grunnlag={grunnlag} readOnly={false} />);
    expect(screen.getByText('Skal dokumentet sendes til fagsystem?')).toBeVisible();
  });
});
