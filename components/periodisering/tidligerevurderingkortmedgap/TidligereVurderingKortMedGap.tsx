'use client';

import { CustomExpandableCard } from 'components/customexpandablecard/CustomExpandableCard';
import { isBefore, subDays } from 'date-fns';
import { formatDatoMedMånedsnavn, formaterDatoForFrontend } from 'lib/utils/date';
import { ReactNode, useState } from 'react';
import { BodyShort, HStack, VStack } from '@navikt/ds-react';
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

export const TidligereVurderingKortMedGap = ({
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

  // Håndterer både "krymping" (ny vurdering starter før/lik tom) og "gap" (ny vurdering starter etter tom,
  // f.eks. når et sammenhengende opphold utvides med en ny periode senere i tid).
  const skalJustereSluttdato = !strekUtHele && førsteNyePeriodeFraDato != null;
  const nySluttdato = skalJustereSluttdato;
  const visningsTom = skalJustereSluttdato ? subDays(førsteNyePeriodeFraDato, 1) : tom;

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
            {nySluttdato && visningsTom && <span> {formatDatoMedMånedsnavn(visningsTom)}</span>}
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
