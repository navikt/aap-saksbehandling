import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

import { KelvinAppHeader } from './KelvinAppHeader';

import { userEvent } from '@testing-library/user-event';
import createFetchMock from 'vitest-fetch-mock';

const brukerInformasjon = {
  navn: 'Kjell T Ringen',
};

const fetchMock = createFetchMock(vi);
fetchMock.enableMocks();

describe('Header', () => {
  vi.stubEnv('NEXT_PUBLIC_ENVIRONMENT', 'dev');

  const user = userEvent.setup();
  it('skal vise overskrift i header', async () => {
    mockFetchConfig();

    render(<KelvinAppHeader brukerInformasjon={brukerInformasjon} />);
    expect(screen.getByText('Kelvin')).toBeVisible();
  });

  it('skal vise navnet på bruker i header', async () => {
    mockFetchConfig();

    render(<KelvinAppHeader brukerInformasjon={brukerInformasjon} />);
    expect(screen.getByText('Kjell T Ringen')).toBeVisible();
  });

  it('skal vise knapp for å logge ut', async () => {
    mockFetchConfig();

    render(<KelvinAppHeader brukerInformasjon={brukerInformasjon} />);

    await user.click(screen.getByText('Kjell T Ringen'));

    expect(await screen.findByText('Logg ut')).toBeVisible();
  });
});

function mockFetchConfig() {
  fetchMock.mockResponseOnce(JSON.stringify({}), { status: 200 });
}
