import { VStack } from '@navikt/ds-react/Stack';
import { SpørsmålOgSvar } from 'components/sporsmaalogsvar/SpørsmålOgSvar';
import { getJaEllerNei } from 'lib/utils/form';
import { Avslag11_27Vurdering } from 'lib/types/types';

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
          <SpørsmålOgSvar spørsmål={'Hvilken ytelse har brukeren?'} svar={vurdering.brukersYtelse} />
        )}
      {vurdering.harSykepengegrunnlagOver2G !== null && vurdering.harSykepengegrunnlagOver2G !== undefined && (
        <SpørsmålOgSvar
          spørsmål={'Har brukeren sykepengegrunnlag større enn 2G?'}
          svar={getJaEllerNei(vurdering.harSykepengegrunnlagOver2G)}
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
