import { SvarFraAndreinstansGrunnlag } from 'lib/types/types';
import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { BodyShort, HStack, VStack } from '@navikt/ds-react';
import { formaterSvartype, formaterUtfall } from 'lib/utils/svarfraandreinstans';

interface Props {
  grunnlag?: SvarFraAndreinstansGrunnlag;
  behandlingVersjon: number;
  readOnly?: boolean;
}

export const SvarFraAndreinstans = ({ grunnlag }: Props) => {
  const svarType = grunnlag?.svarFraAndreinstans.type;
  const utfall = grunnlag?.svarFraAndreinstans.utfall;
  const feilregistrertBegrunnelse = grunnlag?.svarFraAndreinstans.feilregistrertBegrunnelse;
  return (
    <VilkårsKort heading={'Håndter svar fra Nav Klageinstans'} steg={'SVAR_FRA_ANDREINSTANS'}>
      <VStack gap={'4'}>
        {svarType && (
          <HStack gap="2">
            <BodyShort weight="semibold">Type svar:</BodyShort>
            <BodyShort>{formaterSvartype(svarType)}</BodyShort>
          </HStack>
        )}
        {utfall && (
          <HStack gap="2">
            <BodyShort weight="semibold">Utfall:</BodyShort>
            <BodyShort>{grunnlag?.svarFraAndreinstans.utfall && formaterUtfall(utfall)}</BodyShort>
          </HStack>
        )}
        {feilregistrertBegrunnelse && (
          <HStack gap="2">
            <BodyShort weight="semibold">Begrunnelse for feilregistrering:</BodyShort>
            <BodyShort>{feilregistrertBegrunnelse}</BodyShort>
          </HStack>
        )}
      </VStack>
    </VilkårsKort>
  );
};
