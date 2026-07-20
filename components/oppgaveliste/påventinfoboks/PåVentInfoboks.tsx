'use client';

import { SettPåVentÅrsaker, TilbakekrevingVenteÅrsaker } from 'lib/types/types';
import { Button } from '@navikt/ds-react/Button';
import { Popover } from '@navikt/ds-react/Popover';
import { VStack } from '@navikt/ds-react/Stack';
import { Tag } from '@navikt/ds-react/Tag';
import { BodyShort, Detail } from '@navikt/ds-react/Typography';
import { mapTilVenteÅrsakTekst } from 'lib/utils/oversettelser';
import { useRef, useState } from 'react';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { HourglassTopFilledIcon } from '@navikt/aksel-icons';
import styles from './PåVentInfoboks.module.css';

interface Props {
  frist: string;
  årsak?: string | null;
  begrunnelse?: string | null;
}

export const PåVentInfoboks = ({ frist, årsak, begrunnelse }: Props) => {
  const buttonRef = useRef(null);
  const [vis, setVis] = useState(false);

  return (
    <>
      <Button
        icon={<HourglassTopFilledIcon title={'Oppgave på vent'} />}
        className={styles.knapp}
        onClick={() => setVis(!vis)}
        ref={buttonRef}
        size="xsmall"
      >
        {formaterDatoForFrontend(frist)}
      </Button>
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
            icon={<HourglassTopFilledIcon />}
            variant={'moderate'}
            size={'medium'}
            className={styles.tag}
          >
            <BodyShort size={'small'} weight={'semibold'}>
              På vent
            </BodyShort>
          </Tag>
          <VStack>
            <Detail textColor="subtle">Frist</Detail>
            <div>{formaterDatoForFrontend(frist)}</div>
          </VStack>
          {årsak ? (
            <VStack>
              <Detail textColor="subtle">Årsak</Detail>
              <div>{mapTilVenteÅrsakTekst(årsak as SettPåVentÅrsaker | TilbakekrevingVenteÅrsaker)}</div>
            </VStack>
          ) : undefined}
          {begrunnelse ? (
            <VStack>
              <Detail textColor="subtle">Begrunnelse</Detail>
              <div>{begrunnelse}</div>
            </VStack>
          ) : undefined}
        </VStack>
      </Popover>
    </>
  );
};
