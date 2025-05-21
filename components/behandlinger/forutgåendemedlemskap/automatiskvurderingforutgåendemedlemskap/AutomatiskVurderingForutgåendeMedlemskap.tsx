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
export const AutomatiskVurderingForutgåendeMedlemskap = ({
  vurdering,
  setOverstyring,
  visOverstyrKnapp,
  visOverstyringsBehov,
}: Props) => {
  return (
    <VilkårsKort heading={'Automatisk vurdering av forutgående medlemskap'} steg={'VURDER_MEDLEMSKAP'}>
      <VStack gap={'5'}>
        <div>
          <BodyShort spacing weight={'semibold'} size={'small'}>
            Indikasjoner på tilhørighet til Norge
          </BodyShort>
          <TilhørigetsVurderingTabell
            vurdering={vurdering.tilhørighetVurdering.filter((e) => e.indikasjon === 'I_NORGE')}
            oppfyllerOpplysningeneKraveneTekst={'Tilsier opplysningene at brukeren oppfyller kravene til medlemskap?'}
            oppfyllerOpplysningeneKravene={vurdering.tilhørighetVurdering
              .filter((e) => e.indikasjon === 'I_NORGE')
              .every((x) => x.resultat)}
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
              .filter((e) => e.indikasjon === 'UTENFOR_NORGE')
              .every((x) => x.resultat)}
          />
        </div>
        {!vurdering.kanBehandlesAutomatisk && (
          <Alert variant={'warning'} title={'Til manuell vurdering'} size={'small'}>
            Opplysningene tilsier at det kan være tilhørighet utenfor Norge. Forutgående medlemskap må vurderes manuelt.
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
