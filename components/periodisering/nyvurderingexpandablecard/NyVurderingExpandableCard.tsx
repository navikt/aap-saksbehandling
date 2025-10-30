'use client';

import { CustomExpandableCard } from 'components/customexpandablecard/CustomExpandableCard';
import { formaterDatoForFrontend, parseDatoFraDatePicker } from 'lib/utils/date';
import { ReactNode } from 'react';
import { BodyShort, HStack, Tag, VStack } from '@navikt/ds-react';
import { VurdertAvAnsatt } from 'lib/types/types';
import { VurdertAv } from 'components/vurdertav/VurdertAv';
import { parseDatoFraDatePickerOgTrekkFra1Dag } from 'components/behandlinger/oppholdskrav/oppholdskrav-utils';
import { JaEllerNei } from 'lib/utils/form';

interface Props {
  fraDato?: string;
  nestePeriodeFraDato: string | null | undefined;
  isLast: boolean;
  oppfylt: JaEllerNei | undefined | null;
  vurdertAv?: VurdertAvAnsatt;
  children: ReactNode;
}
export const NyVurderingExpandableCard = ({
  fraDato,
  nestePeriodeFraDato,
  isLast,
  oppfylt,
  vurdertAv,
  children,
}: Props) => {
  const fraDatoParsed = parseDatoFraDatePicker(fraDato);
  const tom = nestePeriodeFraDato ? parseDatoFraDatePickerOgTrekkFra1Dag(nestePeriodeFraDato) : null;
  return (
    <CustomExpandableCard
      key={fraDato}
      editable
      defaultOpen
      heading={
        <HStack justify={'space-between'} gap="12">
          <BodyShort size={'small'}>
            Ny vurdering: {fraDatoParsed ? `${formaterDatoForFrontend(fraDatoParsed)} – ` : '[Ikke valgt]'}
            {tom ? <span>{formaterDatoForFrontend(tom)}</span> : <span>{isLast ? ' ' : '[Ikke valgt]'}</span>}
          </BodyShort>
          {oppfylt && (
            <Tag size="xsmall" variant={oppfylt === JaEllerNei.Ja ? 'success-moderate' : 'error-moderate'}>
              {oppfylt === JaEllerNei.Ja ? 'Oppfylt' : 'Ikke oppfylt'}
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
