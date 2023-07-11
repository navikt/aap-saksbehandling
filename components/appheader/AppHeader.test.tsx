import { act, render, screen } from "@testing-library/react";
import {AppHeader} from "./AppHeader";


describe('Header', () => {
  test('tegner header', async () => {
    await act(() => {
      render(<AppHeader />);
    });
    expect(screen.getByText('Kelvin')).toBeVisible();
  });
});
