import { VStack } from '@navikt/ds-react';
import { Avslag11_27Vurdering } from 'lib/types/types';
import { getJaEllerNei } from 'lib/utils/form';
import { formaterTilNok, storForbokstavOgMellomromForUnderstrek } from 'lib/utils/string';

import { SpørsmålOgSvar } from 'components/sporsmaalogsvar/SpørsmålOgSvar';
import { formaterDatoForFrontend } from 'lib/utils/date';

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
      {vurdering.harAnnenFullYtelse !== null &&
        vurdering.harAnnenFullYtelse !== undefined &&
        vurdering.brukersYtelse !== null &&
        vurdering.brukersYtelse !== undefined && (
          <SpørsmålOgSvar
            spørsmål={'Hvilken ytelse har brukeren?'}
            svar={storForbokstavOgMellomromForUnderstrek(vurdering.brukersYtelse)}
          />
        )}
      {vurdering.harAnnenFullYtelse !== null &&
        vurdering.harAnnenFullYtelse !== undefined &&
        vurdering.brukersYtelseTom !== null &&
        vurdering.brukersYtelseTom !== undefined && (
          <SpørsmålOgSvar
            spørsmål={'Bruker har annen full ytelse til og med dato'}
            svar={formaterDatoForFrontend(vurdering.brukersYtelseTom)}
          />
        )}
      {vurdering.sykepengegrunnlag !== null && vurdering.sykepengegrunnlag !== undefined && (
        <SpørsmålOgSvar
          spørsmål={'Brukerens sykepengegrunnlag (årssats)'}
          svar={formaterTilNok(vurdering.sykepengegrunnlag.verdi)}
        />
      )}
      {vurdering.harArbeidsgiverSykepengerUtbetaling !== null &&
        vurdering.harArbeidsgiverSykepengerUtbetaling !== undefined && (
          <SpørsmålOgSvar
            spørsmål={'Utbetaler arbeidsgiver sykepenger til bruker?'}
            svar={getJaEllerNei(vurdering.harArbeidsgiverSykepengerUtbetaling)}
          />
        )}
      {vurdering.skalAvslås1127 !== null && vurdering.skalAvslås1127 !== undefined && (
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
