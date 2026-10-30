import { describe, expect, expectTypeOf, it, vi } from 'vitest';
import {
  clientAvbrytPåminnelsePåLegeerklæring,
  clientBestillTestBrev,
  clientGjenopptaPåminnelsePåLegeerklæring,
  clientLeggTilInstitusjonsopphold,
  clientLeggTilKravVurdering,
  clientLeggTilYrkesskade,
  clientPurrPåLegeerklæring,
  clientSendHendelse,
} from 'lib/clientApi';
import type {
  avbrytPåminnelsePåLegeerklæring,
  gjenopptaPåminnelsePåLegeerklæring,
  leggTilDummyInst,
  leggTilDummyKravVurdering,
  leggTilDummyYrkesskade,
  sendLokalHendelse,
  sendPåminnelsePåLegeerklæring,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import type { paths } from './schema';
import type { PurringLegeerklæringRequest, SendHendelseRequest } from './types';

describe('shared endpoint request contracts', () => {
  it('uses the same generated request in test clients and backend services', () => {
    expectTypeOf<Parameters<typeof clientLeggTilInstitusjonsopphold>[1]>().toEqualTypeOf<
      Parameters<typeof leggTilDummyInst>[1]
    >();
    expectTypeOf<Parameters<typeof clientLeggTilKravVurdering>[1]>().toEqualTypeOf<
      Parameters<typeof leggTilDummyKravVurdering>[1]
    >();
    expectTypeOf<Parameters<typeof clientLeggTilYrkesskade>[1]>().toEqualTypeOf<
      Parameters<typeof leggTilDummyYrkesskade>[1]
    >();
    expectTypeOf<Parameters<typeof clientSendHendelse>[1]>().toEqualTypeOf<Parameters<typeof sendLokalHendelse>[1]>();
    expectTypeOf<SendHendelseRequest['referanse']>().toEqualTypeOf<{
      type: SendHendelseRequest['referanse']['type'];
      verdi: string;
    }>();
  });

  it('uses the generated reminder request for send, cancel and resume', () => {
    expectTypeOf<Parameters<typeof sendPåminnelsePåLegeerklæring>[0]>().toEqualTypeOf<PurringLegeerklæringRequest>();
    expectTypeOf<Parameters<typeof avbrytPåminnelsePåLegeerklæring>[0]>().toEqualTypeOf<PurringLegeerklæringRequest>();
    expectTypeOf<
      Parameters<typeof gjenopptaPåminnelsePåLegeerklæring>[0]
    >().toEqualTypeOf<PurringLegeerklæringRequest>();
    expectTypeOf<PurringLegeerklæringRequest>().toEqualTypeOf<
      NonNullable<
        paths['/api/dokumentinnhenting/paaminnelse/avbryt-automatisk-paaminnelse']['post']['requestBody']
      >['content']['application/json']
    >();
    expectTypeOf<PurringLegeerklæringRequest>().toEqualTypeOf<
      NonNullable<
        paths['/api/dokumentinnhenting/paaminnelse/gjenoppta-automatisk-paaminnelse']['post']['requestBody']
      >['content']['application/json']
    >();
  });

  it.each([clientPurrPåLegeerklæring, clientAvbrytPåminnelsePåLegeerklæring, clientGjenopptaPåminnelsePåLegeerklæring])(
    'sends the treatment reference in reminder requests',
    async (sendReminder) => {
      const fetchMock = vi
        .spyOn(globalThis, 'fetch')
        .mockResolvedValue(new Response(JSON.stringify({ type: 'SUCCESS', data: null }), { status: 200 }));
      try {
        await sendReminder('dialogmelding-id', 'behandling-id');
        expect(fetchMock).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify({
              dialogmeldingPurringUUID: 'dialogmelding-id',
              behandlingsReferanse: 'behandling-id',
            }),
          })
        );
      } finally {
        fetchMock.mockRestore();
      }
    }
  );

  it('uses the backend treatment-reference field when ordering a test letter', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response(JSON.stringify({ type: 'SUCCESS', data: null }), { status: 200 }));
    try {
      await clientBestillTestBrev('behandling-id');
      expect(fetchMock).toHaveBeenCalledWith(
        '/saksbehandling/api/test/bestill/brev',
        expect.objectContaining({ body: JSON.stringify({ behandlingsreferanse: 'behandling-id' }) })
      );
    } finally {
      fetchMock.mockRestore();
    }
  });
});
