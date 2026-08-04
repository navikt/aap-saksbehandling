import { BodyShort, Detail, Tag, VStack } from '@navikt/ds-react';
import { HourglassBottomFilledIcon } from '@navikt/aksel-icons';
import styles from './UtløptVentefristBoks.module.css';
import { Dato } from 'lib/types/Dato';
import { mapTilVenteÅrsakTekst } from 'lib/utils/oversettelser';
import { SettPåVentÅrsaker } from 'lib/types/types';
import { TagMedPopover } from 'components/tagmedpopover/TagMedPopover';

interface Props {
  frist: string;
  årsak?: string | null;
  begrunnelse?: string | null;
}

export const UtløptVentefristBoks = ({ frist, årsak, begrunnelse }: Props) => {
  const fristDate = new Dato(frist).formaterForFrontend();

  return (
    <TagMedPopover
      ikon={<HourglassBottomFilledIcon title={'Ventefrist utløpt'} />}
      dataColor={'danger'}
      tagContent={fristDate}
      popoverContent={
        <VStack gap={'space-8'} className={styles.boks}>
          <Tag data-color="warning" icon={<HourglassBottomFilledIcon />} variant={'moderate'} size={'medium'} className={styles.tag}>
            <BodyShort size={'small'} weight={'semibold'}>
              {`Frist utløpt ${fristDate}`}
            </BodyShort>
          </Tag>
          {årsak ? (
            <VStack>
              <Detail textColor="subtle">Årsak</Detail>
              <div>{mapTilVenteÅrsakTekst(årsak as SettPåVentÅrsaker)}</div>
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
};
