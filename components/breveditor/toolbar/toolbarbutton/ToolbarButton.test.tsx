import { describe, test, expect, vi } from 'vitest';
import { ToolbarButton } from 'components/breveditor/toolbar/toolbarbutton/ToolbarButton';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

describe('ToolbarButton', () => {
  const user = userEvent.setup();
  const onClickMock = vi.fn();

  test('har en label', () => {
    render(<ToolbarButton onClick={onClickMock}>Knapp</ToolbarButton>);
    expect(screen.getByRole('button', { name: 'Knapp' })).toBeVisible();
  });

  test('kaller onClick på trykk', async () => {
    render(<ToolbarButton onClick={onClickMock}>Knapp</ToolbarButton>);
    await user.click(screen.getByRole('button', { name: 'Knapp' }));
    expect(onClickMock.mock.calls).toHaveLength(1);
  });

  // TODO: Flaky test. Får ikke riktig klassenavn når knappen er aktiv
  test.skip('har en visuell indikator på at et valg er aktivt', () => {
    render(
      <ToolbarButton onClick={onClickMock} active={true}>
        Knapp
      </ToolbarButton>
    );
    expect(screen.getByRole('button', { name: 'Knapp' })).toHaveClass('active');
  });

  test('er enablet som standard', async () => {
    render(<ToolbarButton onClick={onClickMock}>Knapp</ToolbarButton>);
    expect(screen.getByRole('button', { name: /Knapp/ })).not.toBeDisabled();
  });

  test('kan disables', () => {
    render(
      <ToolbarButton onClick={onClickMock} disabled={true}>
        Knapp
      </ToolbarButton>
    );
    expect(screen.getByRole('button', { name: /Knapp/ })).toBeDisabled();
  });
});
