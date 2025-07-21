'use client';

import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { Alert, BodyShort, Button, Detail, HStack, VStack } from '@navikt/ds-react';
import { AutomatiskLovvalgOgMedlemskapVurdering } from 'lib/types/types';
import { TilhørigetsVurderingTabell } from 'components/behandlinger/lovvalg/automatiskvurderingavlovvalgogmedlemskap/TilhørigetsVurderingTabell';
import { Dispatch, SetStateAction } from 'react';

interface Props {
  vurdering: AutomatiskLovvalgOgMedlemskapVurdering;
  setOverstyring: Dispatch<SetStateAction<boolean>>;
  visOverstyrKnapp?: boolean;
  visOverstyringsBehov?: boolean;
  harYrkesskade: boolean;
}
export const AutomatiskVurderingForutgåendeMedlemskap = ({
  vurdering,
  setOverstyring,
  visOverstyrKnapp,
  visOverstyringsBehov,
  harYrkesskade,
}: Props) => {
  return (
    <VilkårsKort heading={'Automatisk vurdering av forutgående medlemskap'} steg={'VURDER_MEDLEMSKAP'}>
      <VStack gap={'5'}>
        {!vurdering.kanBehandlesAutomatisk && !harYrkesskade && (
          <Alert variant={'warning'} title={'Til manuell vurdering'} size={'small'} className={'fit-content'}>
            Opplysningene tilsier at det kan være tilhørighet utenfor Norge. Forutgående medlemskap må vurderes manuelt.
          </Alert>
        )}

        {harYrkesskade && (
          <Alert variant={'success'} title={'Bruker har yrkesskade'} size={'small'} className={'fit-content'}>
            Brukeren har en yrkesskade med godkjent årsakssammenheng med den nedsatte arbeidsevnen. Vilkåret i § 11-2 om
            forutgående medlemskap gjelder ikke.
          </Alert>
        )}

        <div>
          <BodyShort spacing weight={'semibold'} size={'small'}>
            Indikasjoner på tilhørighet til Norge
          </BodyShort>
          <TilhørigetsVurderingTabell
            vurdering={vurdering.tilhørighetVurdering.filter((e) => e.indikasjon === 'I_NORGE')}
            oppfyllerOpplysningeneKraveneTekst={'Tilsier opplysningene at brukeren oppfyller kravene til medlemskap?'}
            oppfyllerOpplysningeneKravene={vurdering.tilhørighetVurdering
              .filter((vurdering) => vurdering.indikasjon === 'I_NORGE')
              .some((vurdering) => vurdering.resultat)}
          />
        </div>
        <div>
          <BodyShort weight={'semibold'} spacing size={'small'}>
            Indikasjoner på tilhørighet utenfor Norge
          </BodyShort>
          <TilhørigetsVurderingTabell
            vurdering={vurdering.tilhørighetVurdering.filter((e) => e.indikasjon === 'UTENFOR_NORGE')}
            oppfyllerOpplysningeneKraveneTekst={'Tilsier opplysningene at brukeren har tilhørighet til Norge?'}
            oppfyllerOpplysningeneKravene={vurdering.tilhørighetVurdering
              .filter((vurdering) => vurdering.indikasjon === 'UTENFOR_NORGE')
              .every((vurdering) => !vurdering.resultat)}
          />
        </div>
        {visOverstyrKnapp && (
          <HStack justify={'space-between'} align={'end'}>
            {visOverstyringsBehov ? (
              <Button variant={'secondary'} onClick={() => setOverstyring(false)}>
                Angre overstyring
              </Button>
            ) : (
              <Button variant={'secondary'} onClick={() => setOverstyring(true)}>
                Overstyr
              </Button>
            )}
            <Detail>Vurdert automatisk</Detail>
          </HStack>
        )}
      </VStack>
    </VilkårsKort>
  );
};
