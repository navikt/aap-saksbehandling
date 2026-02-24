import { VStack } from '@navikt/ds-react';
import { SpørsmålOgSvar } from 'components/sporsmaalogsvar/SpørsmålOgSvar';
import { Dato } from 'lib/types/Dato';
import { getJaNeiEllerIkkeBesvart } from 'lib/utils/form';
import { StudentVurderingResponse } from 'lib/types/types';
import { formaterDatoForFrontend } from 'lib/utils/date';

interface Props {
  vurdering: StudentVurderingResponse;
}

export const VedtattStudentVurderinger = ({ vurdering }: Props) => {
  return (
    <VStack gap="5">
      <SpørsmålOgSvar spørsmål={'Vurderingen gjelder fra'} svar={new Dato(vurdering.fom).formaterForFrontend()} />
      <SpørsmålOgSvar spørsmål={'Vurder §11-14 og vilkårene i §7 i forskriften'} svar={vurdering.begrunnelse} />
      <SpørsmålOgSvar
        spørsmål={'Har brukeren avbrutt et studie?'}
        svar={getJaNeiEllerIkkeBesvart(vurdering.harAvbruttStudie)}
      />

      {vurdering.godkjentStudieAvLånekassen && (
        <SpørsmålOgSvar
          spørsmål={'Er studiet godkjent av Lånekassen?'}
          svar={getJaNeiEllerIkkeBesvart(vurdering.godkjentStudieAvLånekassen)}
        />
      )}
      {vurdering.avbruttPgaSykdomEllerSkade !== null && (
        <SpørsmålOgSvar
          spørsmål={'Er studie avbrutt pga sykdom eller skade?'}
          svar={getJaNeiEllerIkkeBesvart(vurdering.avbruttPgaSykdomEllerSkade)}
        />
      )}
      {vurdering.harBehovForBehandling !== null && (
        <SpørsmålOgSvar
          spørsmål={'Har brukeren behov for behandling for å gjenoppta studiet?'}
          svar={getJaNeiEllerIkkeBesvart(vurdering.harBehovForBehandling)}
        />
      )}

      {vurdering.avbruddMerEnn6Måneder !== null && (
        <SpørsmålOgSvar
          spørsmål={'Er det forventet at brukeren kan gjenoppta studiet innen 6 måneder?'}
          svar={getJaNeiEllerIkkeBesvart(vurdering.avbruddMerEnn6Måneder)}
        />
      )}

      {vurdering.avbruttStudieDato && (
        <SpørsmålOgSvar
          spørsmål={'Når ble studieevnen 100% nedsatt / når ble studiet avbrutt?'}
          svar={formaterDatoForFrontend(vurdering.avbruttStudieDato)}
        />
      )}
    </VStack>
  );
};
