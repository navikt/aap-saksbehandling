import { userEvent } from '@testing-library/user-event';
import { render, screen } from 'lib/test/CustomRender';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import createFetchMock from 'vitest-fetch-mock';
import { defaultFlytResponse, setMockFlytResponse } from 'vitestSetup';

import { VurderSøknadUtenlandsopphold } from 'components/behandlinger/utenlandsopphold/VurderSøknadUtenlandsopphold';

const user = userEvent.setup();
const fetchMock = createFetchMock(vi);
fetchMock.enableMocks();

describe('Vurder søknad om AAP under opphold i utlandet', () => {
  let capturedRequest: unknown = null;

  beforeEach(() => {
    capturedRequest = null;
    setMockFlytResponse({ ...defaultFlytResponse, aktivtSteg: 'VURDER_SØKNAD_UTENLANDSOPPHOLD' });
    vi.stubGlobal(
      'EventSource',
      vi.fn().mockImplementation(function () {
        return { close: vi.fn(), addEventListener: vi.fn(), onmessage: null, onerror: null };
      })
    );
    fetchMock.mockResponse(async (req) => {
      if (req.method === 'POST') {
        const body = JSON.parse(await req.text());
        if (body?.behov?.behovstype) capturedRequest = body;
      }
      return JSON.stringify({ type: 'SUCCESS', status: 200, data: {} });
    });
  });

  it('sender løsning med behovstype 4401 når saksbehandler bekrefter', async () => {
    render(<VurderSøknadUtenlandsopphold behandlingVersjon={0} readOnly={false} />);

    await user.click(screen.getByRole('button', { name: 'Bekreft' }));

    expect(capturedRequest).toMatchObject({ behov: { behovstype: '4401' } });
  });
});
