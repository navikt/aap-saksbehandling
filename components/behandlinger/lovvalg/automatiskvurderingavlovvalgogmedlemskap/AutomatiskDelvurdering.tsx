import { ReadMore, VStack } from '@navikt/ds-react';
import { AutomatiskLovvalgOgMedlemskapVurdering } from 'lib/types/types';
import { TilhørighetsVurderingTabeller } from 'components/behandlinger/lovvalg/automatiskvurderingavlovvalgogmedlemskap/TilhørighetsVurderingTabeller';

interface Props {
  delvurdering?: AutomatiskLovvalgOgMedlemskapVurdering;
}

export const AutomatiskDelvurdering = ({ delvurdering }: Props) => {
  if (!delvurdering) {
    return <div>Intet her</div>;
    // return null;
  }

  return (
    <VStack gap={'space-8'}>
      <ReadMore size={'small'} header={'Vis aktuelle delvurderinger'}>
        <TilhørighetsVurderingTabeller vurdering={delvurdering} />
      </ReadMore>
    </VStack>
  );
};
