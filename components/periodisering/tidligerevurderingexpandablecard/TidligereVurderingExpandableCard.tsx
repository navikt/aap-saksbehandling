'use client';

import { CustomExpandableCard } from 'components/customexpandablecard/CustomExpandableCard';
import { isBefore, isSameDay, sub } from 'date-fns';
import { formaterDatoForFrontend, parseDatoFraDatePicker } from 'lib/utils/date';
import { ReactNode } from 'react';
import { BodyShort, HStack, Tag, VStack } from '@navikt/ds-react';
import styles from 'components/behandlinger/oppholdskrav/oppholdskrav.module.css';
import { VurdertAvAnsatt } from 'lib/types/types';
import { VurdertAv } from 'components/vurdertav/VurdertAv';

interface Props {
  fom: Date;
  tom: Date | null | undefined;
  foersteNyePeriodeFraDato: string | null | undefined;
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
  const parsedFørsteNyePeriodeFraDato = foersteNyePeriodeFraDato
    ? parseDatoFraDatePicker(foersteNyePeriodeFraDato)
    : null;
  const formattertFom = formaterDatoForFrontend(fom);
  const strekUtHele = parsedFørsteNyePeriodeFraDato ? !isBefore(fom, parsedFørsteNyePeriodeFraDato) : false;
  const nySluttdato =
    !strekUtHele &&
    parsedFørsteNyePeriodeFraDato &&
    (tom == null || isBefore(parsedFørsteNyePeriodeFraDato, tom) || isSameDay(parsedFørsteNyePeriodeFraDato, tom));
  return (
    <CustomExpandableCard
      key={formattertFom}
      editable={false}
      defaultOpen={false}
      heading={
        <HStack justify={'space-between'} gap="12">
          <BodyShort size={'small'} className={strekUtHele ? styles.streketUtTekst : ''}>
            {formaterDatoForFrontend(fom)} –{' '}
            {tom != null && (
              <span className={nySluttdato ? styles.streketUtTekst : ''}>{formaterDatoForFrontend(tom)}</span>
            )}
            {nySluttdato && <span> {formaterDatoForFrontend(sub(parsedFørsteNyePeriodeFraDato, { days: 1 }))}</span>}
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
