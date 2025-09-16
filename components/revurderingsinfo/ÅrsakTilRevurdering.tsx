'use client';

import { BodyLong, Box, Detail, ExpansionCard, HStack, Label, VStack } from '@navikt/ds-react';
import { VurderingsbehovOgÅrsak } from 'lib/types/types';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { mapTilÅrsakTilOpprettelseTilTekst } from 'lib/utils/oversettelser';
import { formaterVurderingsbehov } from 'lib/utils/vurderingsbehov';
import { TasklistStartIcon } from '@navikt/aksel-icons';

interface Props {
  vurderingsbehovOgÅrsaker: VurderingsbehovOgÅrsak[];
}

export const ÅrsakTilRevurdering = ({ vurderingsbehovOgÅrsaker }: Props) => {
  const tittel = 'Årsak til revurdering';

  return (
    <ExpansionCard
      size={'small'}
      aria-label={tittel}
      defaultOpen={true}
      style={{ backgroundColor: 'var(--a-surface-info-subtle)' }}
    >
      <ExpansionCard.Header>
        <>
          <HStack wrap={false} gap="4" align="center">
            <TasklistStartIcon aria-hidden fontSize={'1.5rem'} />
            <ExpansionCard.Title size={'small'}>
              <Label>{tittel}</Label>
            </ExpansionCard.Title>
          </HStack>
        </>
      </ExpansionCard.Header>
      <ExpansionCard.Content>
        <VStack gap={'3'}>
          {vurderingsbehovOgÅrsaker.map((vurderingsbehovOgÅrsak, index) => {
            const opprettetTid = formaterDatoForFrontend(vurderingsbehovOgÅrsak.opprettet ?? '');

            const årsakTilOpprettelseTekst = mapTilÅrsakTilOpprettelseTilTekst(vurderingsbehovOgÅrsak.årsak);
            const erManueltAvbrutt =
              vurderingsbehovOgÅrsak.vurderingsbehov.some((v) => v.type === 'REVURDERING_AVBRUTT') &&
              årsakTilOpprettelseTekst === 'Manuell opprettelse';

            return (
              <Box key={index}>
                <HStack gap={'2'} align={'end'}>
                  <Label size={'small'}>
                    {vurderingsbehovOgÅrsak.vurderingsbehov
                      .map((vurderingsbehov) => formaterVurderingsbehov(vurderingsbehov.type))
                      .join(', ')}
                  </Label>
                  <Detail textColor={'subtle'}>
                    {erManueltAvbrutt
                      ? `Manuelt avbrutt ${opprettetTid}`
                      : `${årsakTilOpprettelseTekst} ${opprettetTid}`}
                  </Detail>
                </HStack>
                {vurderingsbehovOgÅrsak.beskrivelse && (
                  <BodyLong size={'small'}>Begrunnelse: {vurderingsbehovOgÅrsak.beskrivelse}</BodyLong>
                )}
              </Box>
            );
          })}
        </VStack>
      </ExpansionCard.Content>
    </ExpansionCard>
  );
};
