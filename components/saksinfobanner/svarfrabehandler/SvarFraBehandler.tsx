'use client';

import { BodyLong, BodyShort, Box, Button, HStack, Tag, VStack } from '@navikt/ds-react';
import { FirstAidKitIcon } from '@navikt/aksel-icons';
import { useMottattDokumenterLest } from 'hooks/FetchHook';

import { TagMedPopover } from 'components/tagmedpopover/TagMedPopover';
import styles from 'components/saksinfobanner/svarfrabehandler/SvarFraBehandler.module.css';
import { Alert } from 'components/alert/Alert';

interface SvarFraBehandlerProps {
  behandlingReferanse: string;
  oppdaterVisHarUlesteDokumenter: (value: ((prevState: boolean) => boolean) | boolean) => void;
}

export const SvarFraBehandler = ({ behandlingReferanse, oppdaterVisHarUlesteDokumenter }: SvarFraBehandlerProps) => {
  const { mottattDokumenterLest, isLoading, error } = useMottattDokumenterLest();

  return (
    <TagMedPopover
      ikon={<FirstAidKitIcon title={'Mottatt svar fra behandler'} />}
      dataColor={'meta-purple'}
      størrelse={'small'}
      tagContent={'Svar fra behandler'}
      popoverContent={
        <Box maxWidth={'400px'} minWidth={'400px'}>
          <VStack gap={'space-0'}>
            <Tag data-color="meta-purple" icon={<FirstAidKitIcon />} variant={'moderate'} size={'medium'} className={styles.tag}>
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
      }
    />
  );
};
