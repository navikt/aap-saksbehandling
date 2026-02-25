'use client';

import { CustomExpandableCard } from 'components/customexpandablecard/CustomExpandableCard';
import { formatDatoMedMånedsnavn } from 'lib/utils/date';
import { ReactNode, useRef, useState } from 'react';
import { Alert, BodyShort, Button, HGrid, HStack, VStack } from '@navikt/ds-react';
import { VurdertAvAnsattDetail } from 'components/vurdertav/VurdertAvAnsattDetail';
import { subDays } from 'date-fns';
import { TrashFillIcon } from '@navikt/aksel-icons';
import { PeriodisertVurderingMeta, VurdertAvAnsatt } from 'lib/types/types';
import { SlettVurderingModal } from 'components/periodisering/slettvurderingmodal/SlettVurderingModal';
import { VurderingStatus, VurderingStatusTag } from 'components/periodisering/VurderingStatusTag';
import { AccordionsSignal } from 'hooks/AccordionSignalHook';

interface Props {
  initiellEkspandert: boolean;
  fraDato: Date | null;
  nestePeriodeFraDato: Date | null;
  isLast: boolean;
  finnesFeil: boolean;
  vurderingStatus: VurderingStatus | undefined;
  vurdering: PeriodisertVurderingMeta;
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
  vurderingStatus,
  vurdering,
  // vurdertAv,
  // kvalitetssikretAv,
  // besluttetAv,
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
          <VurderingStatusTag status={vurderingStatus} />
        </HStack>
      }
    >
      <VStack gap={'5'}>
        <HGrid columns={'1fr 30px'}>
          <VStack gap={'5'}>
            {vurdering.behøverVurdering && (
              <Alert
                variant={'info'}
              >{`Perioden fra ${fraDato ? formatDatoMedMånedsnavn(fraDato) : ''} må vurderes`}</Alert>
            )}
            {children}
          </VStack>
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
          <VurdertAvAnsattDetail vurdertAv={vurdering.vurdertAv} variant={'VURDERING'} />
          <VurdertAvAnsattDetail vurdertAv={vurdering.kvalitetssikretAv} variant={'KVALITETSSIKRER'} />
          <VurdertAvAnsattDetail vurdertAv={vurdering.besluttetAv} variant={'BESLUTTER'} />
        </VStack>
      </VStack>
    </CustomExpandableCard>
  );
};

export function skalVæreInitiellEkspandert(erNyVurdering: boolean | undefined, erAktiv: boolean): boolean {
  return erNyVurdering === true || erAktiv;
}
