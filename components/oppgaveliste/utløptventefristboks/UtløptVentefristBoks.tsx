import { useRef, useState } from 'react';
import { BodyShort, Button, Popover, Tag, VStack } from '@navikt/ds-react';
import { HourglassBottomFilledIcon } from '@navikt/aksel-icons';
import styles from './UtløptVentefristBoks.module.css';
import { Dato } from 'lib/types/Dato';

interface Props {
  frist: string;
}

export const UtløptVentefristBoks = ({ frist }: Props) => {
  const buttonRef = useRef(null);
  const [vis, setVis] = useState(false);

  const fristDate = new Dato(frist).formaterForFrontend()

  return (
    <>
      <Button
        icon={<HourglassBottomFilledIcon title={'Ventefrist utløpt'} />}
        className={styles.knapp}
        onClick={() => setVis(!vis)}
        ref={buttonRef}
        size="xsmall"
      >
        {fristDate}
      </Button>
      <Popover
        onClose={() => setVis(false)}
        open={vis}
        anchorEl={buttonRef.current}
        arrow={false}
        placement={'bottom-end'}
        offset={8}
      >
        <VStack gap={'2'} className={styles.boks}>
          <Tag icon={<HourglassBottomFilledIcon />} variant={'warning-moderate'} size={'medium'} className={styles.tag}>
            <BodyShort size={'small'} weight={'semibold'}>
              {`Frist utløp ${fristDate}`}
            </BodyShort>
          </Tag>
        </VStack>
      </Popover>
    </>
  );
};
