'use client';

import { HourglassTopFilledIcon } from '@navikt/aksel-icons';
import { BodyShort, Detail, Tag, VStack } from '@navikt/ds-react';
import { SettPåVentÅrsaker, TilbakekrevingVenteÅrsaker } from 'lib/types/types';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { mapTilVenteÅrsakTekst } from 'lib/utils/oversettelser';

import { TagMedPopover } from 'components/tagmedpopover/TagMedPopover';

import styles from './PåVentInfoboks.module.css';

interface Props {
  frist: string;
  årsak?: string | null;
  begrunnelse?: string | null;
}

export const PåVentInfoboks = ({ frist, årsak, begrunnelse }: Props) => (
  <TagMedPopover
    ikon={<HourglassTopFilledIcon title={'Oppgave på vent'} />}
    dataColor={'warning'}
    tagContent={formaterDatoForFrontend(frist)}
    popoverContent={
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
    }
  />
);
