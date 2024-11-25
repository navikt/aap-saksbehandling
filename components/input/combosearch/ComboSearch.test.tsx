import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComboSearch } from 'components/input/combosearch/ComboSearch';
import { beforeEach, describe, expect, test, vi } from 'vitest';

const user = userEvent.setup();
const mockFetcher = vi.fn();
const mockResult = ['treff en', 'treff to', 'treff tre', 'treff fire'];

const label = 'Søk';

describe('ComboSearch', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    render(<ComboSearch label={label} fetcher={mockFetcher} />);
  });

  test('har et input-felt', () => {
    expect(screen.getByRole('textbox', { name: label })).toBeVisible();
  });

  test('viser det som blir skrevet inn i feltet', async () => {
    const søkefelt = finnSøkefelt();
    await user.type(søkefelt, 'Søk nå');
    expect(søkefelt).toHaveValue('Søk nå');
  });

  test('kaller fetcher når det skrives noe', async () => {
    await user.type(finnSøkefelt(), 'søk på noe');
    expect(mockFetcher).toHaveBeenLastCalledWith('søk på noe');
  });

  test('viser en liste med resultater', async () => {
    mockFetcher.mockReturnValue(mockResult);
    await user.type(finnSøkefelt(), 'Søk nå');

    expect(screen.getByText(mockResult[0])).toBeVisible();
    expect(screen.getAllByRole('option')).toHaveLength(mockResult.length);
  });
});

const finnSøkefelt = () => screen.getByRole('textbox', { name: label });
