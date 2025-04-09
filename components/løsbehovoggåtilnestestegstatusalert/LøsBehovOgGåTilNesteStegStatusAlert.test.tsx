import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LøsBehovOgGåTilNesteStegStatusAlert } from 'components/løsbehovoggåtilnestestegstatusalert/LøsBehovOgGåTilNesteStegStatusAlert';

describe('ServerSentEventStatusAlert', () => {
  it('skal vise korrekt melding dersom status er ERROR', () => {
    render(<LøsBehovOgGåTilNesteStegStatusAlert status={'ERROR'} />);
    const melding = screen.getByText(/det tok for lang tid å hente neste steg fra baksystemet\. kom tilbake senere\./i);
    expect(melding).toBeVisible();
  });

  it('skal vise korrekt melding dersom status er POLLING', () => {
    render(<LøsBehovOgGåTilNesteStegStatusAlert status={'POLLING'} />);
    const melding = screen.getByText(/maskinen bruker litt lengre tid på å jobbe enn vanlig\./i);
    expect(melding).toBeVisible();
  });
});
