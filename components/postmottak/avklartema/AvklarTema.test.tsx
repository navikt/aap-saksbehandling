import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { AvklarTema } from './AvklarTema';
import { AvklarTemaGrunnlag } from 'lib/types/postmottakTypes';
import { render } from 'lib/test/CustomRender';

describe('AvklarTema', () => {
  const grunnlag: AvklarTemaGrunnlag = {
    vurdering: { skalTilAap: true },
    dokumenter: [],
    journalpostMetadata: {
      brevkode: 'NAV 11-13.05',
      journalfoerendeEnhet: null,
    },
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
