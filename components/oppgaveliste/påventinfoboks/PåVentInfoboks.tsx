'use client';

import { SettPåVentÅrsaker } from 'lib/types/types';
import { BodyShort, Button, Detail, Popover, Tag, VStack } from '@navikt/ds-react';
import { mapTilVenteÅrsakTekst } from 'lib/utils/oversettelser';
import { useRef, useState } from 'react';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { HourglassTopFilledIcon } from '@navikt/aksel-icons';
import styles from './PåVentInfoboks.module.css';

interface Props {
  frist: string;
  årsak?: string | null;
}

export const PåVentInfoboks = ({ frist, årsak }: Props) => {
  const buttonRef = useRef(null);
  const [vis, setVis] = useState(false);

  const forskjellIMillisekunder = new Date(frist).getTime() - new Date().getTime();

  const forskjellIDager = forskjellIMillisekunder / (1000 * 60 * 60 * 24);
  return (
    <>
      <Button
        icon={<HourglassTopFilledIcon />}
        className={styles.knapp}
        onClick={() => setVis(!vis)}
        ref={buttonRef}
        size="xsmall"
      />
      <Popover
        onClose={() => setVis(vis)}
        open={vis}
        anchorEl={buttonRef.current}
        arrow={false}
        placement={'bottom-end'}
        offset={8}
      >
        <VStack width={'400px'} gap={'2'} className={styles.boks}>
          <Tag icon={<HourglassTopFilledIcon />} variant={'warning-moderate'} size={'medium'} className={styles.tag}>
            <BodyShort size={'small'} weight={'semibold'}>
              På vent
            </BodyShort>
          </Tag>
          <VStack gap={'1'}>
            <Detail textColor="subtle">Frist</Detail>
            <div>
              {formaterDatoForFrontend(frist)} ({forskjellIDager.toFixed(0)} dager igjen)
            </div>
          </VStack>
          {årsak ? (
            <VStack gap={'1'}>
              <Detail textColor="subtle">Årsak</Detail>

              <div>{mapTilVenteÅrsakTekst(årsak as SettPåVentÅrsaker)}</div>
            </VStack>
          ) : undefined}
        </VStack>
      </Popover>
    </>
  );
};
