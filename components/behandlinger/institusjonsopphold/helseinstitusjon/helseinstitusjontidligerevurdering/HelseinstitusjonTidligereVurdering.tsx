import { VStack } from '@navikt/ds-react';
import { SpørsmålOgSvar } from 'components/sporsmaalogsvar/SpørsmålOgSvar';
import { HelseInstiusjonVurdering } from 'lib/types/types';
import { getJaEllerNei } from 'lib/utils/form';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { erReduksjonUtIFraVurdering } from 'lib/utils/institusjonsopphold';

interface Props {
  vurdering: HelseInstiusjonVurdering;
}

export const HelseinstitusjonTidligereVurdering = ({ vurdering }: Props) => {
  const vurderingErReduksjon = erReduksjonUtIFraVurdering(vurdering);

  return (
    <VStack gap={'4'}>
      <SpørsmålOgSvar spørsmål={'Begrunnelse'} svar={vurdering.begrunnelse} />
      <SpørsmålOgSvar spørsmål={'Får brukeren fri kost og losji?'} svar={getJaEllerNei(vurdering.faarFriKostOgLosji)} />
      {vurdering.forsoergerEktefelle !== null && vurdering.forsoergerEktefelle !== undefined && (
        <SpørsmålOgSvar
          spørsmål={'Forsørger brukeren ektefelle eller tilsvarende?'}
          svar={getJaEllerNei(vurdering.forsoergerEktefelle)}
        />
      )}
      {vurdering.harFasteUtgifter !== null && vurdering.harFasteUtgifter !== undefined && (
        <SpørsmålOgSvar
          spørsmål={'Har brukeren faste utgifter nødvendig for å beholde bolig og andre eiendeler?'}
          svar={getJaEllerNei(vurdering.harFasteUtgifter)}
        />
      )}

      {vurderingErReduksjon && (
        <SpørsmålOgSvar
          spørsmål={'Oppgi dato for reduksjon av AAP'}
          svar={formaterDatoForFrontend(vurdering.periode.fom)}
        />
      )}
    </VStack>
  );
};
