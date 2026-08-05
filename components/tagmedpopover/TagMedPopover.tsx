'use client';

import { Button, Popover, Tag, TagProps } from '@navikt/ds-react';
import { ReactNode, useRef, useState } from 'react';

import styles from 'components/tagmedpopover/TagMedPopover.module.css';

interface Props {
  ikon: ReactNode;
  dataColor: TagProps['data-color'];
  popoverContent: ReactNode;
  størrelse?: 'xsmall' | 'small';
  tagContent?: ReactNode;
}

/**
 * Delt komponent for en klikkbar Tag som åpner en Popover.
 * Wrapper en Tag i en Button for å beholde riktig tastatur-/skjermleser-oppførsel,
 * mens Tag står for selve den visuelle stilen (farge, radius osv.).
 */
export const TagMedPopover = ({ ikon, dataColor, størrelse = 'xsmall', tagContent = '', popoverContent }: Props) => {
  const buttonRef = useRef(null);
  const [popoverIsOpen, setPopoverIsOpen] = useState(false);

  return (
    <>
      <Button
        ref={buttonRef}
        variant={'tertiary'}
        onClick={() => setPopoverIsOpen(!popoverIsOpen)}
        className={styles.knapp}
      >
        <Tag icon={ikon} variant={'moderate'} data-color={dataColor} size={størrelse} className={styles.triggerTag}>
          {tagContent}
        </Tag>
      </Button>
      <Popover
        onClose={() => setPopoverIsOpen(false)}
        open={popoverIsOpen}
        anchorEl={buttonRef.current}
        placement={'bottom-end'}
        offset={8}
      >
        {popoverContent}
      </Popover>
    </>
  );
};
