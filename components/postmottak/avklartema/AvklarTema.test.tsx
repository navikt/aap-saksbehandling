import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AvklarTema } from './AvklarTema';
import { AvklarTemaGrunnlag } from 'lib/types/postmottakTypes';

describe('AvklarTema', () => {
  const grunnlag: AvklarTemaGrunnlag = {
    vurdering: { skalTilAap: true },
    dokumenter: [],
  };
  it('Skal ha en tittel', () => {
    render(<AvklarTema behandlingsVersjon={1} behandlingsreferanse={'123'} grunnlag={grunnlag} readOnly={false} />);
    const heading = screen.getByText('Avklar tema');
    expect(heading).toBeVisible();
  });
  it('Har et valg for om dokumentet hører til tema AAP eller ikke', () => {
    render(<AvklarTema behandlingsVersjon={1} behandlingsreferanse={'123'} grunnlag={grunnlag} readOnly={false} />);
    expect(screen.getByText('Hører dette dokumentet til tema AAP?')).toBeVisible();
  });
});
