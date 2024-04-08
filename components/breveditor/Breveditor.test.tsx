import { Breveditor } from 'components/breveditor/Breveditor';
import { render, screen } from '@testing-library/react';

describe('Breveditor', () => {
  const setContentMock = jest.fn();

  test('tegner breveditoren', async () => {
    render(<Breveditor brukEditor={true} setContent={setContentMock} />);
    const editor = await screen.findByTestId('breveditor');
    expect(editor).toBeInTheDocument();
  });
});
