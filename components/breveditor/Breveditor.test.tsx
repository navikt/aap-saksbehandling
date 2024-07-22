import { describe, test, expect, vi } from 'vitest';
import { Breveditor } from 'components/breveditor/Breveditor';
import { render, screen } from '@testing-library/react';

describe('Breveditor', () => {
  const setContentMock = vi.fn();

  test('tegner breveditoren', async () => {
    render(<Breveditor brukEditor={true} setContent={setContentMock} />);
    const editor = await screen.findByTestId('breveditor');
    expect(editor).toBeInTheDocument();
  });
});
