'use client';

import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { Alert, BodyShort, Button, HStack, VStack } from '@navikt/ds-react';
import styles from 'components/behandlinger/alder/Alder.module.css';
import { CheckmarkIcon, ExclamationmarkTriangleIcon } from '@navikt/aksel-icons';
import { AutomatiskLovvalgOgMedlemskapVurdering } from 'lib/types/types';
import { TilhørigetsVurderingTabell } from 'components/behandlinger/lovvalg/automatiskvurderingavlovvalgogmedlemskap/TilhørigetsVurderingTabell';
import { Dispatch, SetStateAction } from 'react';

interface Props {
  vurdering: AutomatiskLovvalgOgMedlemskapVurdering;
  setOverstyring: Dispatch<SetStateAction<boolean>>;
  visOverstyrKnapp?: boolean;
  visOverstyringsBehov?: boolean;
}
export const AutomatiskVurderingAvLovvalgOgMedlemskap = ({
  vurdering,
  setOverstyring,
  visOverstyrKnapp,
  visOverstyringsBehov,
}: Props) => {
  return (
    <VilkårsKort heading={'Automatisk vurdering av lovvalg og medlemskap'} steg={'VURDER_LOVVALG'}>
      <VStack gap={'7'} paddingBlock={'3'}>
        <div>
          <BodyShort spacing size={'small'} weight={'semibold'}>
            Indikasjoner på tilhørighet til Norge
          </BodyShort>

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
          <BodyShort spacing size={'small'} weight={'semibold'}>
            Indikasjoner på tilhørighet utenfor Norge
          </BodyShort>
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
        {visOverstyrKnapp && (
          <HStack>
            {visOverstyringsBehov ? (
              <Button variant={'secondary'} onClick={() => setOverstyring(false)}>
                Angre overstyring
              </Button>
            ) : (
              <Button variant={'secondary'} onClick={() => setOverstyring(true)}>
                Overstyr
              </Button>
            )}
          </HStack>
        )}
      </VStack>
    </VilkårsKort>
  );
};
