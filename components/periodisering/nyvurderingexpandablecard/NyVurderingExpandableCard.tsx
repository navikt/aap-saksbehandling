'use client';

import { CustomExpandableCard } from 'components/customexpandablecard/CustomExpandableCard';
import { formatDatoMedMånedsnavn } from 'lib/utils/date';
import { ReactNode, useRef, useState } from 'react';
import { BodyShort, Button, HGrid, HStack, VStack } from '@navikt/ds-react';
import { VurdertAvAnsattDetail } from 'components/vurdertav/VurdertAvAnsattDetail';
import { subDays } from 'date-fns';
import { TrashFillIcon } from '@navikt/aksel-icons';
import { VurdertAvAnsatt } from 'lib/types/types';
import { SlettVurderingModal } from 'components/periodisering/slettvurderingmodal/SlettVurderingModal';
import { VurderingStatusTag } from 'components/periodisering/VurderingStatusTag';
import { AccordionsSignal } from 'hooks/AccordionSignalHook';

interface Props {
  initiellEkspandert: boolean;
  fraDato: Date | null;
  nestePeriodeFraDato: Date | null;
  isLast: boolean;
  finnesFeil: boolean;
  oppfylt: boolean | undefined;
  vurdertAv: VurdertAvAnsatt | undefined;
  kvalitetssikretAv: VurdertAvAnsatt | undefined;
  besluttetAv: VurdertAvAnsatt | undefined;
  children: ReactNode;
  readonly: boolean;
  onSlettVurdering: () => void;
  index: number;
  accordionsSignal: AccordionsSignal;
  harTidligereVurderinger?: boolean;
}

export const NyVurderingExpandableCard = ({
  fraDato,
  nestePeriodeFraDato,
  isLast,
  oppfylt,
  vurdertAv,
  kvalitetssikretAv,
  besluttetAv,
  children,
  readonly,
  finnesFeil,
  onSlettVurdering,
  harTidligereVurderinger = false,
  initiellEkspandert = false,
  index,
  accordionsSignal,
}: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(initiellEkspandert);

  const sisteAccordionSignalVersion = useRef(accordionsSignal.version);

  if (accordionsSignal.version !== sisteAccordionSignalVersion.current) {
    setIsOpen(accordionsSignal.action === 'open');
    sisteAccordionSignalVersion.current = accordionsSignal.version;
  }

  const ref = useRef<HTMLDialogElement>(null);

  return (
    <CustomExpandableCard
      editable
      defaultOpen
      expanded={isOpen || finnesFeil}
      setExpanded={setIsOpen}
      heading={
        <HStack justify={'space-between'} padding={'2'}>
          <BodyShort size={'small'}>
            Ny vurdering: {fraDato ? `${formatDatoMedMånedsnavn(fraDato)} – ` : '[Ikke valgt]'}
            {nestePeriodeFraDato ? (
              <span>{formatDatoMedMånedsnavn(subDays(nestePeriodeFraDato, 1))}</span>
            ) : (
              <span>{isLast ? ' ' : '[Ikke valgt]'}</span>
            )}
          </BodyShort>
          <VurderingStatusTag oppfylt={oppfylt} />
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
                onClick={() => ref.current?.showModal()}
                type="button"
              />
              <SlettVurderingModal ref={ref} onSlettVurdering={onSlettVurdering} />
            </VStack>
          )}
        </HGrid>

        <VStack>
          <VurdertAvAnsattDetail vurdertAv={vurdertAv} variant={'VURDERING'} />
          <VurdertAvAnsattDetail vurdertAv={kvalitetssikretAv} variant={'KVALITETSSIKRER'} />
          <VurdertAvAnsattDetail vurdertAv={besluttetAv} variant={'BESLUTTER'} />
        </VStack>
      </VStack>
    </CustomExpandableCard>
  );
};

export function skalVæreInitiellEkspandert(erNyVurdering: boolean | undefined, erAktiv: boolean | undefined): boolean {
  return erNyVurdering === true || erAktiv === true;
}
