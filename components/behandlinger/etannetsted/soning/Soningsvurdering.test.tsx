import { Soningsvurdering } from 'components/behandlinger/etannetsted/soning/Soningsvurdering';
import { render, screen } from '@testing-library/react';

describe('Helseinstitusjon', () => {
  test('har overskrift Soningsvurdering § 11-26', () => {
    render(<Soningsvurdering />);
    expect(screen.getByRole('heading', { name: 'Soning § 11-26', level: 3 })).toBeVisible();
  });

  test('viser melding om at søker har soningsforhold', () => {
    render(<Soningsvurdering />);
    expect(screen.getByText('Vi har fått informasjon om at søker har soningsforhold')).toBeVisible();
  });
});
