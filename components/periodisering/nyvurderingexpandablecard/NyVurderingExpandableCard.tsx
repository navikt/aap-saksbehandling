'use client';

import { CustomExpandableCard } from 'components/customexpandablecard/CustomExpandableCard';
import { formatDatoMedMånedsnavn } from 'lib/utils/date';
import { ReactNode, useRef, useState } from 'react';
import { BodyShort, Button, HGrid, HStack, VStack } from '@navikt/ds-react';
import { VurdertAvAnsattDetail } from 'components/vurdertav/VurdertAvAnsattDetail';
import { subDays } from 'date-fns';
import { TrashFillIcon } from '@navikt/aksel-icons';
import { VurderingFormMeta } from 'lib/types/types';
import { SlettVurderingModal } from 'components/periodisering/slettvurderingmodal/SlettVurderingModal';
import { VurderingStatus, VurderingStatusTag } from 'components/periodisering/VurderingStatusTag';
import { AccordionsSignal } from 'hooks/AccordionSignalHook';
import { KelvinAlert } from 'components/alert/KelvinAlert';

interface Props {
  initiellEkspandert: boolean;
  fraDato: Date | null;
  nestePeriodeFraDato: Date | null;
  isLast: boolean;
  finnesFeil: boolean;
  vurderingStatus: VurderingStatus | undefined;
  vurdering: VurderingFormMeta;
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
        <HStack justify={'space-between'} padding={'space-8'}>
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
      <VStack gap={'space-20'}>
        <HGrid columns={'1fr 30px'}>
          <VStack gap={'space-20'}>
            {vurdering.behøverVurdering && (
              <KelvinAlert
                variant={'info'}
              >{`Perioden fra ${fraDato ? formatDatoMedMånedsnavn(fraDato) : ''} mangler vurdering og må vurderes.`}</KelvinAlert>
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

        <VStack align="end">
          <VurdertAvAnsattDetail vurdertAv={vurdering.vurderingerMeta?.vurdertAv} variant={'VURDERING'} />
          <VurdertAvAnsattDetail vurdertAv={vurdering.vurderingerMeta?.kvalitetssikretAv} variant={'KVALITETSSIKRER'} />
          <VurdertAvAnsattDetail vurdertAv={vurdering.vurderingerMeta?.besluttetAv} variant={'BESLUTTER'} />
        </VStack>
      </VStack>
    </CustomExpandableCard>
  );
};

export function skalVæreInitiellEkspandert(erNyVurdering: boolean | undefined, erAktiv: boolean): boolean {
  return erNyVurdering === true || erAktiv;
}
