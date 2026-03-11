import { useRef, useState } from 'react';
import { BodyShort, Button, Detail, Popover, Tag, VStack } from '@navikt/ds-react';
import { HourglassBottomFilledIcon } from '@navikt/aksel-icons';
import styles from './UtløptVentefristBoks.module.css';
import { Dato } from 'lib/types/Dato';
import { mapTilVenteÅrsakTekst } from '../../../lib/utils/oversettelser';
import { SettPåVentÅrsaker } from '../../../lib/types/types';

interface Props {
  frist: string;
  årsak?: string | null;
  begrunnelse?: string | null;
}

export const UtløptVentefristBoks = ({ frist, årsak, begrunnelse }: Props) => {
  const buttonRef = useRef(null);
  const [vis, setVis] = useState(false);

  const fristDate = new Dato(frist).formaterForFrontend();

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
              {`Frist utløpt ${fristDate}`}
            </BodyShort>
          </Tag>
          {årsak ? (
            <VStack gap={'0'}>
              <Detail textColor="subtle">Årsak</Detail>
              <div>{mapTilVenteÅrsakTekst(årsak as SettPåVentÅrsaker)}</div>
            </VStack>
          ) : undefined}
          {begrunnelse ? (
            <VStack gap={'0'}>
              <Detail textColor="subtle">Begrunnelse</Detail>
              <div>{begrunnelse}</div>
            </VStack>
          ) : undefined}
        </VStack>
      </Popover>
    </>
  );
};
