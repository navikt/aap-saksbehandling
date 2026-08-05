'use client';

import { FirstAidKitIcon } from '@navikt/aksel-icons';
import { BodyLong, BodyShort, Box, Button, Detail, Popover, Tag, VStack } from '@navikt/ds-react';
import { useRef, useState } from 'react';

import styles from 'components/oppgaveliste/svarfrabehandler/SvarFraBehandler.module.css';

interface Props {
  dokumenttype: 'Melding eller tilleggsopplysninger' | 'Legeerklæring' | 'Dokument';
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
        <Box maxWidth={'400px'} minWidth={'400px'}>
          <VStack gap={'space-0'}>
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
            <Box padding={'space-8'}>
              <Detail textColor="subtle">Dokumenttype</Detail>
              <BodyLong size={'small'}>{dokumenttype}</BodyLong>
            </Box>
          </VStack>
        </Box>
      </Popover>
    </>
  );
};
