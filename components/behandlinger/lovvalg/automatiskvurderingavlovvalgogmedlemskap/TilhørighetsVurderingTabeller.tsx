import { BodyShort, VStack } from '@navikt/ds-react';
import { AutomatiskLovvalgOgMedlemskapVurdering } from 'lib/types/types';
import { TilhørighetsVurderingTabell } from 'components/behandlinger/lovvalg/automatiskvurderingavlovvalgogmedlemskap/TilhørighetsVurderingTabell';

interface Props {
  vurdering: AutomatiskLovvalgOgMedlemskapVurdering;
}

export const TilhørighetsVurderingTabeller = ({ vurdering }: Props) => {
  const iNorge = vurdering.tilhørighetVurdering.filter((e) => e.indikasjon === 'I_NORGE');
  const utenforNorge = vurdering.tilhørighetVurdering.filter((e) => e.indikasjon === 'UTENFOR_NORGE');

  return (
    <VStack gap={'space-28'}>
      <div>
        <BodyShort spacing size={'small'} weight={'semibold'}>
          Indikasjoner på tilhørighet til Norge
        </BodyShort>
        <TilhørighetsVurderingTabell
          vurdering={iNorge}
          oppfyllerOpplysningeneKraveneTekst={'Tilsier opplysningene at brukeren oppfyller kravene til medlemskap?'}
          oppfyllerOpplysningeneKravene={iNorge.some((x) => x.resultat)}
        />
      </div>
      <div>
        <BodyShort spacing size={'small'} weight={'semibold'}>
          Indikasjoner på tilhørighet utenfor Norge
        </BodyShort>
        <TilhørighetsVurderingTabell
          vurdering={utenforNorge}
          oppfyllerOpplysningeneKraveneTekst={'Tilsier opplysningene at brukeren har tilhørighet til Norge?'}
          oppfyllerOpplysningeneKravene={utenforNorge.every((x) => !x.resultat)}
        />
      </div>
    </VStack>
  );
};
