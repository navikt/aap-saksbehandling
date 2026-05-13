import { describe, expect, it, vi } from 'vitest';

import { KelvinAppHeader } from './KelvinAppHeader';

import { userEvent } from '@testing-library/user-event';
import createFetchMock from 'vitest-fetch-mock';
import { render, screen } from 'lib/test/CustomRender';

const fetchMock = createFetchMock(vi);
fetchMock.enableMocks();

describe('Header', () => {
  vi.stubEnv('NEXT_PUBLIC_ENVIRONMENT', 'dev');

  const user = userEvent.setup();

  it('skal vise navnet på brukeren i header', async () => {
    mockFetchConfig();

    render(<KelvinAppHeader />);
    expect(screen.getByText('Test Testesen')).toBeVisible();
  });

  it('skal vise knapp for å logge ut', async () => {
    mockFetchConfig();

    render(<KelvinAppHeader />);

    await user.click(screen.getByText('Test Testesen'));

    expect(await screen.findByText('Logg ut')).toBeVisible();
  });
});

function mockFetchConfig() {
  fetchMock.mockResponseOnce(JSON.stringify({}), { status: 200 });
}
