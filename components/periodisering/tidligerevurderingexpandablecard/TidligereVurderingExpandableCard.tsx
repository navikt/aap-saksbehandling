'use client';

import { CustomExpandableCard } from 'components/customexpandablecard/CustomExpandableCard';
import { isBefore, isSameDay, sub } from 'date-fns';
import { formatDatoMedMånedsnavn, formaterDatoForFrontend } from 'lib/utils/date';
import { ReactNode, useState } from 'react';
import { BodyShort, HStack, VStack } from '@navikt/ds-react';
import styles from 'components/behandlinger/oppholdskrav/oppholdskrav.module.css';
import { VurdertAvAnsattDetail } from 'components/vurdertav/VurdertAvAnsattDetail';
import { VurdertAvAnsatt } from 'lib/types/types';
import { VurderingStatusTag } from 'components/periodisering/VurderingStatusTag';

interface Props {
  fom: Date;
  tom: Date | null | undefined;
  foersteNyePeriodeFraDato: Date | null | undefined;
  oppfylt: boolean | null | undefined;
  vurdertAv?: VurdertAvAnsatt;
  children: ReactNode;
  defaultCollapsed?: boolean;
}

export const TidligereVurderingExpandableCard = ({
  fom,
  tom,
  foersteNyePeriodeFraDato,
  oppfylt,
  vurdertAv,
  children,
  defaultCollapsed = false,
}: Props) => {
  const [cardExpanded, setCardExpanded] = useState<boolean>(defaultCollapsed);

  const formattertFom = formaterDatoForFrontend(fom);
  const strekUtHele = foersteNyePeriodeFraDato ? !isBefore(fom, foersteNyePeriodeFraDato) : false;
  const nySluttdato =
    !strekUtHele &&
    foersteNyePeriodeFraDato &&
    (tom == null || isBefore(foersteNyePeriodeFraDato, tom) || isSameDay(foersteNyePeriodeFraDato, tom));

  return (
    <CustomExpandableCard
      key={formattertFom}
      editable={false}
      expanded={cardExpanded}
      setExpanded={setCardExpanded}
      heading={
        <HStack justify={'space-between'} padding={'2'}>
          <BodyShort size={'small'} className={strekUtHele ? styles.streketUtTekst : ''}>
            {formatDatoMedMånedsnavn(fom)} –{' '}
            {tom != null && (
              <span className={nySluttdato ? styles.streketUtTekst : ''}>{formatDatoMedMånedsnavn(tom)}</span>
            )}
            {nySluttdato && <span> {formatDatoMedMånedsnavn(sub(foersteNyePeriodeFraDato, { days: 1 }))}</span>}
          </BodyShort>
          <VurderingStatusTag oppfylt={oppfylt} overskrevet={strekUtHele} />
        </HStack>
      }
    >
      <VStack>
        {children}
        <VurdertAvAnsattDetail variant={'VURDERING'} vurdertAv={vurdertAv} />
      </VStack>
    </CustomExpandableCard>
  );
};
