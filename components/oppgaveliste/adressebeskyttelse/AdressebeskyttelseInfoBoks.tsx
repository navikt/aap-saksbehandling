import { useRef, useState } from 'react';
import { BodyShort, Button, Popover, Tag, VStack } from '@navikt/ds-react';
import { ShieldLockIcon } from '@navikt/aksel-icons';
import styles from 'components/oppgaveliste/adressebeskyttelse/AdressebeskyttelseInfoBoks.module.css';

interface Props {
  adressebeskyttelseGrad: string;
}

export const AdressebeskyttelseInfoBoks = ({ adressebeskyttelseGrad }: Props) => {
  const buttonRef = useRef(null);
  const [vis, setVis] = useState(false);

  return (
    <>
      <Button
        icon={<ShieldLockIcon title={'Adressebeskyttelse Ikon'} />}
        className={styles.knapp}
        onClick={() => setVis(!vis)}
        ref={buttonRef}
        size="xsmall"
      />
      <Popover
        onClose={() => setVis(vis)}
        open={vis}
        anchorEl={buttonRef.current}
        arrow={false}
        placement={'bottom-end'}
        offset={8}
      >
        <VStack gap={'2'} className={styles.boks}>
          <Tag icon={<ShieldLockIcon />} variant={'warning-moderate'} size={'medium'} className={styles.tag}>
            <BodyShort size={'small'} weight={'semibold'}>
              {adressebeskyttelseGrad}
            </BodyShort>
          </Tag>
        </VStack>
      </Popover>
    </>
  );
};
