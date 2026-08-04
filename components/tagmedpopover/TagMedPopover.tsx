'use client';

import { Button, Popover, Tag, TagProps } from '@navikt/ds-react';
import { ReactNode, useRef, useState } from 'react';

import styles from 'components/tagmedpopover/TagMedPopover.module.css';

interface Props {
  ikon: ReactNode;
  dataColor: TagProps['data-color'];
  størrelse?: 'xsmall' | 'small';
  tagContent?: ReactNode;
  popoverContent: ReactNode;
}

/**
 * Delt komponent for en klikkbar Tag som åpner en Popover.
 * Wrapper en Tag i en Button for å beholde riktig tastatur-/skjermleser-oppførsel,
 * mens Tag står for selve den visuelle stilen (farge, radius osv.).
 */
export const TagMedPopover = ({ ikon, dataColor, størrelse = 'xsmall', tagContent = '', popoverContent }: Props) => {
  const buttonRef = useRef(null);
  const [vis, setVis] = useState(false);

  return (
    <>
      <Button ref={buttonRef} variant={'tertiary'} onClick={() => setVis(!vis)} className={styles.knapp}>
        <Tag icon={ikon} variant={'moderate'} data-color={dataColor} size={størrelse} className={styles.triggerTag}>
          {tagContent}
        </Tag>
      </Button>
      <Popover
        onClose={() => setVis(false)}
        open={vis}
        anchorEl={buttonRef.current}
        placement={'bottom-end'}
        offset={8}
      >
        {popoverContent}
      </Popover>
    </>
  );
};
