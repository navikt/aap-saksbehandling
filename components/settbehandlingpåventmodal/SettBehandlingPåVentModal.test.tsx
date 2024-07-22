import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SettBehandllingPåVentModal } from 'components/settbehandlingpåventmodal/SettBehandllingPåVentModal';

describe('settBehandlingPåVentModal', () => {
  beforeEach(() => {
    render(<SettBehandllingPåVentModal referanse={'123'} behandlingVersjon={1} isOpen={true} onClose={vi.fn} />);
  });
  it('skal ha en heading', () => {
    const heading = screen.getByText('Sett behandling på vent');
    expect(heading).toBeVisible();
  });

  it('skal ha et felt for begrunnelse', () => {
    const begrunnelseFelt = screen.getByRole('textbox', { name: /begrunnelse/i });
    expect(begrunnelseFelt).toBeVisible();
  });

  it('skal ha et felt for tidspunkt', () => {
    const tidspunktFelt = screen.getByRole('textbox', { name: /tidspunkt/i });
    expect(tidspunktFelt).toBeVisible();
  });

  it('skal ha et felt for årsak', () => {
    const årsakFelt = screen.getByRole('combobox', { name: /Velg en årsak/i });
    expect(årsakFelt).toBeVisible();
  });
});
