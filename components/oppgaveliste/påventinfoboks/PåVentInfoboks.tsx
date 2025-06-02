'use client';

import { SettPåVentÅrsaker } from 'lib/types/types';
import { BodyShort, Button, Detail, Popover, Tag, VStack } from '@navikt/ds-react';
import { mapTilVenteÅrsakTekst } from 'lib/utils/oversettelser';
import { useRef, useState } from 'react';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { HourglassTopFilledIcon } from '@navikt/aksel-icons';
import styles from './PåVentInfoboks.module.css';

interface Props {
  frist: string;
  årsak?: string | null;
  begrunnelse?: string | null;
}

export const PåVentInfoboks = ({ frist, årsak, begrunnelse }: Props) => {
  const buttonRef = useRef(null);
  const [vis, setVis] = useState(false);

  const forskjellIMillisekunder = new Date(frist).getTime() - new Date().getTime();

  const forskjellIDager = (forskjellIMillisekunder / (1000 * 60 * 60 * 24)).toFixed(0);
  const dagTekst = forskjellIDager == '1' ? 'dag' : 'dager';

  return (
    <>
      <Button
        icon={<HourglassTopFilledIcon title={'Oppgave på vent'} />}
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
        <VStack gap={'2'} className={styles.boks}>
          <Tag icon={<HourglassTopFilledIcon />} variant={'warning-moderate'} size={'medium'} className={styles.tag}>
            <BodyShort size={'small'} weight={'semibold'}>
              På vent
            </BodyShort>
          </Tag>
          <VStack gap={'0'}>
            <Detail textColor="subtle">Frist</Detail>
            <div>
              {formaterDatoForFrontend(frist)} ({forskjellIDager} {dagTekst} igjen)
            </div>
          </VStack>
          {årsak ? (
            <VStack gap={'0'}>
              <Detail textColor="subtle">Årsak</Detail>

              <div>{mapTilVenteÅrsakTekst(årsak as SettPåVentÅrsaker)}</div>
            </VStack>
          ) : undefined}
          {begrunnelse ? (
            <VStack gap={'0'}>
              <Detail textColor="subtle">Begrunnelse</Detail>
              <div>{begrunnelse}</div>
            </VStack>
          ) : undefined}
        </VStack>
      </Popover>
    </>
  );
};
