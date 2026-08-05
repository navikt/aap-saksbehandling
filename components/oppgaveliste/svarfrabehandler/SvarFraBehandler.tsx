'use client';

import { FirstAidKitIcon } from '@navikt/aksel-icons';
import { BodyShort, Tag, VStack } from '@navikt/ds-react';

import styles from 'components/oppgaveliste/svarfrabehandler/SvarFraBehandler.module.css';
import { TagMedPopover } from 'components/tagmedpopover/TagMedPopover';

export const SvarFraBehandler = () => (
  <TagMedPopover
    ikon={<FirstAidKitIcon title={'Mottatt svar fra behandler'} />}
    dataColor={'meta-purple'}
    popoverContent={
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
    }
  />
);
