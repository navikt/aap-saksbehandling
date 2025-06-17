'use client';

import { Button, Detail, ExpansionCard, HStack, VStack } from '@navikt/ds-react';
import { StegType, VurdertAvAnsatt } from 'lib/types/types';
import { FormEvent, ReactNode } from 'react';
import { LøsBehovOgGåTilNesteStegStatus } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { ApiException } from 'lib/utils/api';
import { LøsBehovOgGåTilNesteStegStatusAlert } from 'components/løsbehovoggåtilnestestegstatusalert/LøsBehovOgGåTilNesteStegStatusAlert';
import { formaterDatoForFrontend } from 'lib/utils/date';

import styles from 'components/vilkårskort/VilkårsKort.module.css';
import { useRequiredFlyt } from 'hooks/FlytHook';

interface Props {
  heading: string;
  steg: StegType;
  children: ReactNode;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  status: LøsBehovOgGåTilNesteStegStatus;
  visBekreftKnapp: boolean;
  løsBehovOgGåTilNesteStegError?: ApiException;
  knappTekst?: string;
  defaultOpen?: boolean;
  vilkårTilhørerNavKontor: boolean;
  vurdertAvAnsatt?: VurdertAvAnsatt;
}

export const VilkårsKortMedForm = ({
  heading,
  steg,
  children,
  onSubmit,
  isLoading,
  status,
  løsBehovOgGåTilNesteStegError,
  vilkårTilhørerNavKontor,
  knappTekst = 'Bekreft',
  defaultOpen = true,
  visBekreftKnapp,
  vurdertAvAnsatt,
}: Props) => {
  const classNameBasertPåEnhet = vilkårTilhørerNavKontor ? styles.vilkårsKortNAV : styles.vilkårsKortNAY;
  const { flyt } = useRequiredFlyt();
  const erAktivtSteg = flyt.aktivtSteg === steg;

  return (
    <ExpansionCard
      aria-label={heading}
      className={erAktivtSteg ? classNameBasertPåEnhet : styles.vilkårsKort}
      size={'small'}
      defaultOpen={defaultOpen}
      id={steg}
    >
      <ExpansionCard.Header className={styles.header}>
        <div className={styles.title}>
          <ExpansionCard.Title size={'small'} data-testid="vilkår-heading">
            {heading}
          </ExpansionCard.Title>
        </div>
      </ExpansionCard.Header>
      <ExpansionCard.Content className={styles.content}>
        <form onSubmit={onSubmit} id={steg} autoComplete={'off'}>
          <VStack gap={'4'}>
            {children}
            <LøsBehovOgGåTilNesteStegStatusAlert
              løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
              status={status}
            />
            <HStack justify={'space-between'} align={'end'}>
              <div>{visBekreftKnapp && <Button loading={isLoading}>{knappTekst}</Button>}</div>

              {vurdertAvAnsatt && (
                <Detail>
                  {`Vurdert av ${utledVurdertAv(vurdertAvAnsatt)} (${utledEnhetsnavn(vurdertAvAnsatt, vilkårTilhørerNavKontor)}), ${formaterDatoForFrontend(vurdertAvAnsatt.dato)}`}
                </Detail>
              )}
            </HStack>
          </VStack>
        </form>
      </ExpansionCard.Content>
    </ExpansionCard>
  );
};

function utledVurdertAv(vurdertAvAnsatt: VurdertAvAnsatt): string {
  return vurdertAvAnsatt.ansattnavn ? vurdertAvAnsatt.ansattnavn : vurdertAvAnsatt.ident;
}

function utledEnhetsnavn(vurdertAvAnsatt: VurdertAvAnsatt, vilkårTilhøreNavKontor: boolean): string {
  if (!vurdertAvAnsatt.enhetsnavn) {
    return vilkårTilhøreNavKontor ? 'Nav kontor' : 'Nay';
  } else {
    return vurdertAvAnsatt.enhetsnavn;
  }
}
