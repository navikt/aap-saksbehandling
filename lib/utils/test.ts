import useSWR from 'swr';
import { vi, type Mock } from 'vitest';

export function mockSWRImplementation(customMocks: Record<string, any>) {
  (useSWR as unknown as Mock).mockImplementation((key: string) => {
    const mockData = customMocks[key];
    if (mockData) {
      return { data: mockData, mutate: vi.fn(), error: undefined };
    }
    return { data: undefined, mutate: vi.fn(), error: undefined };
  });
}
