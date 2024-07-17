import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ServerSentEventStatusAlert } from 'components/serversenteventstatusalert/ServerSentEventStatusAlert';

describe('ServerSentEventStatusAlert', () => {
  it('skal vise korrekt melding dersom status er ERROR', () => {
    render(<ServerSentEventStatusAlert status={'ERROR'} />);
    const melding = screen.getByText(/det tok for lang tid å hente neste steg fra baksystemet\. kom tilbake senere\./i);
    expect(melding).toBeVisible();
  });

  it('skal vise korrekt melding dersom status er POLLING', () => {
    render(<ServerSentEventStatusAlert status={'POLLING'} />);
    const melding = screen.getByText(/maskinen bruker litt lengre tid på å jobbe enn vanlig\. ta deg en kopp kaffe\./i);
    expect(melding).toBeVisible();
  });
});
