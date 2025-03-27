import { describe, expect, it } from 'vitest';
import { DigitaliserMeldekort } from './DigitaliserMeldekort';
import { render, screen } from '@testing-library/react';

describe('DigitaliserPliktkort', () => {
  it('innsendtdato vises', () => {
    render(<DigitaliserMeldekort submit={() => {}} isLoading={false} readOnly={false} />);
    expect(screen.getByRole('textbox', { name: /Dato for innsendt meldekort/i })).toBeVisible();
  });
});
