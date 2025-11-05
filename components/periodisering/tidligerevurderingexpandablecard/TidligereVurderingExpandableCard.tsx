'use client';

import { CustomExpandableCard } from 'components/customexpandablecard/CustomExpandableCard';
import { isBefore, isSameDay, sub } from 'date-fns';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { ReactNode, useState } from 'react';
import { BodyShort, HStack, Tag, VStack } from '@navikt/ds-react';
import styles from 'components/behandlinger/oppholdskrav/oppholdskrav.module.css';
import { VurdertAvAnsatt } from 'lib/types/types';
import { VurdertAv } from 'components/vurdertav/VurdertAv';

interface Props {
  fom: Date;
  tom: Date | null | undefined;
  foersteNyePeriodeFraDato: Date | null | undefined;
  oppfylt: boolean;
  vurdertAv?: VurdertAvAnsatt;
  children: ReactNode;
}
export const TidligereVurderingExpandableCard = ({
  fom,
  tom,
  foersteNyePeriodeFraDato,
  oppfylt,
  vurdertAv,
  children,
}: Props) => {
  const [cardExpanded, setCardExpanded] = useState<boolean>(true);
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
            {formaterDatoForFrontend(fom)} –{' '}
            {tom != null && (
              <span className={nySluttdato ? styles.streketUtTekst : ''}>{formaterDatoForFrontend(tom)}</span>
            )}
            {nySluttdato && <span> {formaterDatoForFrontend(sub(foersteNyePeriodeFraDato, { days: 1 }))}</span>}
          </BodyShort>
          {oppfylt !== null && (
            <Tag size="xsmall" variant={oppfylt ? 'success-moderate' : 'error-moderate'}>
              {oppfylt ? 'Oppfylt' : 'Ikke oppfylt'}
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
