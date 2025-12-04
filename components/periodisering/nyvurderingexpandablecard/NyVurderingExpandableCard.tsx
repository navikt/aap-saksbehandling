'use client';

import { CustomExpandableCard } from 'components/customexpandablecard/CustomExpandableCard';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { ReactNode, useState } from 'react';
import { BodyShort, HStack, Tag, VStack } from '@navikt/ds-react';
import { VurdertAv, VurdertAvShape } from 'components/vurdertav/VurdertAv';
import { subDays } from 'date-fns';

interface Props {
  fraDato: Date | null;
  nestePeriodeFraDato: Date | null;
  isLast: boolean;
  oppfylt: boolean | undefined;
  vurdertAv: VurdertAvShape | undefined;
  finnesFeil: boolean;
  children: ReactNode;
}
export const NyVurderingExpandableCard = ({
  fraDato,
  nestePeriodeFraDato,
  isLast,
  oppfylt,
  vurdertAv,
  finnesFeil,
  children,
}: Props) => {
  const [cardExpanded, setCardExpanded] = useState<boolean>(true);
  return (
    <CustomExpandableCard
      key={`${fraDato?.getTime()}`}
      editable
      defaultOpen
      expanded={cardExpanded || finnesFeil}
      setExpanded={setCardExpanded}
      heading={
        <HStack justify={'space-between'} padding={'2'}>
          <BodyShort size={'small'}>
            Ny vurdering: {fraDato ? `${formaterDatoForFrontend(fraDato)} – ` : '[Ikke valgt]'}
            {nestePeriodeFraDato ? (
              <span>{formaterDatoForFrontend(subDays(nestePeriodeFraDato, 1))}</span>
            ) : (
              <span>{isLast ? ' ' : '[Ikke valgt]'}</span>
            )}
          </BodyShort>
          {oppfylt !== undefined && (
            <Tag size="xsmall" variant={oppfylt ? 'success-moderate' : 'error-moderate'}>
              {oppfylt === true ? 'Oppfylt' : 'Ikke oppfylt'}
            </Tag>
          )}
        </HStack>
      }
    >
      <VStack gap={'5'}>
        {children}
        <VurdertAv vurdertAv={vurdertAv} />
      </VStack>
    </CustomExpandableCard>
  );
};
