'use client';

import { BodyShort, Button, Popover, Tag, VStack } from '@navikt/ds-react';
import { useRef, useState } from 'react';
import { FirstAidKitIcon } from '@navikt/aksel-icons';
import styles from './LegeerklæringInfoboks.module.css';

export const LegeerklæringInfoboks = () => {
  const buttonRef = useRef(null);
  const [vis, setVis] = useState(false);

  return (
    <>
      <Button
        icon={<FirstAidKitIcon />}
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
          <Tag icon={<FirstAidKitIcon />} variant={'warning-moderate'} size={'medium'} className={styles.tag}>
            <BodyShort size={'small'} weight={'semibold'}>
              Svar fra behandler
            </BodyShort>
          </Tag>
        </VStack>
      </Popover>
    </>
  );
};
