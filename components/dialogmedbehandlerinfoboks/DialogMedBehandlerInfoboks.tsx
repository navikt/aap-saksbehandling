'use client';

import { FirstAidKitIcon } from '@navikt/aksel-icons';
import { BodyShort, Detail, Tag, VStack } from '@navikt/ds-react';
import { TagMedPopover } from 'components/tagmedpopover/TagMedPopover';
import { ForespørselTilBehandler } from 'lib/types/oppgaveTypes';
import styles from './DialogMedBehandlerInfoboks.module.css';

interface Props {
  forespørsel: ForespørselTilBehandler;
}

export const DialogMedBehandlerInfoboks = ({ forespørsel }: Props) => {
  return (
    <TagMedPopover
      ikon={<FirstAidKitIcon title={mapTypeTilFullTekst(forespørsel.type)} />}
      dataColor={'meta-purple'}
      tagContent={mapTypeTilTekst(forespørsel.type)}
      popoverContent={
        <VStack gap={'space-8'} className={styles.boks}>
          <Tag
            data-color="meta-purple"
            icon={<FirstAidKitIcon />}
            variant={'moderate'}
            size={'medium'}
            className={styles.tag}
          >
            <BodyShort size={'small'} weight={'semibold'}>
              {mapTypeTilFullTekst(forespørsel.type)}
            </BodyShort>
          </Tag>
          <VStack>
            <Detail textColor="subtle">Påminnelse</Detail>
            <div>Her kommer det dato for når påminnelsen blir sendt ut</div>
          </VStack>
        </VStack>
      }
    />
  );
};

// TODO: Påminnelse sendt
const mapTypeTilTekst = (type: ForespørselTilBehandler['type']) => {
  switch (type) {
    case 'FORESPØRSEL_OPPRETTET':
      return 'Forespørsel sendt';
    case 'FORESPØRSEL_AVSLUTTET':
      return 'Svar mottatt';
    default:
      return '';
  }
};

// TODO: Påminnelse sendt
const mapTypeTilFullTekst = (type: ForespørselTilBehandler['type']) => {
  switch (type) {
    case 'FORESPØRSEL_OPPRETTET':
      return 'Forespørsel sendt til behandler';
    case 'FORESPØRSEL_AVSLUTTET':
      return 'Svar mottatt fra behandler';
    default:
      return '';
  }
};
