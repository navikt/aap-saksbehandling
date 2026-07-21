'use client';

import { CustomExpandableCard } from 'components/customexpandablecard/CustomExpandableCard';
import { isBefore, isSameDay, sub } from 'date-fns';
import { formatDatoMedMånedsnavn, formaterDatoForFrontend } from 'lib/utils/date';
import { ReactNode, useState } from 'react';
import { HStack, VStack } from '@navikt/ds-react/Stack';
import { BodyShort } from '@navikt/ds-react/Typography';
import styles from 'components/behandlinger/oppholdskrav/oppholdskrav.module.css';
import { VurdertAvAnsattDetail } from 'components/vurdertav/VurdertAvAnsattDetail';
import { VurderingerMeta } from 'lib/types/types';
import { VurderingStatus, VurderingStatusTag } from 'components/periodisering/VurderingStatusTag';

interface Props {
  fom: Date;
  tom: Date | null | undefined;
  førsteNyePeriodeFraDato: Date | null | undefined;
  vurderingStatus: VurderingStatus | undefined;
  vurderingerMeta: VurderingerMeta;
  children: ReactNode;
  defaultCollapsed?: boolean;
}

export const TidligereVurderingExpandableCard = ({
  fom,
  tom,
  førsteNyePeriodeFraDato,
  vurderingStatus,
  vurderingerMeta,
  children,
  defaultCollapsed = false,
}: Props) => {
  const [cardExpanded, setCardExpanded] = useState<boolean>(defaultCollapsed);

  const formattertFom = formaterDatoForFrontend(fom);
  const strekUtHele = førsteNyePeriodeFraDato ? !isBefore(fom, førsteNyePeriodeFraDato) : false;
  const nySluttdato =
    !strekUtHele &&
    førsteNyePeriodeFraDato &&
    (tom == null || isBefore(førsteNyePeriodeFraDato, tom) || isSameDay(førsteNyePeriodeFraDato, tom));

  return (
    <CustomExpandableCard
      key={formattertFom}
      editable={false}
      expanded={cardExpanded}
      setExpanded={setCardExpanded}
      heading={
        <HStack justify={'space-between'} padding={'space-8'}>
          <BodyShort size={'small'} className={strekUtHele ? styles.streketUtTekst : ''}>
            {formatDatoMedMånedsnavn(fom)} –{' '}
            {tom != null && (
              <span className={nySluttdato ? styles.streketUtTekst : ''}>{formatDatoMedMånedsnavn(tom)}</span>
            )}
            {nySluttdato && <span> {formatDatoMedMånedsnavn(sub(førsteNyePeriodeFraDato, { days: 1 }))}</span>}
          </BodyShort>
          <VurderingStatusTag status={vurderingStatus} />
        </HStack>
      }
    >
      {children}
      <VStack align="end">
        <VurdertAvAnsattDetail vurdertAv={vurderingerMeta.vurdertAv} variant={'VURDERING'} />
        <VurdertAvAnsattDetail vurdertAv={vurderingerMeta.kvalitetssikretAv} variant={'KVALITETSSIKRER'} />
        <VurdertAvAnsattDetail vurdertAv={vurderingerMeta.besluttetAv} variant={'BESLUTTER'} />
      </VStack>
    </CustomExpandableCard>
  );
};
