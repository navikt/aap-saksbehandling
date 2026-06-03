'use client';

import { CustomExpandableCard } from 'components/customexpandablecard/CustomExpandableCard';
import { isBefore, isSameDay, sub } from 'date-fns';
import { formatDatoMedMånedsnavn } from 'lib/utils/date';
import { useState } from 'react';
import { BodyShort, HStack, Tag, VStack } from '@navikt/ds-react';
import styles from 'components/behandlinger/oppholdskrav/oppholdskrav.module.css';
import { KelvinAlert } from 'components/alert/KelvinAlert';

interface Props {
  fom: Date;
  tom: Date | null | undefined;
  foersteNyePeriodeFraDato: Date | null | undefined;
  alertMelding: string;
}

export const IkkeVurderbarPeriode = ({ fom, tom, foersteNyePeriodeFraDato, alertMelding }: Props) => {
  const [cardExpanded, setCardExpanded] = useState<boolean>(false);
  const nySluttdato =
    foersteNyePeriodeFraDato &&
    (tom == null || isBefore(foersteNyePeriodeFraDato, tom) || isSameDay(foersteNyePeriodeFraDato, tom));

  return (
    <CustomExpandableCard
      editable={false}
      disabled={true}
      expanded={cardExpanded}
      setExpanded={setCardExpanded}
      heading={
        <HStack justify={'space-between'} padding={'space-8'}>
          <BodyShort size={'small'} className={''}>
            {formatDatoMedMånedsnavn(fom)} –{' '}
            {tom != null && (
              <span className={nySluttdato ? styles.streketUtTekst : ''}>{formatDatoMedMånedsnavn(tom)}</span>
            )}
            {nySluttdato && <span> {formatDatoMedMånedsnavn(sub(foersteNyePeriodeFraDato, { days: 1 }))}</span>}
          </BodyShort>
          <Tag data-color="neutral" size="xsmall" variant={'moderate'}>
            Ikke relevant
          </Tag>
        </HStack>
      }
    >
      <VStack>
        <KelvinAlert variant={'info'} className={'fit-content'}>
          {alertMelding}
        </KelvinAlert>
      </VStack>
    </CustomExpandableCard>
  );
};
