'use client';

import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { Alert, Heading, VStack } from '@navikt/ds-react';
import styles from 'components/behandlinger/alder/Alder.module.css';
import { CheckmarkIcon, ExclamationmarkTriangleIcon } from '@navikt/aksel-icons';
import { AutomatiskLovvalgOgMedlemskapVurdering } from 'lib/types/types';
import { TilhørigetsVurderingTabell } from 'components/behandlinger/lovvalg/automatiskvurderingavlovvalgogmedlemskap/TilhørigetsVurderingTabell';
interface Props {
  vurdering: AutomatiskLovvalgOgMedlemskapVurdering;
}
export const AutomatiskVurderingForutgåendeMedlemskap = ({ vurdering }: Props) => {
  return (
    <VilkårsKort heading={'Automatisk vurdering av forutgående medlemskap'} steg={'VURDER_MEDLEMSKAP'}>
      <VStack gap={'5'}>
        <div>
          <Heading size={'small'}>Indikasjoner på tilhørighet til Norge</Heading>
          <TilhørigetsVurderingTabell
            resultatIkonTrue={
              <CheckmarkIcon title={'Indikerer at opplysning stemmer'} className={styles.oppfyltIcon} />
            }
            resultatIkonFalse={
              <ExclamationmarkTriangleIcon
                title={'Indikerer at opplysning ikke stemmer'}
                className={styles.avslåttIcon}
              />
            }
            vurdering={vurdering.tilhørighetVurdering.filter((e) => e.indikasjon === 'I_NORGE')}
          />
        </div>
        <div>
          <Heading size={'small'}>Indikasjoner på tilhørighet utenfor Norge</Heading>
          <TilhørigetsVurderingTabell
            resultatIkonTrue={
              <ExclamationmarkTriangleIcon title={'Indikerer at opplysning stemmer'} className={styles.avslåttIcon} />
            }
            resultatIkonFalse={
              <CheckmarkIcon title={'Indikerer at opplysning ikke stemmer'} className={styles.oppfyltIcon} />
            }
            vurdering={vurdering.tilhørighetVurdering.filter((e) => e.indikasjon === 'UTENFOR_NORGE')}
          />
        </div>
        {!vurdering.kanBehandlesAutomatisk && (
          <Alert variant={'warning'} title={'Til manuell vurdering'} size={'small'}>
            Opplysningene tilsier at det kan være utenlandsk lovvalg eller manglende medlemskap. Lovvalg og medlemskap
            må vurderes manuelt.
          </Alert>
        )}
      </VStack>
    </VilkårsKort>
  );
};
