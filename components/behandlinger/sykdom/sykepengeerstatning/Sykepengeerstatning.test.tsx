import { render, screen } from '@testing-library/react';
import { Sykepengeerstatning } from './Sykepengeerstatning';

describe('Sykepengeerstatning', () => {
  beforeEach(() => {
    render(<Sykepengeerstatning behandlingsReferanse={'123'} />);
  });
  test('har en overskrift', () => {
    expect(screen.getByRole('heading', { name: 'Sykepengeerstatning § 11-13' })).toBeVisible();
  });

  test('har et begrunnelsesfelt', () => {
    expect(screen.getByRole('textbox', { name: 'Vurder om søker har rett til sykepengeerstatning' })).toBeVisible();
  });
});
