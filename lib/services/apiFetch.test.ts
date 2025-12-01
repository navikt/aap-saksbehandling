import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { apiFetch, apiFetchNoMemoization } from './apiFetch';
import { getToken } from 'lib/services/token';
import { logError, logWarning } from 'lib/serverutlis/logger';

vi.mock('lib/services/token');
vi.mock('lib/serverutlis/logger');

global.fetch = vi.fn();

const mockUrl = 'https://api.example.com/data';
const mockScope = 'api://scope';
const mockToken = 'mock-token';

describe('apiFetch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getToken).mockResolvedValue(mockToken);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should fetch successfully with GET method', async () => {
    const mockData = { id: 1, name: 'Test' };
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => mockData,
    } as Response);

    const result = await apiFetch(mockUrl, mockScope);

    expect(result).toEqual({ type: 'SUCCESS', status: 200, data: mockData });
    expect(getToken).toHaveBeenCalledWith(mockScope, mockUrl);
    expect(fetch).toHaveBeenCalledWith(
      mockUrl,
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          Authorization: `Bearer ${mockToken}`,
        }),
      })
    );
  });

  it('should handle 204 No Content response', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 204,
    } as Response);

    const result = await apiFetch(mockUrl, mockScope);

    expect(result).toEqual({ type: 'SUCCESS', status: 204, data: undefined });
  });

  it('should handle POST with request body', async () => {
    const requestBody = { name: 'New Item' };
    const mockResponse = { id: 2, name: 'New Item' };

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 201,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => mockResponse,
    } as Response);

    const result = await apiFetch(mockUrl, mockScope, 'POST', requestBody);

    expect(result).toEqual({ type: 'SUCCESS', status: 201, data: mockResponse });
    expect(fetch).toHaveBeenCalledWith(
      mockUrl,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(requestBody),
      })
    );
  });

  it('should handle 4xx errors', async () => {
    const apiException = { message: 'Bad Request' };
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => apiException,
    } as Response);

    const result = await apiFetch(mockUrl, mockScope);

    expect(result).toEqual({ type: 'ERROR', apiException, status: 400 });
    expect(logWarning).toHaveBeenCalled();
  });

  it('should handle 5xx errors', async () => {
    const apiException = { message: 'Internal Server Error' };
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => apiException,
    } as Response);

    const result = await apiFetch(mockUrl, mockScope);

    expect(result).toEqual({ type: 'ERROR', apiException, status: 500 });
    expect(logError).toHaveBeenCalled();
  });

  it('should retry on network failure for GET requests', async () => {
    vi.mocked(fetch)
      .mockRejectedValueOnce(new Error('ECONNRESET'))
      .mockRejectedValueOnce(new Error('ECONNRESET'))
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ success: true }),
      } as Response);

    const result = await apiFetch(mockUrl, mockScope);

    expect(result.type).toBe('SUCCESS');
    expect(fetch).toHaveBeenCalledTimes(3);
  });

  it('should return 503 after max retries', async () => {
    vi.mocked(fetch).mockRejectedValue(new Error('ECONNRESET'));

    const result = await apiFetch(mockUrl, mockScope);

    expect(result).toEqual({
      type: 'ERROR',
      apiException: { message: 'Fikk ikke svar fra tjenesten. Prøv igjen.' },
      status: 503,
    });
    expect(fetch).toHaveBeenCalledTimes(3);
    expect(logError).toHaveBeenCalled();
  });

  it('should handle text responses', async () => {
    const mockText = 'Plain text response';
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'text/plain' }),
      text: async () => mockText,
    } as Response);

    const result = await apiFetch(mockUrl, mockScope);

    expect(result).toEqual({ type: 'SUCCESS', status: 200, data: mockText });
  });
});

describe('apiFetchNoMemoization', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getToken).mockResolvedValue(mockToken);
  });

  it('should include AbortController signal in request', async () => {
    const mockData = { id: 1 };
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => mockData,
    } as Response);

    await apiFetchNoMemoization(mockUrl, mockScope);

    expect(fetch).toHaveBeenCalledWith(
      mockUrl,
      expect.objectContaining({
        signal: expect.any(AbortSignal),
      })
    );
  });

  it('should work with different HTTP methods', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({}),
    } as Response);

    await apiFetchNoMemoization(mockUrl, mockScope, 'PUT', { update: true });

    expect(fetch).toHaveBeenCalledWith(
      mockUrl,
      expect.objectContaining({
        method: 'PUT',
        signal: expect.any(AbortSignal),
      })
    );
  });
});
