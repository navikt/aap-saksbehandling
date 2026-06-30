import React, { useRef, useState } from 'react';
import { BodyShort, Button, Detail, HStack, Popover, Tag, VStack } from '@navikt/ds-react';
import styles from './MarkeringInfoBoks.module.css';
import { clientOpprettMarkeringHendelse, MarkeringHendelseType } from 'lib/clientApi';
import { MarkeringType } from 'lib/types/oppgaveTypes';
import { BookIcon, ExclamationmarkTriangleIcon, XMarkOctagonIcon } from '@navikt/aksel-icons';
import { NoNavAapOppgaveMarkeringMarkeringDtoMarkeringType } from '@navikt/aap-oppgave-typescript-types';
import { isSuccess } from 'lib/utils/api';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { MarkeringDto } from 'lib/types/types';

interface Props {
  markering: MarkeringDto;
  referanse?: string | null;
  showLabel?: boolean;
  size?: 'small' | 'xsmall';
}

export const MarkeringInfoboks = ({ markering, referanse, showLabel = false, size = 'small' }: Props) => {
  const tagRef = useRef(null);
  const [visInfo, setVisInfo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [visTag, setVisTag] = useState(true);

  if (markering.hendelseType === 'FJERNET') {
    return null;
  }

  return (
    <>
      {visTag && (
        <Tag
          icon={ikonForMarkeringType(markering.markeringType)}
          variant={variantFraType(markering.markeringType)}
          size={size}
          ref={tagRef}
          onClick={() => setVisInfo(!visInfo)}
        >
          {showLabel && markeringTypeTilTekst(markering.markeringType)}
        </Tag>
      )}
      <Popover
        onClose={() => setVisInfo(false)}
        open={visInfo}
        anchorEl={tagRef.current}
        placement={'bottom-end'}
        offset={8}
      >
        <VStack gap={'space-8'} className={styles.boks}>
          <Tag
            icon={ikonForMarkeringType(markering.markeringType)}
            variant={variantFraType(markering.markeringType)}
            size={'medium'}
            className={
              markering.markeringType == NoNavAapOppgaveMarkeringMarkeringDtoMarkeringType.HASTER
                ? styles.hasterTag
                : styles.spesialkompetanseTag
            }
          >
            <BodyShort size={'small'} weight={'semibold'}>
              {markeringTypeTilTekst(markering.markeringType)}
            </BodyShort>
          </Tag>
          {markering.begrunnelse ? (
            <VStack gap={'space-0'}>
              <Detail textColor="subtle">Årsak</Detail>
              <div>{markering.begrunnelse}</div>
            </VStack>
          ) : undefined}
          {referanse && visTag && (
            <>
              <HStack align={'end'} justify={'end'} gap={'space-16'}>
                {markering.opprettetAvNavn && markering.opprettetTidspunkt && (
                  <Detail
                    textColor={'subtle'}
                  >{`Opprettet av ${markering.opprettetAvNavn} (${formaterDatoForFrontend(markering.opprettetTidspunkt)})`}</Detail>
                )}
                <VStack gap={'space-8'} align={'end'}>
                  <Button
                    variant={'secondary'}
                    size={'small'}
                    loading={isLoading}
                    onClick={async () => {
                      setIsLoading(true);
                      const res = await clientOpprettMarkeringHendelse(referanse, {
                        markeringType: markering.markeringType,
                        hendelseType: MarkeringHendelseType.FJERNET,
                      });
                      if (isSuccess(res)) {
                        setVisInfo(false);
                        setVisTag(false);
                      }
                      setIsLoading(false);
                    }}
                  >
                    Fjern markering
                  </Button>
                </VStack>
              </HStack>
            </>
          )}
        </VStack>
      </Popover>
    </>
  );
};

function markeringTypeTilTekst(type: MarkeringType): string {
  switch (type) {
    case 'HASTER':
      return 'Haster';
    case 'KREVER_SPESIALKOMPETANSE':
      return 'Krever spesialkompetanse';
    case 'AVSLAG_11_5':
      return 'Avslag § 11-5';
    default:
      return 'Haster';
  }
}

export function ikonForMarkeringType(type: MarkeringType) {
  switch (type) {
    case 'HASTER':
      return <ExclamationmarkTriangleIcon />;
    case 'KREVER_SPESIALKOMPETANSE':
      return <BookIcon />;
    case 'AVSLAG_11_5':
      return <XMarkOctagonIcon />;
  }
}

export function variantFraType(type: MarkeringType) {
  switch (type) {
    case 'HASTER':
      return 'error-moderate';
    case 'KREVER_SPESIALKOMPETANSE':
      return 'alt1-moderate';
    case 'AVSLAG_11_5':
      return 'alt1-moderate';

    default:
      return 'error-moderate';
  }
}
