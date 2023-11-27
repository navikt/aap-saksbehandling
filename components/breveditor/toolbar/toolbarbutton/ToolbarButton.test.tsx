import { ToolbarButton } from 'components/breveditor/toolbar/toolbarbutton/ToolbarButton';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('ToolbarButton', () => {
  const user = userEvent.setup();
  const onClickMock = jest.fn();
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('har en label', () => {
    render(
      <ToolbarButton onClick={onClickMock} className={'klassenavn'}>
        Knapp
      </ToolbarButton>
    );
    expect(screen.getByRole('button', { name: 'Knapp' })).toBeVisible();
  });

  test('kaller onClick på trykk', async () => {
    render(
      <ToolbarButton onClick={onClickMock} className={'klassenavn'}>
        Knapp
      </ToolbarButton>
    );
    await user.click(screen.getByRole('button', { name: 'Knapp' }));
    expect(onClickMock.mock.calls).toHaveLength(1);
  });

  test('har en visuell indikator på at et valg er aktivt', () => {
    render(
      <ToolbarButton onClick={onClickMock} className={'klassenavn active'}>
        Knapp
      </ToolbarButton>
    );
    expect(screen.getByRole('button', { name: 'Knapp' })).toHaveClass('active');
  });
});
