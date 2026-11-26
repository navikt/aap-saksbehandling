import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { SettBehandlingPåVentModal } from 'components/settbehandlingpåventmodal/SettBehandlingPåVentModal';

describe('settBehandlingPåVentModal', () => {
  beforeEach(async () => {
    await act(async () => {
      render(<SettBehandlingPåVentModal reservert={true} isOpen={true} onClose={vi.fn} />);
    });
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
    const årsakFelt = screen.getByRole('combobox', { name: /Hva venter behandlingen på?/i });
    expect(årsakFelt).toBeVisible();
  });
});

describe('settBehandlingPåVentModal viser infoboks om reservert oppgave', () => {
  const expectedText = 'Behandlingen er ikke tildelt deg. Den tildeles deg når du setter den på vent.';

  it('skal vise infoboks med informasjon om at oppgaven reserveres saksbehandler', async () => {
    await act(async () => {
      render(<SettBehandlingPåVentModal reservert={false} isOpen={true} onClose={vi.fn} />);
    });
    const infoboks = screen.getByText(expectedText);
    expect(infoboks).toBeVisible();
  });

  it('skal ikke vise infoboks med informasjon om at oppgaven reserveres saksbehandler', async () => {
    await act(async () => {
      render(<SettBehandlingPåVentModal reservert={true} isOpen={true} onClose={vi.fn} />);
    });
    const infoboks = screen.queryByText(expectedText);
    expect(infoboks).toBeNull();
  });
});

describe('Sett behandling på vent – lukkeatferd', () => {
  it.each(['Avbryt', 'Lukk', 'Escape'])('tilbakestiller skjemaet ved %s', async (lukking) => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const DialogMedState = () => {
      const [isOpen, setIsOpen] = useState(true);
      return (
        <>
          <button onClick={() => setIsOpen(true)}>Åpne på nytt</button>
          <SettBehandlingPåVentModal
            reservert={true}
            isOpen={isOpen}
            onClose={() => {
              onClose();
              setIsOpen(false);
            }}
          />
        </>
      );
    };
    await act(async () => {
      render(<DialogMedState />);
    });
    expect(screen.getByRole('dialog', { name: 'Sett behandling på vent' })).toBeVisible();
    await user.type(screen.getByRole('textbox', { name: /begrunnelse/i }), 'Midlertidig begrunnelse');

    fireEvent.pointerDown(document.body);
    fireEvent.click(document.body);
    expect(onClose).not.toHaveBeenCalled();
    expect(screen.getByRole('dialog', { name: 'Sett behandling på vent' })).toBeVisible();

    if (lukking === 'Escape') {
      await user.keyboard('{Escape}');
    } else {
      await user.click(screen.getByRole('button', { name: lukking }));
    }
    expect(onClose).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await user.click(screen.getByRole('button', { name: 'Åpne på nytt' }));
    expect(screen.getByRole('textbox', { name: /begrunnelse/i })).toHaveValue('');
  });
});
