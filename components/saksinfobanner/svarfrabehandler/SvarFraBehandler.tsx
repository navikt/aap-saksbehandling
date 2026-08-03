'use client';

import { FirstAidKitIcon } from '@navikt/aksel-icons';
import { BodyLong, BodyShort, Box, Button, Detail, HStack, Popover, Tag, VStack } from '@navikt/ds-react';
import { useMottattDokumenterLest } from 'hooks/FetchHook';
import { useRef, useState } from 'react';

import { Alert } from 'components/alert/Alert';
import styles from 'components/saksinfobanner/svarfrabehandler/SvarFraBehandler.module.css';

interface SvarFraBehandlerProps {
  behandlingReferanse: string;
  oppdaterVisHarUlesteDokumenter: (value: ((prevState: boolean) => boolean) | boolean) => void;
  dokumenttype: 'Melding eller tilleggsopplysninger' | 'Legeerklæring' | 'Dokument';
}

export const SvarFraBehandler = ({
  behandlingReferanse,
  oppdaterVisHarUlesteDokumenter,
  dokumenttype,
}: SvarFraBehandlerProps) => {
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
                {dokumenttype}
              </BodyShort>
            </Tag>
            <Box padding={'space-8'}>
              <Detail textColor="subtle">Dokumenttype</Detail>
              <BodyLong size={'small'}>{dokumenttype}</BodyLong>
              <BodyLong size={'small'}>
                Du finner svaret fra behandler i saksdokumenter. Marker som lest når du har gått gjennom innholdet.
              </BodyLong>
            </Box>
          </VStack>
          <Box borderWidth={'1'} borderColor={'neutral-subtle'} />
          {error && (
            <HStack padding={'space-8'} justify={'center'}>
              <Alert variant={'error'}>Kunne ikke markere dokument som lest</Alert>
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
