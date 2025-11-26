import { VStack } from '@navikt/ds-react';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { PeriodisertManuellVurderingForForutgåendeMedlemskapResponse } from 'lib/types/types';
import { SpørsmålOgSvar } from 'components/sporsmaalogsvar/SpørsmålOgSvar';

type Props = {
  vurdering: PeriodisertManuellVurderingForForutgåendeMedlemskapResponse;
};

export const ForutgåendeMedlemskapTidligereVurdering = ({ vurdering }: Props) => {
  return (
    <VStack gap="5">
      <SpørsmålOgSvar spørsmål="Vurderingen gjelder fra" svar={formaterDatoForFrontend(vurdering.fom)} />
      <SpørsmålOgSvar spørsmål="Vurder brukerens forutgående medlemskap" svar={vurdering.begrunnelse} />
      <SpørsmålOgSvar
        spørsmål="Har brukeren fem års forutgående medlemskap i folketrygden jf. § 11-2?"
        svar={vurdering.harForutgåendeMedlemskap ? 'Ja' : 'Nei'}
      />
      {!vurdering.harForutgåendeMedlemskap && (
        <SpørsmålOgSvar
          spørsmål="Oppfyller brukeren noen av unntaksvilkårene?"
          svar={
            vurdering.varMedlemMedNedsattArbeidsevne === true || vurdering.medlemMedUnntakAvMaksFemAar === true
              ? 'Ja'
              : 'Nei'
          }
        />
      )}
    </VStack>
  );
};
