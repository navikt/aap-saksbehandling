import { BodyShort, Label, VStack } from '@navikt/ds-react';
import { VilkårsKort } from 'components/vilkårskort/Vilkårskort';
import { YrkesskadeVurderingGrunnlag } from 'lib/types/types';
import { KelvinAlert } from 'components/alert/KelvinAlert';

interface YrkesskadeInfoProps {
  grunnlag: YrkesskadeVurderingGrunnlag;
}

export const OppgittYrkesskadeUtenRegistertreffInfo = ({ grunnlag }: YrkesskadeInfoProps) => {
  return (
    <VilkårsKort heading={'§ 11-22 AAP ved yrkesskade'} steg={'VURDER_YRKESSKADE'} defaultOpen={true}>
      <VStack gap="space-16" style={{ marginBottom: 24 }}>
        <div>
          <Label size="medium">Relevant informasjon fra søknad</Label>
          <BodyShort size="small" style={{ marginTop: 2 }}>
            Har du yrkesskade eller yrkessykdom som påvirker hvor mye du kan arbeide?{' '}
            {grunnlag.opplysninger.oppgittYrkesskadeISøknad ? 'Ja' : 'Nei'}
          </BodyShort>
        </div>
        <KelvinAlert variant="info" style={{ maxWidth: 600 }}>
          Det er ingen registrerte yrkesskader på brukeren.
        </KelvinAlert>
      </VStack>
    </VilkårsKort>
  );
};
