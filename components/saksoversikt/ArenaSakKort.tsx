'use client';

import { BodyShort, Heading, HStack, Link, Tag } from '@navikt/ds-react';
import { ArenaSakOppsummeringKontrakt } from 'lib/services/apiinternservice/apiInternService';
import { ExternalLinkIcon } from '@navikt/aksel-icons';
import { useFeatureFlag } from 'context/UnleashContext';
import { Kort } from 'components/kort/Kort';

const arenaVisningsklientBaseUrl = process.env.NEXT_PUBLIC_ARENA_VISNINGSKLIENT_BASE_URL ?? '';

export function ArenaSakKort({ sak }: { sak: ArenaSakOppsummeringKontrakt }) {
  const visLenke = useFeatureFlag('ArenasakerLenkeTilVisninsklient');

  return (
    <Kort background="default">
      <HStack gap="space-16" justify="space-between" align="center" wrap={false}>
        <HStack gap="space-16" align="center">
          <Heading as="h3" size="small">
            Arena AAP
          </Heading>
          {visLenke ? (
            <Link href={`${arenaVisningsklientBaseUrl}sak/${sak.sakId}`} target="_blank">
              <Heading as="h3" size="small">
                {sak.aar} {sak.lopenummer}
              </Heading>
              <ExternalLinkIcon />
            </Link>
          ) : (
            <Heading as="h3" size="small">
              {sak.aar} {sak.lopenummer}
            </Heading>
          )}
          <BodyShort size="medium">{sak.antallVedtak} vedtak</BodyShort>
        </HStack>
        <Tag variant="moderate" data-color={sak.statuskode === 'AKTIV' ? 'success' : 'neutral'} size="small">
          {sak.statusnavn}
        </Tag>
      </HStack>
    </Kort>
  );
}
