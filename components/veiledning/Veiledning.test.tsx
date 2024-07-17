import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Veiledning } from 'components/veiledning/Veiledning';

describe('Vilkårsveildening', () => {
  it('skal ha en overskrift', () => {
    render(<Veiledning />);

    expect(screen.getByText('Slik vurderes vilkåret')).toBeVisible();
  });

  it('skal vise korrekt tekst for avklar student', () => {
    render(<Veiledning />);
    expect(screen.getByText('Her kommer det noe tekst som beskriver hvordan vilkåret skal vurderes')).toBeVisible();
  });
});
