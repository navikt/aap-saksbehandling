'use client';

import { Button, Detail, ExpansionCard, HStack, VStack } from '@navikt/ds-react';
import { StegType } from 'lib/types/types';
import { FormEvent, ReactNode } from 'react';
import { LøsBehovOgGåTilNesteStegStatus } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { ApiException } from 'lib/utils/api';
import { LøsBehovOgGåTilNesteStegStatusAlert } from 'components/løsbehovoggåtilnestestegstatusalert/LøsBehovOgGåTilNesteStegStatusAlert';
import { formaterDatoForFrontend } from 'lib/utils/date';

import styles from 'components/vilkårskort/VilkårsKort.module.css';

interface Props {
  heading: string;
  steg: StegType;
  children: ReactNode;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  erAktivtSteg: boolean;
  status: LøsBehovOgGåTilNesteStegStatus;
  visBekreftKnapp: boolean;
  resetStatus?: () => void;
  løsBehovOgGåTilNesteStegError?: ApiException;
  knappTekst?: string;
  defaultOpen?: boolean;
  vilkårTilhørerNavKontor: boolean;
  vurdertAvAnsatt?: VurdertAvAnsatt;
}

interface VurdertAvAnsatt {
  ident: string;
  dato: string;
}

export const VilkårsKortMedForm = ({
  heading,
  steg,
  children,
  onSubmit,
  isLoading,
  status,
  resetStatus,
  løsBehovOgGåTilNesteStegError,
  vilkårTilhørerNavKontor,
  knappTekst = 'Bekreft',
  defaultOpen = true,
  visBekreftKnapp,
  vurdertAvAnsatt,
}: Props) => {
  const classNameBasertPåEnhet = vilkårTilhørerNavKontor ? styles.vilkårsKortNAV : styles.vilkårsKortNAY;

  return (
    <ExpansionCard
      aria-label={heading}
      // className={erAktivtSteg ? classNameBasertPåEnhet : styles.vilkårsKort} TODO Kommenter inn denne når vi har byttet ut alle Form komponenter med denne
      className={classNameBasertPåEnhet}
      size={'small'}
      defaultOpen={defaultOpen}
      id={steg}
    >
      <ExpansionCard.Header className={styles.header}>
        <div className={styles.title}>
          <ExpansionCard.Title size={'small'}>{heading}</ExpansionCard.Title>
        </div>
      </ExpansionCard.Header>
      <ExpansionCard.Content className={styles.content}>
        <form onSubmit={onSubmit} id={steg} autoComplete={'off'}>
          <VStack gap={'4'}>
            {children}
            <LøsBehovOgGåTilNesteStegStatusAlert
              løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
              status={status}
              resetStatus={resetStatus}
            />
            <HStack justify={'space-between'} align={'end'}>
              <div>{visBekreftKnapp && <Button loading={isLoading}>{knappTekst}</Button>}</div>

              {vurdertAvAnsatt && (
                <Detail>
                  {`Vurdert av ${vurdertAvAnsatt.ident} ${vilkårTilhørerNavKontor ? '(Nav kontor)' : '(Nay)'}, ${formaterDatoForFrontend(vurdertAvAnsatt.dato)}`}
                </Detail>
              )}
            </HStack>
          </VStack>
        </form>
      </ExpansionCard.Content>
    </ExpansionCard>
  );
};
