'use client';

import { FirstAidKitIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, Popover, Tag, VStack } from '@navikt/ds-react';
import { useRef, useState } from 'react';

import styles from 'components/oppgaveliste/svarfrabehandler/SvarFraBehandler.module.css';

interface Props {
  dokumenttype: 'Dialogmelding' | 'Legeerklæring' | 'Dokument';
}

export const SvarFraBehandler = ({ dokumenttype }: Props) => {
  const buttonRef = useRef(null);
  const [vis, setVis] = useState(false);

  return (
    <>
      <Button
        icon={<FirstAidKitIcon title={'Mottatt svar fra behandler'} />}
        className={styles.knapp}
        onClick={() => setVis(!vis)}
        ref={buttonRef}
        size="xsmall"
      />
      <Popover
        onClose={() => setVis(false)}
        open={vis}
        anchorEl={buttonRef.current}
        placement={'bottom-end'}
        offset={8}
      >
        <VStack gap={'space-8'} className={styles.boks}>
          <Tag
            data-color="warning"
            icon={<FirstAidKitIcon />}
            variant={'moderate'}
            size={'medium'}
            className={styles.tag}
          >
            <BodyShort size={'small'} weight={'semibold'}>
              {dokumenttype}
            </BodyShort>
          </Tag>
        </VStack>
      </Popover>
    </>
  );
};
