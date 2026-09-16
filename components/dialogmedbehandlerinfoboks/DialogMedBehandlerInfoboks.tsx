'use client';

import { FirstAidKitIcon } from '@navikt/aksel-icons';
import { BodyShort, Detail, Tag, VStack } from '@navikt/ds-react';
import { TagMedPopover } from 'components/tagmedpopover/TagMedPopover';
import styles from './DialogMedBehandlerInfoboks.module.css';
import { formaterDatoForFrontend } from 'lib/utils/date';

interface Props {
  påminnelseDato?: string | null;
}

export const DialogMedBehandlerInfoboks = ({ påminnelseDato }: Props) => {
  return (
    <TagMedPopover
      ikon={<FirstAidKitIcon title={'Forespørsel sendt til behandler'} />}
      dataColor={'meta-purple'}
      tagContent={'Forespørsel sendt'}
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
              {'Forespørsel sendt til behandler'}
            </BodyShort>
          </Tag>
          {påminnelseDato && (
            <VStack>
              <Detail textColor="subtle">Påminnelse</Detail>
              <div>Sendes {formaterDatoForFrontend(påminnelseDato)}</div>
            </VStack>
          )}
        </VStack>
      }
    />
  );
};
