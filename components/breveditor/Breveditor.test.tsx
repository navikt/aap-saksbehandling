import { Breveditor } from 'components/breveditor/Breveditor';
import { render, screen } from '@testing-library/react';

describe('Breveditor', () => {
  const setContentMock = jest.fn();

  test('tegner breveditoren', () => {
    render(<Breveditor brukEditor={true} setContent={setContentMock} />);
    expect(screen.getByTestId('breveditor')).toBeInTheDocument();
  });

  test('har en menylinje', () => {
    render(<Breveditor brukEditor={true} setContent={setContentMock} />);
    expect(screen.getByRole('toolbar')).toBeVisible();
  });
});
