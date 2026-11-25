import { userEvent } from '@testing-library/user-event';
import { render, screen } from 'lib/test/CustomRender';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import createFetchMock from 'vitest-fetch-mock';

import { OpprettUtenlandsoppholdBehandling } from 'components/saksoversikt/opprettutenlandsoppholdbehandling/OpprettUtenlandsoppholdBehandling';

const push = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }));

const user = userEvent.setup();
const fetchMock = createFetchMock(vi);
fetchMock.enableMocks();

describe('Opprett behandling av utenlandsopphold', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    fetchMock.mockResponse(JSON.stringify({ type: 'SUCCESS', status: 200, data: {} }));
  });

  it('krever beskrivelse som ikke bare er mellomrom', async () => {
    render(<OpprettUtenlandsoppholdBehandling saksnummer="ABCDEFG" />);

    await user.type(screen.getByRole('textbox', { name: 'Hvorfor opprettes behandlingen?' }), '   ');
    await user.click(screen.getByRole('button', { name: 'Bekreft' }));

    expect(await screen.findByText('Du må beskrive hvorfor behandlingen opprettes.')).toBeVisible();
    expect(fetchMock.mock.calls).toHaveLength(0);
  });

  it('sender beskrivelsen til riktig endepunkt', async () => {
    render(<OpprettUtenlandsoppholdBehandling saksnummer="ABCDEFG" />);

    await user.type(screen.getByRole('textbox', { name: 'Hvorfor opprettes behandlingen?' }), ' Søknad på papir ');
    await user.click(screen.getByRole('button', { name: 'Bekreft' }));

    expect(fetchMock.mock.calls).toHaveLength(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toContain('/api/sak/ABCDEFG/opprettUtenlandsoppholdBehandling');
    expect(JSON.parse(String(init?.body))).toEqual({ beskrivelse: 'Søknad på papir' });
    expect(push).toHaveBeenCalledWith('/saksbehandling/sak/ABCDEFG');
  });
});
