'use client';

import { Button, Detail, ExpansionCard, HStack, VStack } from '@navikt/ds-react';
import { StegType, VurdertAvAnsatt } from 'lib/types/types';
import { FormEvent, ReactNode } from 'react';
import { LøsBehovOgGåTilNesteStegStatus } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { ApiException } from 'lib/utils/api';
import { LøsBehovOgGåTilNesteStegStatusAlert } from 'components/løsbehovoggåtilnestestegstatusalert/LøsBehovOgGåTilNesteStegStatusAlert';
import { formaterDatoForFrontend } from 'lib/utils/date';

import styles from 'components/vilkårskort/Vilkårskort.module.css';
import { useRequiredFlyt } from 'hooks/saksbehandling/FlytHook';
import { isProd } from 'lib/utils/environment';
import { VisningActions, VisningModus } from 'hooks/saksbehandling/visning/VisningHook';

export interface VilkårsKortMedFormProps {
  heading: string;
  steg: StegType;
  children: ReactNode;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  status: LøsBehovOgGåTilNesteStegStatus;
  løsBehovOgGåTilNesteStegError: ApiException | undefined;
  visBekreftKnapp: boolean; // TODO Denne kan mest sannsynlig slettes når ny visning kommer på plass
  readOnly?: boolean; // TODO Denne kan mest sannsynlig slettes når ny visning kommer på plass
  knappTekst?: string;
  defaultOpen?: boolean;
  vilkårTilhørerNavKontor: boolean;
  vurdertAvAnsatt?: VurdertAvAnsatt;
  vurdertAutomatisk?: boolean;
  kvalitetssikretAv?: VurdertAvAnsatt;
  visningModus?: VisningModus; // TODO Gjør disse feltene required når den er klar til å implementeres i vilkårskortene
  visningActions?: VisningActions; // TODO Gjør disse feltene required når den er klar til å implementeres i vilkårskortene
}

export const VilkårskortMedForm = ({
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
  vurdertAutomatisk = false,
  kvalitetssikretAv,
}: VilkårsKortMedFormProps) => {
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
              {visBekreftKnapp && <Button loading={isLoading}>{knappTekst}</Button>}

              <VStack align={'baseline'}>
                {vurdertAutomatisk && <Detail>Vurdert automatisk</Detail>}
                {vurdertAvAnsatt && (
                  <Detail>
                    {`Vurdert av ${utledVurdertAv(vurdertAvAnsatt)}, ${formaterDatoForFrontend(vurdertAvAnsatt.dato)}`}
                  </Detail>
                )}
                {kvalitetssikretAv && !isProd() && (
                  <Detail>
                    {`Kvalitetssikret av ${utledVurdertAv(kvalitetssikretAv)}, ${formaterDatoForFrontend(kvalitetssikretAv.dato)}`}
                  </Detail>
                )}
              </VStack>
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
