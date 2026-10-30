import { describe, expect, expectTypeOf, it } from 'vitest';
import { readRequestBody } from './readRequestBody';

describe('readRequestBody', () => {
  it('reads an internal request without changing its payload', async () => {
    type ReminderRequest = {
      behandlingsReferanse: string;
      dialogmeldingPurringUUID: string;
    };
    const body: ReminderRequest = {
      behandlingsReferanse: 'behandling',
      dialogmeldingPurringUUID: 'dialogmelding',
    };
    const request = new Request('http://localhost/api/reminder', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    const result = await readRequestBody<ReminderRequest>(request);

    expectTypeOf(result).toEqualTypeOf<ReminderRequest>();
    expect(result).toEqual(body);
  });

  it('preserves JSON parsing failures', async () => {
    const request = new Request('http://localhost/api/reminder', {
      method: 'POST',
      body: '{',
    });

    await expect(readRequestBody<unknown>(request)).rejects.toBeInstanceOf(SyntaxError);
  });
});
