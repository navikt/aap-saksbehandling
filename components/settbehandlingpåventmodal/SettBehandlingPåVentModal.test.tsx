import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SettBehandllingPåVentModal } from 'components/settbehandlingpåventmodal/SettBehandllingPåVentModal';

describe('settBehandlingPåVentModal', () => {
  beforeEach(() => {
    render(<SettBehandllingPåVentModal behandlingsReferanse={'123'} reservert={true} isOpen={true} onClose={vi.fn} />);
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

describe('settBehandlingPåVentModal viser infoboks om reservert oppgave', () => {
  const expectedText = 'Behandlingen er ikke reservert. Når du setter den på vent, blir den reservert deg.';

  it('skal vise infoboks med informasjon om at oppgaven reserveres saksbehandler', () => {
    render(<SettBehandllingPåVentModal behandlingsReferanse={'123'} reservert={false} isOpen={true} onClose={vi.fn} />);
    const infoboks = screen.getByText(expectedText);
    expect(infoboks).toBeVisible();
  });

  it('skal ikke vise infoboks med informasjon om at oppgaven reserveres saksbehandler', () => {
    render(<SettBehandllingPåVentModal behandlingsReferanse={'123'} reservert={true} isOpen={true} onClose={vi.fn} />);
    const infoboks = screen.queryByText(expectedText);
    expect(infoboks).toBeNull();
  });
});
