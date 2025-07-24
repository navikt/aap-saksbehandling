import React, { useRef, useState } from 'react';
import { BodyShort, Button, Detail, Popover, Tag, VStack } from '@navikt/ds-react';
import styles from './MarkeringInfoBoks.module.css';
import { clientFjernMarkeringForBehandling } from 'lib/clientApi';
import { Markering, MarkeringType } from 'lib/types/oppgaveTypes';
import { BookIcon, ExclamationmarkTriangleIcon } from '@navikt/aksel-icons';
import { NoNavAapOppgaveMarkeringMarkeringDtoMarkeringType } from '@navikt/aap-oppgave-typescript-types';

interface Props {
  markering: Markering;
  referanse?: string | null;
  showLabel?: boolean;
  size?: 'small' | 'xsmall';
}

export const MarkeringInfoboks = ({ markering, referanse, showLabel = false, size = 'small' }: Props) => {
  const tagRef = useRef(null);
  const [visInfo, setVisInfo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [visTag, setVisTag] = useState(true);

  return (
    <>
      {visTag && (
        <Tag
          className={styles.tag}
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
        onClose={() => setVisInfo(visInfo)}
        open={visInfo}
        anchorEl={tagRef.current}
        arrow={false}
        placement={'bottom-end'}
        offset={8}
      >
        <VStack gap={'2'} className={styles.boks}>
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
            <VStack gap={'0'}>
              <Detail textColor="subtle">Begrunnelse</Detail>
              <div>{markering.begrunnelse}</div>
            </VStack>
          ) : undefined}

          {referanse && visTag && (
            <VStack gap={'0'} align={'end'}>
              <Button
                variant={'secondary'}
                loading={isLoading}
                onClick={async () => {
                  setIsLoading(true);
                  const res = await clientFjernMarkeringForBehandling(referanse, markering);
                  if (res.type === 'SUCCESS') {
                    setVisInfo(false);
                    setVisTag(false);
                  }
                  setIsLoading(false);
                }}
              >
                Fjern markering
              </Button>
            </VStack>
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
    default:
      return 'Haster';
  }
}

function ikonForMarkeringType(type: MarkeringType) {
  switch (type) {
    case 'HASTER':
      return <ExclamationmarkTriangleIcon />;
    case 'KREVER_SPESIALKOMPETANSE':
      return <BookIcon />;
  }
}

function variantFraType(type: MarkeringType) {
  switch (type) {
    case 'HASTER':
      return 'error-moderate';
    case 'KREVER_SPESIALKOMPETANSE':
      return 'alt1-moderate';

    default:
      return 'error-moderate';
  }
}