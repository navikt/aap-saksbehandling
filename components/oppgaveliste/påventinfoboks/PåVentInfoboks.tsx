'use client';

import { SettPåVentÅrsaker, TilbakekrevingVenteÅrsaker } from 'lib/types/types';
import { BodyShort, Button, Detail, Popover, Tag, VStack } from '@navikt/ds-react';
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

  const forskjellIMillisekunder = new Date(frist).getTime() - new Date().getTime();
  const erUtløpt = forskjellIMillisekunder < 0;

  const antallDager = Math.abs(Math.round(forskjellIMillisekunder / (1000 * 60 * 60 * 24)));
  const dagTekst = antallDager === 1 ? 'dag' : 'dager';
  const venteTekst = erUtløpt ? `${antallDager} ${dagTekst} siden` : `${antallDager} ${dagTekst} igjen`;

  return (
    <>
      <Button
        icon={<HourglassTopFilledIcon title={'Oppgave på vent'} />}
        className={erUtløpt ? styles.knappUtløpt : styles.knapp}
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
            data-color={erUtløpt ? 'danger' : 'warning'}
            icon={<HourglassTopFilledIcon />}
            variant={'moderate'}
            size={'medium'}
            className={styles.tag}
          >
            <BodyShort size={'small'} weight={'semibold'}>
              {erUtløpt ? 'Ventefrist utløpt' : 'På vent'}
            </BodyShort>
          </Tag>
          <VStack>
            <Detail textColor="subtle">Frist</Detail>
            <div>
              {formaterDatoForFrontend(frist)} ({venteTekst})
            </div>
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
