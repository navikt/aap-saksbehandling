import { render, screen } from '@testing-library/react';
import { BrevEditor } from 'components/breveditor/BrevEditor';
import userEvent from '@testing-library/user-event';

describe('Breveditor', () => {
  const user = userEvent.setup();

  it('skal ha en knapp for "bold"', () => {
    render(<BrevEditor />);
    const boldButton = screen.getByRole('button', { name: 'Bold' });
    expect(boldButton).toBeVisible();
  });

  it('skal ha en knapp for "italic"', () => {
    render(<BrevEditor />);
    const italicButton = screen.getByRole('button', { name: 'Italic' });
    expect(italicButton).toBeVisible();
  });

  it('skal ha en knapp for "underline"', () => {
    render(<BrevEditor />);
    const underlineButton = screen.getByRole('button', { name: 'Underline' });
    expect(underlineButton).toBeVisible();
  });

  it.skip('skal ha initialvalue derosm den er satt', () => {
    render(<BrevEditor />);
    const initialValueText = screen.getByText('Dette er en paragraf');
    expect(initialValueText).toBeVisible();
  });

  it('skal ha få bold tekst dersom "bold" er aktiv', async () => {
    render(<BrevEditor />);
    const textbox = screen.getByRole('textbox');
    const boldButton = screen.getByRole('button', { name: 'Bold' });

    await user.click(boldButton);

    await user.type(textbox, 'Denne teksten er i bold');

    screen.logTestingPlaygroundURL();

    // const paragraf = blockElement.closest('p');
  });
});
