'use client';

import { CustomExpandableCard } from 'components/customexpandablecard/CustomExpandableCard';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { ReactNode, useState } from 'react';
import { BodyShort, Button, HGrid, HStack, Tag, VStack } from '@navikt/ds-react';
import { VurdertAvAnsattDetail } from 'components/vurdertav/VurdertAvAnsattDetail';
import { subDays } from 'date-fns';
import { TrashFillIcon } from '@navikt/aksel-icons';
import { VurdertAvAnsatt } from 'lib/types/types';

interface Props {
  fraDato: Date | null;
  nestePeriodeFraDato: Date | null;
  isLast: boolean;
  oppfylt: boolean | undefined;
  vurdertAv: VurdertAvAnsatt | undefined;
  kvalitetssikretAv: VurdertAvAnsatt | undefined;
  finnesFeil: boolean;
  children: ReactNode;
  readonly: boolean;
  onRemove: () => void;
  index: number;
  harTidligereVurderinger?: boolean;
}
export const NyVurderingExpandableCard = ({
  fraDato,
  nestePeriodeFraDato,
  isLast,
  oppfylt,
  vurdertAv,
  kvalitetssikretAv,
  finnesFeil,
  children,
  readonly,
  onRemove,
  harTidligereVurderinger = false,
  index,
}: Props) => {
  const [cardExpanded, setCardExpanded] = useState<boolean>(true);
  const [spinnerRemove, setSpinnerRemove] = useState(false);
  const handleRemove = (): void => {
    setSpinnerRemove(true);
    setTimeout(() => {
      onRemove();
      setSpinnerRemove(false);
    }, 500);
  };
  return (
    <CustomExpandableCard
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
        <HGrid columns={'1fr 30px'}>
          <VStack gap={'5'}>{children}</VStack>
          {!readonly && (index !== 0 || harTidligereVurderinger) && (
            <VStack justify={'start'}>
              <Button
                aria-label="Fjern vurdering"
                variant="tertiary"
                size="small"
                icon={<TrashFillIcon />}
                onClick={handleRemove}
                type="button"
                loading={spinnerRemove}
              />
            </VStack>
          )}
        </HGrid>

        <VStack>
          <VurdertAvAnsattDetail vurdertAv={vurdertAv} variant={'VURDERING'} />
          <VurdertAvAnsattDetail vurdertAv={kvalitetssikretAv} variant={'KVALITETSSIKRER'} />
        </VStack>
      </VStack>
    </CustomExpandableCard>
  );
};
