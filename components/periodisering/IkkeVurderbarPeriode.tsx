'use client';

import { CustomExpandableCard } from 'components/customexpandablecard/CustomExpandableCard';
import { isBefore, isSameDay, sub } from 'date-fns';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { useState } from 'react';
import { Alert, BodyShort, HStack, Tag, VStack } from '@navikt/ds-react';
import styles from 'components/behandlinger/oppholdskrav/oppholdskrav.module.css';

interface Props {
  fom: Date;
  tom: Date | null | undefined;
  foersteNyePeriodeFraDato: Date | null | undefined;
  alertMelding: string;
}

export const IkkeVurderbarPeriode = ({ fom, tom, foersteNyePeriodeFraDato, alertMelding }: Props) => {
  const [cardExpanded, setCardExpanded] = useState<boolean>(true);
  const formattertFom = formaterDatoForFrontend(fom);
  const nySluttdato =
    foersteNyePeriodeFraDato &&
    (tom == null || isBefore(foersteNyePeriodeFraDato, tom) || isSameDay(foersteNyePeriodeFraDato, tom));
  return (
    <CustomExpandableCard
      key={formattertFom}
      editable={false}
      disabled={true}
      expanded={cardExpanded}
      setExpanded={setCardExpanded}
      heading={
        <HStack justify={'space-between'} padding={'2'}>
          <BodyShort size={'small'} className={''}>
            {formaterDatoForFrontend(fom)} –{' '}
            {tom != null && (
              <span className={nySluttdato ? styles.streketUtTekst : ''}>{formaterDatoForFrontend(tom)}</span>
            )}
            {nySluttdato && <span> {formaterDatoForFrontend(sub(foersteNyePeriodeFraDato, { days: 1 }))}</span>}
          </BodyShort>
          <Tag size="xsmall" variant={'neutral-moderate'}>
            Ikke relevant
          </Tag>
        </HStack>
      }
    >
      <VStack>
        <Alert size="small" variant={'info'} className={'fit-content'}>
          {alertMelding}
        </Alert>
      </VStack>
    </CustomExpandableCard>
  );
};
