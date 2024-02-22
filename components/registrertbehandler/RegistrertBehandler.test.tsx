import { render, screen } from '@testing-library/react';
import { RegistrertBehandler } from 'components/registrertbehandler/RegistrertBehandler';

test('Skal vise navnet på behandleren', () => {
  render(<RegistrertBehandler />);
  const navn = screen.getByText('Trond Ask');
  expect(navn).toBeVisible();
});

test('Skal vise navnet på legesenteret', () => {
  render(<RegistrertBehandler />);
  const navn = screen.getByText('Lillegrensen Legesenter');
  expect(navn).toBeVisible();
});

test('Skal vise adressen og telefonnummeret til legesenteret', () => {
  render(<RegistrertBehandler />);
  const navn = screen.getByText('0123 Legeby, 22 44 66 88');
  expect(navn).toBeVisible();
});
