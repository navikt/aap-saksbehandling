'use client';

import { Alert, BodyLong, BodyShort, Box, Button, HStack, Popover, Tag, VStack } from '@navikt/ds-react';
import { useRef, useState } from 'react';
import { FirstAidKitIcon } from '@navikt/aksel-icons';
import { useMottattDokumenterLest } from 'hooks/FetchHook';

import styles from 'components/saksinfobanner/svarfrabehandler/SvarFraBehandler.module.css';

interface SvarFraBehandlerProps {
  behandlingReferanse: string;
  oppdaterVisHarUlesteDokumenter: (value: ((prevState: boolean) => boolean) | boolean) => void;
}

export const SvarFraBehandler = ({ behandlingReferanse, oppdaterVisHarUlesteDokumenter }: SvarFraBehandlerProps) => {
  const buttonRef = useRef(null);
  const [vis, setVis] = useState(false);
  const { mottattDokumenterLest, isLoading, error } = useMottattDokumenterLest();

  return (
    <>
      <Button
        icon={<FirstAidKitIcon title={'Mottatt svar fra behandler'} />}
        className={styles.knapp}
        onClick={() => setVis(!vis)}
        ref={buttonRef}
        size="xsmall"
      >
        Svar fra behandler
      </Button>
      <Popover
        onClose={() => setVis(vis)}
        open={vis}
        anchorEl={buttonRef.current}
        arrow={false}
        placement={'bottom-end'}
        offset={8}
      >
        <Box maxWidth={'400px'} minWidth={'400px'}>
          <VStack gap={'0'}>
            <Tag icon={<FirstAidKitIcon />} variant={'warning-moderate'} size={'medium'} className={styles.tag}>
              <BodyShort size={'small'} weight={'semibold'}>
                Svar fra behandler
              </BodyShort>
            </Tag>
            <Box padding={'space-8'}>
              <BodyLong size={'small'}>
                Du finner svaret fra behandler i saksdokumenter. Marker som lest når du har gått gjennom innholdet.
              </BodyLong>
            </Box>
          </VStack>
          <Box borderWidth={'1'} borderColor={'border-divider'} />
          {error && (
            <HStack padding={'space-8'} justify={'center'}>
              <Alert size={'small'} variant={'error'}>
                Kunne ikke markere dokument som lest
              </Alert>
            </HStack>
          )}
          <HStack padding={'space-8'} justify={'end'}>
            <Button
              size={'small'}
              variant={'secondary'}
              onClick={() =>
                mottattDokumenterLest(behandlingReferanse).then((response) => {
                  if (response.ok) {
                    oppdaterVisHarUlesteDokumenter(false);
                  }
                })
              }
              loading={isLoading}
            >
              Marker som lest
            </Button>
          </HStack>
        </Box>
      </Popover>
    </>
  );
};
