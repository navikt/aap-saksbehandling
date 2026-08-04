'use client';

import { FirstAidKitIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, Popover, Tag, VStack } from '@navikt/ds-react';
import React, { useRef, useState } from 'react';

import styles from 'components/oppgaveliste/svarfrabehandler/SvarFraBehandler.module.css';

export const SvarFraBehandler = () => {
  const buttonRef = useRef(null);
  const [vis, setVis] = useState(false);

  return (
    <>
      <Button ref={buttonRef} variant={'tertiary'} onClick={() => setVis(!vis)} className={styles.knapp}>
        <Tag
          icon={<FirstAidKitIcon title={'Mottatt svar fra behandler'} />}
          variant={'moderate'}
          data-color={'meta-purple'}
          size="xsmall"
          className={styles.triggerTag}
        >
          {''}
        </Tag>
      </Button>
      <Popover
        onClose={() => setVis(false)}
        open={vis}
        anchorEl={buttonRef.current}
        placement={'bottom-end'}
        offset={8}
      >
        <VStack gap={'space-8'} className={styles.boks}>
          <Tag
            data-color="meta-purple"
            icon={<FirstAidKitIcon />}
            variant={'moderate'}
            size={'medium'}
            className={styles.tag}
          >
            <BodyShort size={'small'} weight={'semibold'}>
              Svar fra behandler
            </BodyShort>
          </Tag>
        </VStack>
      </Popover>
    </>
  );
};
