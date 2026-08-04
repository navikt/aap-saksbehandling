import { ShieldLockIcon } from '@navikt/aksel-icons';
import { BodyShort, Tag, VStack } from '@navikt/ds-react';

import { TagMedPopover } from 'components/tagmedpopover/TagMedPopover';
import styles from 'components/oppgaveliste/adressebeskyttelse/AdressebeskyttelseInfoBoks.module.css';

interface Props {
  adressebeskyttelseGrad: string;
}

export const AdressebeskyttelseInfoBoks = ({ adressebeskyttelseGrad }: Props) => (
  <TagMedPopover
    ikon={<ShieldLockIcon title={'Adressebeskyttelse Ikon'} />}
    dataColor={'warning'}
    popoverContent={
      <VStack gap={'space-8'} className={styles.boks}>
        <Tag data-color="warning" icon={<ShieldLockIcon />} variant={'moderate'} size={'medium'} className={styles.tag}>
          <BodyShort size={'small'} weight={'semibold'}>
            {adressebeskyttelseGrad}
          </BodyShort>
        </Tag>
      </VStack>
    }
  />
);
