import { render, screen } from '@testing-library/react';
import { SettBehandllingPåVentModal } from 'components/settbehandlingpåventmodal/SettBehandllingPåVentModal';

beforeEach(() =>
  render(<SettBehandllingPåVentModal referanse={'123'} behandlingVersjon={1} isOpen={true} setIsOpen={jest.fn} />)
);

describe('settBehandlingPåVentModal', () => {
  it('skal ha en heading', () => {
    const heading = screen.getByText('Sett behandling på vent');
    expect(heading).toBeVisible();
  });
});
