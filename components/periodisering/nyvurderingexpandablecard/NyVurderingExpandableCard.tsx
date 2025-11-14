'use client';

import { CustomExpandableCard } from 'components/customexpandablecard/CustomExpandableCard';
import { formaterDatoForFrontend, parseDatoFraDatePicker } from 'lib/utils/date';
import { ReactNode, useState } from 'react';
import { BodyShort, HStack, Tag, VStack } from '@navikt/ds-react';
import { VurdertAvAnsatt } from 'lib/types/types';
import { VurdertAv } from 'components/vurdertav/VurdertAv';
import { parseDatoFraDatePickerOgTrekkFra1Dag } from 'components/behandlinger/oppholdskrav/oppholdskrav-utils';

interface Props {
  fraDato: string | undefined;
  nestePeriodeFraDato: string | null | undefined;
  isLast: boolean;
  oppfylt: boolean | undefined;
  vurdertAv: VurdertAvAnsatt | undefined;
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
  const fraDatoParsed = parseDatoFraDatePicker(fraDato);
  const tom = nestePeriodeFraDato ? parseDatoFraDatePickerOgTrekkFra1Dag(nestePeriodeFraDato) : null;
  const [cardExpanded, setCardExpanded] = useState<boolean>(true);
  return (
    <CustomExpandableCard
      key={fraDato}
      editable
      defaultOpen
      expanded={cardExpanded || finnesFeil}
      setExpanded={setCardExpanded}
      heading={
        <HStack justify={'space-between'} padding={'2'}>
          <BodyShort size={'small'}>
            Ny vurdering: {fraDatoParsed ? `${formaterDatoForFrontend(fraDatoParsed)} – ` : '[Ikke valgt]'}
            {tom ? <span>{formaterDatoForFrontend(tom)}</span> : <span>{isLast ? ' ' : '[Ikke valgt]'}</span>}
          </BodyShort>
          {oppfylt !== undefined && (
            <Tag size="xsmall" variant={oppfylt ? 'success-moderate' : 'error-moderate'}>
              {oppfylt === true ? 'Oppfylt' : 'Ikke oppfylt'}
            </Tag>
          )}
        </HStack>
      }
    >
      <VStack>
        {children}
        <VurdertAv vurdertAv={vurdertAv} />
      </VStack>
    </CustomExpandableCard>
  );
};
