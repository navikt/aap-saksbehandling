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
  });

  test('har et input-felt', () => {
    const formater = (input: string) => input;
    render(<ComboSearch label={label} fetcher={mockFetcher} searchAsString={formater} />);
    expect(screen.getByRole('textbox', { name: label })).toBeVisible();
  });

  test('viser det som blir skrevet inn i feltet', async () => {
    const formater = (input: string) => input;
    render(<ComboSearch label={label} fetcher={mockFetcher} searchAsString={formater} />);
    const søkefelt = finnSøkefelt();
    await user.type(søkefelt, 'Søk nå');
    expect(søkefelt).toHaveValue('Søk nå');
  });

  test('kaller fetcher når det skrives noe', async () => {
    const formater = (input: string) => input;
    render(<ComboSearch label={label} fetcher={mockFetcher} searchAsString={formater} />);
    await user.type(finnSøkefelt(), 'søk på noe');
    expect(mockFetcher).toHaveBeenLastCalledWith('søk på noe');
  });

  test('viser en liste med resultater', async () => {
    const formater = (input: string) => input;
    render(<ComboSearch label={label} fetcher={mockFetcher} searchAsString={formater} />);
    mockFetcher.mockReturnValue(mockResult);
    await user.type(finnSøkefelt(), 'Søk nå');

    expect(screen.getByText(mockResult[0])).toBeVisible();
    expect(screen.getAllByRole('option')).toHaveLength(mockResult.length);
  });

  test('håndterer en liste med objekter som svar', async () => {
    type Treff = {
      navn: string;
      id: number;
      kontor: string;
    };

    const opts: Treff[] = [
      { navn: 'Bob', id: 22, kontor: 'Hamang' },
      { navn: 'Steve', id: 42, kontor: 'Gamle Oslo' },
    ];

    const formater = (input: Treff) => input.navn;
    render(<ComboSearch label={label} fetcher={mockFetcher} searchAsString={formater} />);
    mockFetcher.mockReturnValue(opts);

    await user.type(finnSøkefelt(), 'Søk nå');
    expect(screen.getByText(opts[0].navn)).toBeVisible();
  });
});

const finnSøkefelt = () => screen.getByRole('textbox', { name: label });
