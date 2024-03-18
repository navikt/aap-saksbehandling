import { render, screen } from '@testing-library/react';
import { Vilkårsveildening } from 'components/vilkårsveiledning/Vilkårsveiledning';

describe('Vilkårsveildening', () => {
  it('skal ha en overskrift', () => {
    render(<Vilkårsveildening />);

    expect(screen.getByText('Slik vurderes vilkåret')).toBeVisible();
  });

  it('skal vise korrekt tekst for avklar student', () => {
    render(<Vilkårsveildening />);
    expect(screen.getByText('Her kommer det noe tekst som beskriver hvordan vilkåret skal vurderes')).toBeVisible();
  });
});
