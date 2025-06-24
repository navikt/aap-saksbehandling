'use client';

import { Oppgave, ReturStatus } from 'lib/types/types';
import { BodyShort, Button, Detail, Popover, Tag, VStack } from '@navikt/ds-react';
import { useRef, useState } from 'react';
import { ArrowsSquarepathIcon } from '@navikt/aksel-icons';
import styles from './Returboks.module.css';
import { exhaustiveCheck } from 'lib/utils/typescript';
import {
  NoNavAapOppgaveReturInformasjonRsaker,
  NoNavAapOppgaveReturInformasjonStatus,
} from '@navikt/aap-oppgave-typescript-types';
import { mapGrunnTilString } from 'lib/utils/oversettelser';
import { storForbokstav } from 'lib/utils/string';

interface Props {
  oppgave: Oppgave;
}

function returStatusTilTekst(status: ReturStatus): string {
  switch (status) {
    case NoNavAapOppgaveReturInformasjonStatus.RETUR_FRA_BESLUTTER:
      return 'Retur fra beslutter';
    case NoNavAapOppgaveReturInformasjonStatus.RETUR_FRA_KVALITETSSIKRER:
      return 'Retur fra kvalitetssikrer';
    default:
      exhaustiveCheck(status);
  }
}

function årsakerTilString(årsaker: NoNavAapOppgaveReturInformasjonRsaker[]): string {
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

export const Returboks = ({ oppgave: { returInformasjon: maybeReturInformasjon } }: Props) => {
  const returInformasjon = maybeReturInformasjon!!;
  const buttonRef = useRef(null);
  const [vis, setVis] = useState(false);

  const årsakTekst = returInformasjon.årsaker.length <= 1 ? 'Årsak' : 'Årsaker';

  return (
    <>
      <Button
        icon={<ArrowsSquarepathIcon title={returStatusTilTekst(returInformasjon.status)} />}
        className={styles.knapp}
        onClick={() => setVis(!vis)}
        ref={buttonRef}
        size="xsmall"
      />
      <Popover
        onClose={() => setVis(vis)}
        open={vis}
        anchorEl={buttonRef.current}
        arrow={false}
        placement={'bottom-end'}
        offset={8}
      >
        <VStack gap={'2'} className={styles.boks}>
          <Tag icon={<ArrowsSquarepathIcon />} variant={'warning-moderate'} size={'medium'} className={styles.tag}>
            <BodyShort size={'small'} weight={'semibold'}>
              {returStatusTilTekst(returInformasjon.status)}
            </BodyShort>
          </Tag>
          <VStack gap={'0'}>
            <Detail textColor="subtle">{årsakTekst}</Detail>

            <div>{årsakerTilString(returInformasjon.årsaker)} </div>
          </VStack>
          <VStack gap={'0'}>
            <Detail textColor="subtle">Begrunnelse</Detail>

            <div>{returInformasjon?.begrunnelse}</div>
          </VStack>
        </VStack>
      </Popover>
    </>
  );
};
