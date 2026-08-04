'use client';

import {
  NoNavAapOppgaveReturInformasjonDtoRsaker,
  NoNavAapOppgaveReturInformasjonDtoStatus as ReturStatus,
} from '@navikt/aap-oppgave-typescript-types';
import { ArrowsSquarepathIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, Detail, Popover, Tag, VStack } from '@navikt/ds-react';
import { OppgaveMedKontekst, ReturInformasjon } from 'lib/types/oppgaveTypes';
import { mapGrunnTilString } from 'lib/utils/oversettelser';
import { storForbokstav } from 'lib/utils/string';
import React, { useRef, useState } from 'react';

import { returStatusTilTekst } from 'components/oppgaveliste/returboks/ReturInfoUtils';

import styles from './Returboks.module.css';

interface Props {
  returInformasjon: ReturInformasjon;
  forrigeKvalitetssikrerInfo: OppgaveMedKontekst['oppgavelisteTags']['forrigeKvalitetssikrerInfo'];
}

function årsakerTilString(årsaker: NoNavAapOppgaveReturInformasjonDtoRsaker[]): string {
  if (årsaker.length === 0) {
    return 'Ingen årsaker.';
  }

  return (
    årsaker
      ?.map((årsak, idx) => {
        const grunn = mapGrunnTilString(årsak);
        if (idx == 0) {
          return grunn;
        } else {
          return storForbokstav(grunn);
        }
      })
      ?.join(', ') + '.'
  );
}

export const Returboks = ({ returInformasjon, forrigeKvalitetssikrerInfo }: Props) => {
  const buttonRef = useRef(null);
  const [vis, setVis] = useState(false);

  const årsakTekst = returInformasjon.årsaker.length <= 1 ? 'Årsak' : 'Årsaker';
  const returFraToTrinn =
    returInformasjon.status == ReturStatus.RETUR_FRA_KVALITETSSIKRER ||
    returInformasjon.status == ReturStatus.RETUR_FRA_BESLUTTER;
  const skalViseForrigeKvalitetssikrer =
    returInformasjon.status == ReturStatus.RETUR_FRA_VEILEDER &&
    forrigeKvalitetssikrerInfo?.forrigeKvalitetssikrerIdent != null;

  function utledPopoverInnhold() {
    if (returFraToTrinn) {
      return (
        <VStack gap={'space-8'} className={styles.boks}>
          <Tag
            data-color="meta-purple"
            icon={<ArrowsSquarepathIcon />}
            variant={'moderate'}
            size={'medium'}
            className={styles.tag}
          >
            <BodyShort size={'small'} weight={'semibold'}>
              {returStatusTilTekst(returInformasjon.status)}
            </BodyShort>
          </Tag>
          <VStack gap={'space-0'}>
            <Detail textColor="subtle">{årsakTekst}</Detail>

            <div>{årsakerTilString(returInformasjon.årsaker)} </div>
          </VStack>
          <VStack gap={'space-0'}>
            <Detail textColor="subtle">Begrunnelse</Detail>

            <div>{returInformasjon.begrunnelse}</div>
          </VStack>
        </VStack>
      );
    } else if (skalViseForrigeKvalitetssikrer) {
      return (
        <VStack gap={'space-8'} className={styles.boks}>
          <Tag
            data-color="meta-purple"
            icon={<ArrowsSquarepathIcon />}
            variant={'moderate'}
            size={'medium'}
            className={styles.tag}
          >
            <BodyShort size={'small'} weight={'semibold'}>
              {returStatusTilTekst(returInformasjon.status)}
            </BodyShort>
          </Tag>
          <VStack gap={'space-0'}>
            <Detail textColor="subtle">Sist kvalitetssikret av</Detail>

            <div>
              {forrigeKvalitetssikrerInfo?.forrigeKvalitetssikrerNavn ??
                forrigeKvalitetssikrerInfo.forrigeKvalitetssikrerIdent}
            </div>
          </VStack>
        </VStack>
      );
    } else {
      return (
        <VStack className={styles.litenBoks}>
          <Tag
            data-color="meta-purple"
            icon={<ArrowsSquarepathIcon />}
            variant={'moderate'}
            size={'medium'}
            className={styles.tag}
          >
            <BodyShort size={'small'} weight={'semibold'}>
              {returStatusTilTekst(returInformasjon.status)}
            </BodyShort>
          </Tag>
        </VStack>
      );
    }
  }

  return (
    <>
      <Button ref={buttonRef} variant={'tertiary'} onClick={() => setVis(!vis)} className={styles.knapp}>
        <Tag
          icon={<ArrowsSquarepathIcon title={returStatusTilTekst(returInformasjon.status)} />}
          variant={'moderate'}
          data-color={'meta-purple'}
          size="xsmall"
          className={styles.triggerTag}
        >
          {''}
        </Tag>
      </Button>
      <Popover
        onClose={() => setVis(false)}
        open={vis}
        anchorEl={buttonRef.current}
        placement={'bottom-end'}
        offset={8}
      >
        {utledPopoverInnhold()}
      </Popover>
    </>
  );
};
