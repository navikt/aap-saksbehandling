'use client';

import { FirstAidKitIcon } from '@navikt/aksel-icons';
import { BodyShort, Detail, Tag, VStack } from '@navikt/ds-react';

import styles from 'components/oppgaveliste/svarfrabehandler/SvarFraBehandler.module.css';
import { TagMedPopover } from 'components/tagmedpopover/TagMedPopover';

interface Props {
  dokumentType?: string;
}

export const SvarFraBehandler = ({ dokumentType }: Props) => (
  <TagMedPopover
    ikon={<FirstAidKitIcon title={'Mottatt svar fra behandler'} />}
    dataColor={'meta-purple'}
    tagContent={'Svar mottatt'}
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
            Svar mottatt fra behandler
          </BodyShort>
        </Tag>
        {dokumentType && (
          <VStack>
            <Detail textColor="subtle">Dokumenttype</Detail>
            <div>{mapDokumentTypeTilTekst(dokumentType)}</div>
          </VStack>
        )}
      </VStack>
    }
  />
);

const mapDokumentTypeTilTekst = (dokumentType: string) => {
  switch (dokumentType) {
    case 'LEGEERKLÆRING':
      return 'Legeerklæring';
    case 'DIALOGMELDING':
      return 'Melding eller tilleggsopplysninger';
    default:
      return 'Ukjent dokumenttype';
  }
};
