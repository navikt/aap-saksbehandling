'use client';

import { Accordion, Button, Detail, HStack, VStack } from '@navikt/ds-react';
import { VilkårsKort } from 'components/vilkaarskort/Vilkårskort';
import { DelvurderingForKrav } from 'lib/types/types';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { TilhørighetsVurderingTabeller } from 'components/behandlinger/lovvalg/automatiskvurderingavlovvalgogmedlemskap/TilhørighetsVurderingTabeller';
import { Dispatch, SetStateAction } from 'react';
import { Alert } from 'components/alert/Alert';

interface Props {
  delvurderinger: DelvurderingForKrav[];
  setOverstyring: Dispatch<SetStateAction<boolean>>;
  visOverstyrKnapp?: boolean;
  visOverstyringsBehov?: boolean;
}
export const AutomatiskVurderingAvLovvalgOgMedlemskap = ({
  delvurderinger,
  setOverstyring,
  visOverstyrKnapp,
  visOverstyringsBehov,
}: Props) => {
  const delvurderingerNyesteFørst = [...delvurderinger].sort((a, b) => b.relevantDato.localeCompare(a.relevantDato));

  return (
    <VilkårsKort heading={'Automatisk vurdering av lovvalg og medlemskap'} steg={'VURDER_LOVVALG'}>
      <VStack gap={'space-28'} paddingBlock={'space-4'}>
        {delvurderingerNyesteFørst.length > 0 && (
          <Accordion size={'small'} indent={false}>
            {delvurderingerNyesteFørst.map(({ relevantDato, delvurdering }, index) => (
              <Accordion.Item key={`${relevantDato}-${index}`} defaultOpen={index === 0}>
                <Accordion.Header>Gjelder fra {formaterDatoForFrontend(relevantDato)}</Accordion.Header>
                <Accordion.Content>
                  <VStack gap={'space-28'} paddingBlock={'space-12'}>
                    {!delvurdering.kanBehandlesAutomatisk && (
                      <Alert variant={'warning'} title={'Til manuell vurdering'} className={'fit-content'}>
                        Opplysningene tilsier at det kan være utenlandsk lovvalg eller manglende medlemskap. Lovvalg og
                        medlemskap må vurderes manuelt.
                      </Alert>
                    )}
                    <TilhørighetsVurderingTabeller vurdering={delvurdering} />
                  </VStack>
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion>
        )}
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
