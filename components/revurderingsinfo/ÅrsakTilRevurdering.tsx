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
        <HStack wrap={false} gap="4" align="center">
          <TasklistStartIcon aria-hidden fontSize={'1.5rem'} />
          <ExpansionCard.Title size={'small'}>
            <Label>{tittel}</Label>
          </ExpansionCard.Title>
        </HStack>
      </ExpansionCard.Header>
      <ExpansionCard.Content>
        <VStack gap={'3'}>
          {vurderingsbehovOgÅrsaker
            .filter(({ vurderingsbehov }) => !vurderingsbehov.some((v) => v.type === 'REVURDERING_AVBRUTT'))
            .map(({ vurderingsbehov, opprettet, årsak, beskrivelse }, index) => {
              return (
                <Box key={index}>
                  <HStack gap="2" align="end">
                    <Label size="small">{vurderingsbehov.map((v) => formaterVurderingsbehov(v.type)).join(', ')}</Label>
                    <Detail textColor="subtle">
                      {mapTilÅrsakTilOpprettelseTilTekst(årsak)} {formaterDatoForFrontend(opprettet)}
                    </Detail>
                  </HStack>
                  {beskrivelse && <BodyLong size="small">Begrunnelse: {beskrivelse}</BodyLong>}
                </Box>
              );
            })}
        </VStack>
      </ExpansionCard.Content>
    </ExpansionCard>
  );
};
