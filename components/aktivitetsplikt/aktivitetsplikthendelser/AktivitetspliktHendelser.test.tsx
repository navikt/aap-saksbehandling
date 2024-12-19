import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AktivitetspliktHendelser } from 'components/aktivitetsplikt/aktivitetsplikthendelser/AktivitetspliktHendelser';

describe('aktivitetsplikthendelser', () => {
  it('skal ha en overskrift', () => {
    render(<AktivitetspliktHendelser hendelser={[]} />);
    const overskrift = screen.getByText('Tidligere brudd på aktivitetsplikten');
    expect(overskrift).toBeVisible();
  });

  it('skal ha en tekst som forteller at det ikke finnes noen tidligere brudd dersom hendelser er tom', () => {
    render(<AktivitetspliktHendelser />);
    const tekst = screen.getByText('Ingen tidligere brudd registrert');
    expect(tekst).toBeVisible();
  });
});
