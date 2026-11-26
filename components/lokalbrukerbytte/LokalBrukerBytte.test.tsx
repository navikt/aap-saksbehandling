import { Dropdown } from '@navikt/ds-react';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { InnloggetBrukerContextProvider } from 'context/InnloggetBrukerContext';
import { LokalBrukerBytte } from './LokalBrukerBytte';

function renderBrukerbytte(aktivIdent = 'Z000000') {
  return render(
    <InnloggetBrukerContextProvider bruker={{ NAVident: aktivIdent, navn: 'Testbruker', roller: [] }}>
      <Dropdown>
        <Dropdown.Toggle>Bytt bruker</Dropdown.Toggle>
        <Dropdown.Menu>
          <LokalBrukerBytte />
        </Dropdown.Menu>
      </Dropdown>
    </InnloggetBrukerContextProvider>
  );
}

beforeEach(() => {
  document.cookie = 'bruker=; path=/; max-age=0; SameSite=Strict';
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  document.cookie = 'bruker=; path=/; max-age=0; SameSite=Strict';
});

describe('LokalBrukerBytte', () => {
  it.each([
    ['Veileder', 'V123456'],
    ['Kvalitetssikrer', 'K123456'],
    ['Saksbehandler', 'S123456'],
    ['Beslutter', 'B123456'],
  ])('lagrer ident og oppdaterer siden ved valg av %s', async (rolle, ident) => {
    const bruker = userEvent.setup();
    const settCookie = vi.spyOn(document, 'cookie', 'set');
    renderBrukerbytte();

    await bruker.click(screen.getByRole('button', { name: 'Bytt bruker' }));
    await bruker.click(screen.getByRole('button', { name: rolle }));

    expect(settCookie).toHaveBeenCalledWith(`bruker=${ident}; path=/; max-age=86400; SameSite=Strict`);
    expect(document.cookie).toBe(`bruker=${ident}`);
  });

  it('markerer kun den aktive brukeren', async () => {
    const bruker = userEvent.setup();
    renderBrukerbytte('S123456');

    await bruker.click(screen.getByRole('button', { name: 'Bytt bruker' }));

    expect(screen.getByRole('button', { name: 'Saksbehandler' }).querySelector('svg')).not.toBeNull();
    for (const rolle of ['Veileder', 'Kvalitetssikrer', 'Beslutter']) {
      expect(screen.getByRole('button', { name: rolle }).querySelector('svg')).toBeNull();
    }
  });
});
