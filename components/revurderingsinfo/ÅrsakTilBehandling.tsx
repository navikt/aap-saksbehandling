'use client';

import { BodyLong, Box, Detail, ExpansionCard, HStack, Label, VStack } from '@navikt/ds-react';
import { DetaljertBehandling, TypeBehandling, VurderingsbehovOgÅrsak } from 'lib/types/types';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { mapTilÅrsakTilOpprettelseTilTekst } from 'lib/utils/oversettelser';
import { formaterVurderingsbehov } from 'lib/utils/vurderingsbehov';
import { TasklistStartIcon } from '@navikt/aksel-icons';
interface Props {
  behandling: DetaljertBehandling;
}

export function filtrerÅrsakerForBehandlingType(
  vurderingsbehovOgÅrsaker: VurderingsbehovOgÅrsak[],
  behandlingType: TypeBehandling
): VurderingsbehovOgÅrsak[] {
  return behandlingType === 'Førstegangsbehandling'
    ? vurderingsbehovOgÅrsaker.filter((årsak) => !!årsak.beskrivelse || årsak.årsak === 'HELSEOPPLYSNINGER')
    : vurderingsbehovOgÅrsaker;
}

export const ÅrsakTilBehandling = ({ behandling }: Props) => {
  const filtrerteÅrsaker = filtrerÅrsakerForBehandlingType(behandling.vurderingsbehovOgÅrsaker, behandling.type);
  if (filtrerteÅrsaker.length === 0) {
    return null;
  }

  const tittel =
    behandling.type === 'Revurdering'
      ? 'Årsak til revurdering'
      : behandling.vurderingsbehovOgÅrsaker.length > 1
        ? 'Årsak til vurdering'
        : 'Årsak til opprettelse';

  return (
    <ExpansionCard
      size={'small'}
      aria-label={tittel}
      defaultOpen={true}
      style={{ backgroundColor: 'var(--ax-bg-info-soft)' }}
    >
      <ExpansionCard.Header>
        <HStack wrap={false} gap="space-16" align="center">
          <TasklistStartIcon aria-hidden fontSize={'1.5rem'} />
          <ExpansionCard.Title size={'small'}>
            <Label>{tittel}</Label>
          </ExpansionCard.Title>
        </HStack>
      </ExpansionCard.Header>
      <ExpansionCard.Content>
        <VStack gap={'space-12'}>
          {filtrerteÅrsaker
            .filter(({ vurderingsbehov }) => !vurderingsbehov.some((v) => v.type === 'REVURDERING_AVBRUTT'))
            .map(({ vurderingsbehov, opprettet, årsak, beskrivelse, opprettetAv }, index) => {
              return (
                <Box key={index}>
                  <HStack gap="space-8" align="end">
                    <Label size="small">{vurderingsbehov.map((v) => formaterVurderingsbehov(v.type)).join(', ')}</Label>
                    <Detail textColor="subtle">
                      {mapTilÅrsakTilOpprettelseTilTekst(årsak)} {formaterDatoForFrontend(opprettet)}
                    </Detail>
                  </HStack>
                  {beskrivelse && <BodyLong size="small">Begrunnelse: {beskrivelse}</BodyLong>}
                  {opprettetAv && <BodyLong size="small">Opprettet av: {opprettetAv}</BodyLong>}
                </Box>
              );
            })}
        </VStack>
      </ExpansionCard.Content>
    </ExpansionCard>
  );
};
