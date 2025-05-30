'use client';

import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { Alert, BodyShort, Button, HStack, VStack } from '@navikt/ds-react';
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
  console.log(vurdering);
  return (
    <VilkårsKort heading={'Automatisk vurdering av lovvalg og medlemskap'} steg={'VURDER_LOVVALG'}>
      <VStack gap={'7'} paddingBlock={'3'}>
        {!vurdering.kanBehandlesAutomatisk && (
          <Alert variant={'warning'} title={'Til manuell vurdering'} size={'small'} className={'fit-content'}>
            Opplysningene tilsier at det kan være utenlandsk lovvalg eller manglende medlemskap. Lovvalg og medlemskap
            må vurderes manuelt.
          </Alert>
        )}

        <div>
          <BodyShort spacing size={'small'} weight={'semibold'}>
            Indikasjoner på tilhørighet til Norge
          </BodyShort>

          <TilhørigetsVurderingTabell
            vurdering={vurdering.tilhørighetVurdering.filter((e) => e.indikasjon === 'I_NORGE')}
            oppfyllerOpplysningeneKraveneTekst={'Tilsier opplysningene at brukeren oppfyller kravene til medlemskap?'}
            oppfyllerOpplysningeneKravene={vurdering.tilhørighetVurdering
              .filter((e) => e.indikasjon === 'I_NORGE')
              .some((x) => x.resultat)}
          />
        </div>
        <div>
          <BodyShort spacing size={'small'} weight={'semibold'}>
            Indikasjoner på tilhørighet utenfor Norge
          </BodyShort>
          <TilhørigetsVurderingTabell
            vurdering={vurdering.tilhørighetVurdering.filter((e) => e.indikasjon === 'UTENFOR_NORGE')}
            oppfyllerOpplysningeneKraveneTekst={'Tilsier opplysningene at brukeren har tilhørighet til Norge?'}
            oppfyllerOpplysningeneKravene={vurdering.tilhørighetVurdering
              .filter((e) => e.indikasjon === 'UTENFOR_NORGE')
              .every((x) => !x.resultat)}
          />
        </div>

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
