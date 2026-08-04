import { ShieldLockIcon } from '@navikt/aksel-icons';
import { BodyShort, Popover, Tag, VStack } from '@navikt/ds-react';
import React, { useRef, useState } from 'react';

import styles from 'components/oppgaveliste/adressebeskyttelse/AdressebeskyttelseInfoBoks.module.css';

interface Props {
  adressebeskyttelseGrad: string;
}

export const AdressebeskyttelseInfoBoks = ({ adressebeskyttelseGrad }: Props) => {
  const buttonRef = useRef(null);
  const [vis, setVis] = useState(false);

  return (
    <>
      <Tag
        icon={<ShieldLockIcon title={'Adressebeskyttelse Ikon'} />}
        className={styles.knapp}
        onClick={() => setVis(!vis)}
        ref={buttonRef}
        size="xsmall"
        variant={'moderate'}
        data-color={'warning'}
      >
        {''}
      </Tag>
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
            icon={<ShieldLockIcon />}
            variant={'moderate'}
            size={'medium'}
            className={styles.tag}
          >
            <BodyShort size={'small'} weight={'semibold'}>
              {adressebeskyttelseGrad}
            </BodyShort>
          </Tag>
        </VStack>
      </Popover>
    </>
  );
};
