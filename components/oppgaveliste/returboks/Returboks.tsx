'use client';

import { Oppgave, ReturStatus } from 'lib/types/types';
import { BodyShort, Button, Popover, Tag, VStack } from '@navikt/ds-react';
import { useRef, useState } from 'react';
import { ArrowsSquarepathIcon } from '@navikt/aksel-icons';
import styles from './Returboks.module.css';
import { exhaustiveCheck } from 'lib/utils/typescript';
import { NoNavAapOppgaveOppgaveDtoReturStatus } from '@navikt/aap-oppgave-typescript-types';

interface Props {
  oppgave: Oppgave;
}

function returStatusTilTekst(status: ReturStatus): string {
  switch (status) {
    case NoNavAapOppgaveOppgaveDtoReturStatus.RETUR_FRA_BESLUTTER:
      return 'Retur fra beslutter';
    case NoNavAapOppgaveOppgaveDtoReturStatus.RETUR_FRA_KVALITETSSIKRER:
      return 'Retur fra kvalitetssikrer';
    default:
      exhaustiveCheck(status);
  }
}

export const Returboks = ({ oppgave }: Props) => {
  const buttonRef = useRef(null);
  const [vis, setVis] = useState(false);

  return (
    <>
      <Button
        icon={<ArrowsSquarepathIcon title={'På vent'} />}
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
              {returStatusTilTekst(oppgave.returStatus!!)}
            </BodyShort>
          </Tag>
        </VStack>
      </Popover>
    </>
  );
};
