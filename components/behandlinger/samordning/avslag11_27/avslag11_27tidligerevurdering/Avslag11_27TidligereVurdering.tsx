import { VStack } from '@navikt/ds-react';
import { Avslag11_27Vurdering } from 'lib/types/types';
import { getJaEllerNei } from 'lib/utils/form';
import { formaterTilNok, storForbokstavOgMellomromForUnderstrek } from 'lib/utils/string';

import { SpørsmålOgSvar } from 'components/sporsmaalogsvar/SpørsmålOgSvar';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { isNullOrUndefined } from 'lib/utils/validering';

interface Props {
  vurdering: Avslag11_27Vurdering;
}

export const Avslag11_27TidligereVurdering = ({ vurdering }: Props) => {
  return (
    <VStack gap={'space-16'}>
      <SpørsmålOgSvar spørsmål={'Begrunnelse'} svar={vurdering.begrunnelse} />
      <SpørsmålOgSvar
        spørsmål={'Har brukeren en annen ytelse som regnes som full ytelse fra folketrygden?'}
        svar={getJaEllerNei(vurdering.harAnnenFullYtelse)}
      />
      {vurdering.harAnnenFullYtelse && vurdering.brukersYtelse && (
        <SpørsmålOgSvar
          spørsmål={'Hvilken ytelse har brukeren?'}
          svar={storForbokstavOgMellomromForUnderstrek(vurdering.brukersYtelse)}
        />
      )}
      {vurdering.harAnnenFullYtelse && vurdering.brukersYtelseTom && (
        <SpørsmålOgSvar
          spørsmål={'Bruker har annen full ytelse til og med dato'}
          svar={formaterDatoForFrontend(vurdering.brukersYtelseTom)}
        />
      )}
      {vurdering.sykepengegrunnlag && (
        <SpørsmålOgSvar
          spørsmål={'Brukerens sykepengegrunnlag (årssats)'}
          svar={formaterTilNok(vurdering.sykepengegrunnlag.verdi)}
        />
      )}
      {!isNullOrUndefined(vurdering.harArbeidsgiverSykepengerUtbetaling) && (
        <SpørsmålOgSvar
          spørsmål={'Utbetaler arbeidsgiver sykepenger til bruker?'}
          svar={getJaEllerNei(vurdering.harArbeidsgiverSykepengerUtbetaling)}
        />
      )}
      {!isNullOrUndefined(vurdering.skalAvslås1127) && (
        <SpørsmålOgSvar
          spørsmål={
            'Skal søknaden avslås etter § 11-27 fordi det er for tidlig å vurdere vilkårene for AAP mens brukeren har en annen ytelse?'
          }
          svar={getJaEllerNei(vurdering.skalAvslås1127)}
        />
      )}
    </VStack>
  );
};
