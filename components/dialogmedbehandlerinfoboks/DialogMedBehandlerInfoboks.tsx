'use client';

import { FirstAidKitIcon } from '@navikt/aksel-icons';
import { BodyShort, Detail, Tag, VStack } from '@navikt/ds-react';
import { TagMedPopover } from 'components/tagmedpopover/TagMedPopover';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { ForespørselSendtTilBehandler } from 'lib/types/oppgaveTypes';
import styles from './DialogMedBehandlerInfoboks.module.css';

const erPåminnelsenIFortiden = (påminnelseDato: ForespørselSendtTilBehandler['påminnelseDato']) => {
  if (!påminnelseDato) return false;
  return new Date(påminnelseDato).getTime() <= Date.now();
};

export const DialogMedBehandlerInfoboks = ({ påminnelseDato, påminnelseAvbrutt }: ForespørselSendtTilBehandler) => {
  if (!påminnelseDato) return null;

  const erPåminnelseSendt = erPåminnelsenIFortiden(påminnelseDato);

  return (
    <TagMedPopover
      ikon={
        <FirstAidKitIcon
          title={erPåminnelseSendt ? 'Påminnelse sendt til behandler' : 'Forespørsel sendt til behandler'}
        />
      }
      dataColor={'meta-purple'}
      tagContent={erPåminnelseSendt ? 'Påminnelse sendt' : 'Forespørsel sendt'}
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
              {erPåminnelseSendt ? 'Påminnelse sendt til behandler' : 'Forespørsel sendt til behandler'}
            </BodyShort>
          </Tag>
          <VStack>
            <Detail textColor="subtle">{erPåminnelseSendt ? 'Påminnelse sendt' : 'Påminnelse'}</Detail>
            {påminnelseAvbrutt ? (
              <div>Avbrutt</div>
            ) : erPåminnelseSendt ? (
              <div>{formaterDatoForFrontend(påminnelseDato)}</div>
            ) : (
              <div>Sendes {formaterDatoForFrontend(påminnelseDato)}</div>
            )}
          </VStack>
        </VStack>
      }
    />
  );
};
